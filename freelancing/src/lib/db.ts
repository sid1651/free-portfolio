type SqlValue = string | number | null

interface D1Payload {
    success?: boolean
    rows?: unknown[]
    result?: { results?: unknown[] }[]
    errors?: { message?: string }[]
}

/**
 * Minimal server-only client for the project database. It speaks HTTP, not
 * the Postgres wire protocol, so it must never be imported from the browser.
 */
export const query = async <T = Record<string, unknown>>(
    sql: string,
    params: SqlValue[] = []
): Promise<T[]> => {
    const url = process.env.DATABASE_URL
    const token = process.env.DATABASE_TOKEN

    if (!url || !token) {
        throw new Error('The database connection is not available.')
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ sql, params })
    })

    if (!response.ok) {
        throw new Error(`Database request failed (${response.status}).`)
    }

    const payload = (await response.json()) as D1Payload

    if (payload.success === false) {
        throw new Error(payload.errors?.[0]?.message ?? 'Database error.')
    }

    const rows = payload.rows ?? payload.result?.[0]?.results ?? []

    return rows as T[]
}
