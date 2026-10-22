const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Formats an ISO date (YYYY-MM-DD or full timestamp) as "Jan 28, 2026" without depending on the runtime locale. */
export const formatDate = (value: string | null | undefined): string => {
    if (!value) return ''

    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
    if (!match) return value

    const [, year, month, day] = match
    const monthLabel = MONTHS[Number(month) - 1]

    if (!monthLabel) return value

    return `${monthLabel} ${Number(day)}, ${year}`
}

/** Short numeric date used in metadata rows, for example "28.01.26". */
export const formatShortDate = (value: string | null | undefined): string => {
    if (!value) return ''

    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
    if (!match) return value

    const [, year, month, day] = match
    return `${day}.${month}.${year.slice(2)}`
}

/** Estimated reading time in minutes from the stored body length (characters). */
export const estimateReadingMinutes = (bodyLength: number | null | undefined): number => {
    if (!bodyLength || bodyLength <= 0) return 1

    const words = bodyLength / 6.2
    return Math.max(1, Math.round(words / 220))
}

export const pad = (value: number, size = 2): string => String(value).padStart(size, '0')

export const slugify = (value: string): string => value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
