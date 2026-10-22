import type { FC, ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface SectionHeadingProps {
    index: string
    eyebrow: string
    title: ReactNode
    description?: ReactNode
    id?: string
    align?: 'left' | 'center'
    tone?: 'ink' | 'light'
    className?: string
}

export const Eyebrow: FC<{ index: string; label: string; tone?: 'ink' | 'light'; className?: string }> = ({ index, label, tone = 'ink', className }): ReactNode => {
    return (
        <p
            className={cn(
                'flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em]',
                tone === 'ink' ? 'text-muted-foreground' : 'text-white/70',
                className
            )}
        >
            <span className={tone === 'ink' ? 'text-foreground' : 'text-white'}>
                ({index})
            </span>
            <span aria-hidden className='h-px w-8 bg-current opacity-40' />
            {label}
        </p>
    )
}

export const SectionHeading: FC<SectionHeadingProps> = ({
    index,
    eyebrow,
    title,
    description,
    id,
    align = 'left',
    tone = 'ink',
    className
}): ReactNode => {
    return (
        <div className={cn('flex flex-col gap-6', align === 'center' && 'items-center text-center', className)}>
            <div data-reveal>
                <Eyebrow index={index} label={eyebrow} tone={tone} />
            </div>

            <h2
                id={id}
                data-reveal
                className={cn(
                    'font-heading stretch-semi text-[clamp(2.5rem,5.4vw,5.6rem)] font-medium leading-[0.94] tracking-[-0.045em] text-balance',
                    tone === 'light' && 'text-white'
                )}
            >
                {title}
            </h2>

            {description && (
                <p
                    data-reveal
                    className={cn(
                        'max-w-xl text-base leading-relaxed md:text-lg',
                        tone === 'ink' ? 'text-muted-foreground' : 'text-white/75'
                    )}
                >
                    {description}
                </p>
            )}
        </div>
    )
}
