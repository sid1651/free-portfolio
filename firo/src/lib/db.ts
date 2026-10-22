type QueryParam = string | number | null

type D1Payload<T> = {
    success?: boolean
    result?: { results?: T[] }[]
    rows?: unknown
    errors?: { message?: string }[]
    message?: string
}

export class DatabaseError extends Error {
    status: number

    constructor(message: string, status = 0) {
        super(message)
        this.name = 'DatabaseError'
        this.status = status
    }
}

const isRowObject = (row: unknown): boolean => Boolean(row) && typeof row === 'object' && !Array.isArray(row)

/**
 * Runs one SQL statement against the project database (SQLite over HTTP).
 * Server-only: call it from getStaticProps, getServerSideProps or an API route.
 */
export const query = async <T = Record<string, unknown>>(sql: string, params: QueryParam[] = []): Promise<T[]> => {
    if (typeof window !== 'undefined') throw new Error('The database helper is server-only.')

    const url = process.env.DATABASE_URL
    const token = process.env.DATABASE_TOKEN

    if (!url || !token) throw new DatabaseError('The database is not configured.')

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ sql, params }),
            signal: controller.signal
        })

        const payload = (await response.json().catch(() => null)) as D1Payload<T> | null

        if (!response.ok || !payload || payload.success === false) {
            const message = payload?.errors?.[0]?.message ?? payload?.message ?? `Database request failed (${response.status}).`
            throw new DatabaseError(message, response.status)
        }

        const results = payload.result?.[0]?.results

        if (Array.isArray(results)) return results

        if (Array.isArray(payload.rows) && payload.rows.every(isRowObject)) return payload.rows as T[]

        return []
    }
    catch (error) {
        if (error instanceof DatabaseError) throw error
        if (error instanceof Error && error.name === 'AbortError') throw new DatabaseError('The database did not answer in time.')

        throw new DatabaseError(error instanceof Error ? error.message : 'Unknown database error.')
    }
    finally {
        clearTimeout(timeout)
    }
}
