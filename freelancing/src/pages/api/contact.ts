import type { NextApiRequest, NextApiResponse } from 'next'

import { query } from '@/lib/db'

interface ContactResponse {
    ok: boolean
    error?: string
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const handler = async (
    request: NextApiRequest,
    response: NextApiResponse<ContactResponse>
): Promise<void> => {
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST')
        response.status(405).json({ ok: false, error: 'Method not allowed.' })

        return
    }

    const body = request.body as Record<string, unknown>

    /* Honeypot: real people never fill this in. */
    if (typeof body.website === 'string' && body.website.trim().length > 0) {
        response.status(200).json({ ok: true })

        return
    }

    const name = String(body.name ?? '').trim()
    const email = String(body.email ?? '').trim()
    const message = String(body.message ?? '').trim()

    if (!name || !email || !message) {
        response
            .status(400)
            .json({ ok: false, error: 'Please fill in every field.' })

        return
    }

    if (!EMAIL.test(email)) {
        response
            .status(400)
            .json({ ok: false, error: 'That email address looks wrong.' })

        return
    }

    if (name.length > 120 || email.length > 190 || message.length > 5000) {
        response
            .status(400)
            .json({ ok: false, error: 'That message is a little too long.' })

        return
    }

    try {
        await query(
            'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
            [name, email, message]
        )

        response.status(200).json({ ok: true })
    } catch (writeError) {
        console.error('[contact] failed to store submission:', writeError)

        response.status(500).json({
            ok: false,
            error: 'The message could not be saved. Please try again.'
        })
    }
}

export default handler
