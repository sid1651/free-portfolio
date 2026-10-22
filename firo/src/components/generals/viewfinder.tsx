import type { FC, ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface ViewfinderProps {
    className?: string
    size?: 'sm' | 'md'
}

/** Four camera-style corner brackets that frame whatever they sit on top of. */
export const Viewfinder: FC<ViewfinderProps> = ({ className, size = 'md' }): ReactNode => {
    const corner = size === 'sm' ? 'size-3' : 'size-5'

    return (
        <span className={cn('pointer-events-none absolute inset-3 z-10 text-bone', className)} aria-hidden='true'>
            <span className={cn('absolute left-0 top-0 border-l border-t border-current', corner)} />
            <span className={cn('absolute right-0 top-0 border-r border-t border-current', corner)} />
            <span className={cn('absolute bottom-0 left-0 border-b border-l border-current', corner)} />
            <span className={cn('absolute bottom-0 right-0 border-b border-r border-current', corner)} />
        </span>
    )
}

interface RecLabelProps {
    className?: string
    label?: string
}

export const RecLabel: FC<RecLabelProps> = ({ className, label = 'Rec' }): ReactNode => {
    return (
        <span className={cn('eyebrow inline-flex items-center gap-2', className)}>
            <span className='rec-dot size-1.5 rounded-full bg-flare' />
            {label}
        </span>
    )
}
