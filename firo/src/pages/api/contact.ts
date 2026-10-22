import type { NextApiRequest, NextApiResponse } from 'next'

import { query } from '@/lib/db'
import { getEmailQuota, sendEmail } from '@/lib/modulify/email'
import { contactPageContent } from '@/constants/content'

type ContactResponse = { ok: true } | { ok: false, message: string }

type Inquiry = {
    name: string
    email: string
    phone: string
    interests: string[]
    message: string
}

const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT = 5
const recentSubmissions = new Map<string, number[]>()

const clean = (value: unknown, max: number): string => (typeof value === 'string' ? value.trim().slice(0, max) : '')

const escapeHtml = (value: string): string => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const clientKey = (req: NextApiRequest): string => {
    const forwarded = req.headers['x-forwarded-for']
    const value = Array.isArray(forwarded) ? forwarded[0] : forwarded
    return (value?.split(',')[0] ?? req.socket.remoteAddress ?? 'unknown').trim()
}

const isRateLimited = (key: string): boolean => {
    const now = Date.now()
    const recent = (recentSubmissions.get(key) ?? []).filter(time => now - time < RATE_WINDOW_MS)

    if (recent.length >= RATE_LIMIT) {
        recentSubmissions.set(key, recent)
        return true
    }

    recent.push(now)
    recentSubmissions.set(key, recent)
    return false
}

const parseInquiry = (body: unknown): { inquiry: Inquiry, honeypot: string } | { error: string } => {
    const data = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>

    const name = clean(data.name, 120)
    const email = clean(data.email, 200).toLowerCase()
    const phone = clean(data.phone, 40)
    const message = clean(data.message, 5000)
    const honeypot = clean(data.company, 200)
    const allowed = new Set(contactPageContent.interests)
    const interests = Array.isArray(data.interests)
        ? data.interests.filter((item): item is string => typeof item === 'string' && allowed.has(item)).slice(0, allowed.size)
        : []

    if (!name) return { error: 'Please tell us your name.' }
    if (!email || !EMAIL_PATTERN.test(email)) return { error: 'Please enter a valid email address.' }
    if (phone && !/^[0-9+().\-\s]{5,40}$/.test(phone)) return { error: 'Please check your phone number.' }

    return { inquiry: { name, email, phone, interests, message }, honeypot }
}

const notifyStudio = async (inquiry: Inquiry, inquiryId: string): Promise<void> => {
    const { fromAddress } = await getEmailQuota()

    const rows = [
        ['Name', inquiry.name],
        ['Email', inquiry.email],
        ['Phone', inquiry.phone || 'Not provided'],
        ['Interested in', inquiry.interests.length ? inquiry.interests.join(', ') : 'Not specified'],
        ['Message', inquiry.message || 'No message']
    ]

    const html = `
        <div style="font-family: Arial, Helvetica, sans-serif; color: #0b0b0a; max-width: 560px;">
            <p style="font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #5c574f; margin: 0 0 8px;">NOVAIR Studio / New inquiry</p>
            <h1 style="font-size: 24px; margin: 0 0 24px;">${escapeHtml(inquiry.name)} wants to start a project</h1>
            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                ${rows.map(([label, value]) => `
                    <tr>
                        <td style="padding: 12px 0; border-top: 1px solid #ddd6ca; color: #5c574f; width: 140px; vertical-align: top;">${escapeHtml(label)}</td>
                        <td style="padding: 12px 0; border-top: 1px solid #ddd6ca; white-space: pre-wrap;">${escapeHtml(value)}</td>
                    </tr>
                `).join('')}
            </table>
            <p style="font-size: 13px; color: #5c574f; margin-top: 24px;">Reply to this email to answer ${escapeHtml(inquiry.name)} directly.</p>
        </div>
    `

    const text = [
        'NOVAIR Studio / New inquiry',
        '',
        ...rows.map(([label, value]) => `${label}: ${value}`),
        '',
        `Reply to this email to answer ${inquiry.name} directly.`
    ].join('\n')

    await sendEmail({
        to: fromAddress,
        replyTo: inquiry.email,
        subject: `New inquiry from ${inquiry.name}`.slice(0, 200),
        html,
        text,
        tags: [{ name: 'type', value: 'contact-inquiry' }],
        idempotencyKey: `inquiry-${inquiryId}`
    })
}

const handler = async (req: NextApiRequest, res: NextApiResponse<ContactResponse>): Promise<void> => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        res.status(405).json({ ok: false, message: 'Method not allowed.' })
        return
    }

    const parsed = parseInquiry(req.body)

    if ('error' in parsed) {
        res.status(400).json({ ok: false, message: parsed.error })
        return
    }

    // Bots fill the hidden field; pretend everything went fine and store nothing.
    if (parsed.honeypot) {
        res.status(200).json({ ok: true })
        return
    }

    if (isRateLimited(clientKey(req))) {
        res.status(429).json({ ok: false, message: 'Too many messages in a short time. Please try again in a few minutes.' })
        return
    }

    const { inquiry } = parsed
    let inquiryId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    let saved = false
    let notified = false

    try {
        const rows = await query<{ id: string }>(
            'INSERT INTO inquiries (name, email, phone, interests, message) VALUES (?, ?, ?, ?, ?) RETURNING id',
            [inquiry.name, inquiry.email, inquiry.phone || null, JSON.stringify(inquiry.interests), inquiry.message || null]
        )

        if (rows[0]?.id) inquiryId = rows[0].id
        saved = true
    }
    catch (error) {
        console.error('Inquiry could not be saved:', error instanceof Error ? error.message : error)
    }

    try {
        await notifyStudio(inquiry, inquiryId)
        notified = true
    }
    catch (error) {
        console.error('Inquiry notification failed:', error instanceof Error ? error.message : error)
    }

    if (!saved && !notified) {
        res.status(503).json({ ok: false, message: 'We could not send your message right now. Please email us directly.' })
        return
    }

    res.status(200).json({ ok: true })
}

export default handler
