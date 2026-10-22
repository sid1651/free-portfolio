interface DatabaseResponse<T> {
    success?: boolean
    rows?: T[]
    result?: Array<{ results?: T[] }>
    errors?: Array<{ message?: string }>
}

/**
 * Runs one parameterized statement against the project database over HTTP.
 * Server-only: call it from API routes or getServerSideProps, never from the browser.
 */
export const query = async <T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> => {
    if (typeof window !== 'undefined') throw new Error('@/lib/db is server-only and must not be used in a client component.')

    const url = process.env.DATABASE_URL
    const token = process.env.DATABASE_TOKEN

    if (!url || !token) throw new Error('The database is not configured for this environment.')

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ sql, params })
    })

    const payload = (await response.json().catch(() => null)) as DatabaseResponse<T> | null

    if (!response.ok || !payload || payload.success === false) {
        const message = payload?.errors?.map((error) => error.message).filter(Boolean).join('; ')

        throw new Error(message || `Database request failed with status ${response.status}.`)
    }

    return payload.rows ?? payload.result?.[0]?.results ?? []
}
