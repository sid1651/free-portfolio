import type { CSSProperties, FC, ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface MarqueeProps {
    children: ReactNode
    className?: string
    trackClassName?: string
    duration?: number
    reverse?: boolean
    pauseOnHover?: boolean
}

/** Endless horizontal loop. The content is rendered twice; the copy is hidden from assistive tech. */
export const Marquee: FC<MarqueeProps> = ({
    children,
    className,
    trackClassName,
    duration = 40,
    reverse = false,
    pauseOnHover = true
}): ReactNode => {
    const style = {
        '--marquee-duration': `${duration}s`,
        animationDirection: reverse ? 'reverse' : 'normal'
    } as CSSProperties

    return (
        <div className={cn('marquee relative flex overflow-hidden', className)}>
            <div
                className={cn('marquee-track flex w-max shrink-0', trackClassName)}
                style={style}
                data-pause-on-hover={pauseOnHover ? 'true' : 'false'}
            >
                <div className='flex shrink-0'>
                    {children}
                </div>

                <div className='flex shrink-0' aria-hidden='true'>
                    {children}
                </div>
            </div>
        </div>
    )
}
