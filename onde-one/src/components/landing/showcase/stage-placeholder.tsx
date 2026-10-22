import type { FC, ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface StagePlaceholderProps {
    className?: string
}

export const StagePlaceholder: FC<StagePlaceholderProps> = ({ className }): ReactNode => {
    return (
        <div aria-hidden className={cn('pointer-events-none absolute inset-0 flex items-center justify-center', className)}>
            <div className='relative size-40 -translate-y-[8%] md:size-56'>
                <span className='absolute inset-0 rounded-full border border-foreground/10' />
                <span className='absolute inset-3 animate-spin rounded-full border border-transparent border-t-foreground/30 [animation-duration:2.4s]' />
            </div>
        </div>
    )
}
