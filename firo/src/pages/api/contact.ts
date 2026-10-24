import type { NextApiRequest, NextApiResponse } from 'next'
import { sendEmail } from '@/lib/modulify/email'

type Response = { ok: true } | { ok: false, message: string }
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/
const interestOptions = new Set(['A new home', 'Project information', 'A conversation'])
const recentSubmissions = new Map<string, number[]>()

const clean = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : ''
const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, message: 'Method not allowed.' }) }

    const data = req.body && typeof req.body === 'object' ? req.body as Record<string, unknown> : {}
    const name = clean(data.name, 120)
    const email = clean(data.email, 200).toLowerCase()
    const phone = clean(data.phone, 40)
    const interest = clean(data.interest, 80)
    const message = clean(data.message, 2000)
    if (clean(data.company, 200)) return res.status(200).json({ ok: true })
    if (!name) return res.status(400).json({ ok: false, message: 'Please enter your name.' })
    if (!emailPattern.test(email)) return res.status(400).json({ ok: false, message: 'Please enter a valid email address.' })
    if (!/^[0-9+().\-\s]{7,40}$/.test(phone)) return res.status(400).json({ ok: false, message: 'Please enter a valid phone number.' })
    if (interest && !interestOptions.has(interest)) return res.status(400).json({ ok: false, message: 'Please choose a valid interest.' })

    const recipient = process.env.CONTACT_TO_EMAIL?.trim()
    if (!recipient || !process.env.EMAIL_URL || !process.env.EMAIL_PRIVATE_KEY) return res.status(503).json({ ok: false, message: 'Enquiries are not connected yet. Please try again later.' })

    const forwarded = req.headers['x-forwarded-for']
    const client = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown'
    const now = Date.now()
    const recent = (recentSubmissions.get(client) || []).filter(time => now - time < 600000)
    if (recent.length >= 5) return res.status(429).json({ ok: false, message: 'Too many enquiries. Please try again in a few minutes.' })
    recentSubmissions.set(client, [...recent, now])

    const lines = [`Name: ${name}`, `Email: ${email}`, `Phone: ${phone}`, `Interested in: ${interest || 'Not specified'}`, `Message: ${message || 'Not provided'}`]
    try {
        const sent = await sendEmail({ to: recipient, replyTo: email, subject: `Aranya enquiry from ${name}`.slice(0, 200), text: lines.join('\n'), html: `<h2>New Aranya enquiry</h2>${lines.map(line => `<p>${escapeHtml(line)}</p>`).join('')}`, tags: [{ name: 'type', value: 'estate-contact' }] })
        if (!sent.accepted.includes(recipient)) throw new Error(sent.reason || 'The recipient was not accepted.')
        return res.status(200).json({ ok: true })
    } catch (error) {
        console.error('Contact email failed:', error instanceof Error ? error.message : error)
        return res.status(503).json({ ok: false, message: 'Your enquiry could not be sent right now. Please try again later.' })
    }
}
