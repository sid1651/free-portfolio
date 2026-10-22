import type { FC, ReactNode } from 'react'

import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { gsap, useGSAP } from '@/lib/gsap'

interface CounterProps {
    value: number
    decimals?: number
    prefix?: string
    suffix?: string
    duration?: number
    className?: string
}

/**
 * Renders the final number on the server, then counts up from zero the first time it scrolls into view.
 */
export const Counter: FC<CounterProps> = ({
    value,
    decimals = 0,
    prefix = '',
    suffix = '',
    duration = 1.8,
    className
}): ReactNode => {
    const ref = useRef<HTMLSpanElement>(null)
    const format = (current: number): string => `${prefix}${current.toFixed(decimals)}${suffix}`

    useGSAP(() => {
        const element = ref.current

        if (!element) return

        const media = gsap.matchMedia()

        media.add('(prefers-reduced-motion: no-preference)', () => {
            const state = { current: 0 }

            element.textContent = format(0)

            gsap.to(state, {
                current: value,
                duration,
                ease: 'power3.out',
                scrollTrigger: { trigger: element, start: 'top 90%', once: true },
                onUpdate: () => {
                    element.textContent = format(state.current)
                }
            })

            return () => {
                element.textContent = format(value)
            }
        })
    }, { dependencies: [value, decimals, prefix, suffix], scope: ref })

    return (
        <span ref={ref} className={cn('tabular-nums', className)}>
            {format(value)}
        </span>
    )
}
