import type { NextApiRequest, NextApiResponse } from 'next'

import { query } from '@/lib/db'
import { FINISHES } from '@/constants/site'

type ReserveResponse = { ok: true } | { ok: false; error: string }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const readBody = (body: unknown): Record<string, unknown> => {
    if (typeof body === 'string') {
        try {
            const parsed: unknown = JSON.parse(body)

            return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : {}
        } catch {
            return {}
        }
    }

    return body && typeof body === 'object' ? body as Record<string, unknown> : {}
}

const handler = async (req: NextApiRequest, res: NextApiResponse<ReserveResponse>): Promise<void> => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        res.status(405).json({ ok: false, error: 'Method not allowed.' })
        return
    }

    const body = readBody(req.body)
    const email = String(body.email ?? '').trim().toLowerCase()
    const finish = FINISHES.find((item) => item.id === body.finish)
    const trap = String(body.company ?? '').trim()

    // Silently accept bot submissions that fill the hidden field, without storing them.
    if (trap) {
        res.status(200).json({ ok: true })
        return
    }

    if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
        res.status(400).json({ ok: false, error: 'Please enter a valid email address.' })
        return
    }

    if (!finish) {
        res.status(400).json({ ok: false, error: 'Please choose a finish.' })
        return
    }

    try {
        await query(
            'INSERT INTO reservations (email, finish) VALUES (?, ?) ON CONFLICT(email) DO UPDATE SET finish = excluded.finish',
            [email, finish.name]
        )

        res.status(200).json({ ok: true })
    } catch (error) {
        console.error('Reservation could not be saved', error)
        res.status(500).json({ ok: false, error: 'We could not save your reservation just now. Please try again in a moment.' })
    }
}

export default handler
