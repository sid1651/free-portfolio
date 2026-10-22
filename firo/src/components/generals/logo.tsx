import type { FC, ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface LogoMarkProps {
    className?: string
}

/** The NOVAIR mark: an orbit with a single burst of light. */
export const LogoMark: FC<LogoMarkProps> = ({ className }): ReactNode => {
    return (
        <svg
            viewBox='0 0 32 32'
            fill='none'
            aria-hidden='true'
            className={cn('size-6', className)}
        >
            <circle cx='15' cy='17' r='10.5' stroke='currentColor' strokeWidth='2.4' />
            <circle cx='25.5' cy='6.5' r='3.5' fill='currentColor' />
        </svg>
    )
}

interface LogoProps {
    className?: string
    withMark?: boolean
    withStudio?: boolean
}

export const Logo: FC<LogoProps> = ({ className, withMark = true, withStudio = true }): ReactNode => {
    return (
        <span className={cn('inline-flex items-center gap-2.5', className)}>
            {withMark && <LogoMark className='size-[1.15em] shrink-0' />}

            <span className='font-wide text-[1em] font-bold uppercase leading-none tracking-[-0.02em]'>
                Novair
            </span>

            {withStudio && (
                <span className='font-serif text-[1.05em] italic leading-none'>
                    Studio
                </span>
            )}
        </span>
    )
}
