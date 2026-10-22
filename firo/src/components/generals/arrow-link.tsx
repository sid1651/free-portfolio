import type { FC, ReactNode } from 'react'

import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TransitionLink } from '@/components/generals/transition-link'

interface ArrowLinkProps {
    href: string
    children: ReactNode
    className?: string
    external?: boolean
}

/** Text link with a sliding underline and an arrow that nudges on hover. */
export const ArrowLink: FC<ArrowLinkProps> = ({ href, children, className, external = false }): ReactNode => {
    const content = (
        <>
            <span className='link-underline pb-0.5'>
                {children}
            </span>

            <span className='relative inline-flex size-4 overflow-hidden' aria-hidden='true'>
                <ArrowUpRight className='size-4 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full group-hover:translate-x-full' />
                <ArrowUpRight className='absolute size-4 -translate-x-full translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-0 group-hover:translate-y-0' />
            </span>
        </>
    )

    const classes = cn('group inline-flex items-center gap-2 text-sm font-medium', className)

    if (external) {
        return (
            <a href={href} target='_blank' rel='noreferrer' className={classes}>
                {content}
            </a>
        )
    }

    return (
        <TransitionLink href={href} className={classes}>
            {content}
        </TransitionLink>
    )
}

interface PillLinkProps {
    href: string
    children: ReactNode
    className?: string
    variant?: 'light' | 'dark' | 'flare'
}

/** Rounded call-to-action whose fill rises from the bottom on hover. */
export const PillLink: FC<PillLinkProps> = ({ href, children, className, variant = 'light' }): ReactNode => {
    const palette = {
        light: 'border-bone/30 text-bone hover:text-ink [--pill-fill:var(--bone)]',
        dark: 'border-ink/25 text-ink hover:text-bone [--pill-fill:var(--ink)]',
        flare: 'border-flare bg-flare text-ink hover:text-bone [--pill-fill:var(--ink)]'
    }[variant]

    return (
        <TransitionLink
            href={href}
            className={cn(
                'group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full border px-6 text-sm font-medium transition-colors duration-500',
                palette,
                className
            )}
        >
            <span
                className='absolute inset-0 translate-y-full rounded-full bg-[var(--pill-fill)] transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0'
                aria-hidden='true'
            />

            <span className='relative'>
                {children}
            </span>

            <ArrowUpRight className='relative size-4 transition-transform duration-500 group-hover:rotate-45' aria-hidden='true' />
        </TransitionLink>
    )
}
