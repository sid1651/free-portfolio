import type { FC, ReactNode } from 'react'

import { useEffect, useRef } from 'react'
import { pad } from '@/lib/format'

interface TimecodeProps {
    className?: string
    fps?: number
}

/** Running camera timecode (HH:MM:SS:FF). Starts at zero on the server and ticks after mount. */
export const Timecode: FC<TimecodeProps> = ({ className, fps = 24 }): ReactNode => {
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const start = performance.now()
        let frame = 0

        const render = (now: number): void => {
            const elapsed = (now - start) / 1000
            const hours = Math.floor(elapsed / 3600)
            const minutes = Math.floor((elapsed % 3600) / 60)
            const seconds = Math.floor(elapsed % 60)
            const frames = Math.floor((elapsed % 1) * fps)

            element.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`
            frame = requestAnimationFrame(render)
        }

        frame = requestAnimationFrame(render)
        return () => cancelAnimationFrame(frame)
    }, [fps])

    return (
        <span ref={ref} className={className}>
            00:00:00:00
        </span>
    )
}
