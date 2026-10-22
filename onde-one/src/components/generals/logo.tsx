import type { FC, ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface LogoProps {
    className?: string
    markClassName?: string
}

export const LogoMark: FC<{ className?: string }> = ({ className }): ReactNode => {
    return (
        <svg viewBox='0 0 24 24' aria-hidden className={cn('size-6', className)}>
            <path d='M4.2 15.5a7.8 7.8 0 0 1 15.6 0' fill='none' stroke='currentColor' strokeWidth='2.6' strokeLinecap='round' />
            <circle cx='12' cy='15.5' r='2.4' className='fill-bronze' />
        </svg>
    )
}

export const Logo: FC<LogoProps> = ({ className, markClassName }): ReactNode => {
    return (
        <span className={cn('inline-flex items-center gap-2.5', className)}>
            <LogoMark className={markClassName} />
            <span className='font-heading stretch-wide text-[15px] font-semibold uppercase tracking-[0.2em]'>
                Arden
            </span>
        </span>
    )
}
