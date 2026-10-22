import type { FC, ReactNode } from 'react'

import { useEffect, useState } from 'react'

interface ClockProps {
    className?: string
    timeZone?: string
    label?: string
}

/** Local studio time. Renders a placeholder on the server and fills in after mount. */
export const Clock: FC<ClockProps> = ({ className, timeZone = 'Europe/Amsterdam', label = 'AMS' }): ReactNode => {
    const [time, setTime] = useState('--:--')

    useEffect(() => {
        const formatter = new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone
        })

        const update = (): void => setTime(formatter.format(new Date()))

        update()
        const interval = window.setInterval(update, 15000)

        return () => window.clearInterval(interval)
    }, [timeZone])

    return (
        <span className={className}>
            {label} {time}
        </span>
    )
}
