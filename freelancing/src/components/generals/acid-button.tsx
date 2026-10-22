import type { FC, ReactNode } from 'react'

import Link from 'next/link'

import { cn } from '@/lib/utils'

interface AcidButtonProps {
    label: string
    href?: string
    type?: 'button' | 'submit'
    disabled?: boolean
    onClick?: () => void
    className?: string
    external?: boolean
}

const Triangles: FC = (): ReactNode => (
    <span
        aria-hidden='true'
        className='relative ml-3 flex items-center gap-[3px] overflow-hidden'
    >
        {[0, 1, 2].map((index) => (
            <span
                key={index}
                className='block size-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-current transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[7px]'
                style={{ transitionDelay: `${index * 60}ms` }}
            />
        ))}
    </span>
)

/**
 * Acid slab with a two-layer label roll and a chevron cluster that runs ahead
 * of the pointer. Shared by the project CTA and the contact form.
 */
export const AcidButton: FC<AcidButtonProps> = ({
    label,
    href,
    type = 'button',
    disabled = false,
    onClick,
    className,
    external = false
}): ReactNode => {
    const classes = cn(
        'group relative inline-flex items-center justify-center overflow-hidden px-6 py-[14px] text-[18px] font-semibold uppercase leading-[1.2] tracking-[-0.06em] transition-colors duration-500',
        disabled
            ? 'cursor-not-allowed bg-dust/50 text-ink/60'
            : 'bg-acid text-ink',
        className
    )

    const inner = (
        <>
            <span className='invisible flex items-center' aria-hidden='true'>
                {label}
                <Triangles />
            </span>

            <span className='absolute inset-0 flex items-center justify-center transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full'>
                {label}
                <Triangles />
            </span>

            <span
                aria-hidden='true'
                className='absolute inset-0 flex translate-y-full items-center justify-center bg-ink text-acid transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0'
            >
                {label}
                <Triangles />
            </span>
        </>
    )

    if (href) {
        if (external) {
            return (
                <a
                    href={href}
                    target='_blank'
                    rel='noreferrer'
                    data-cursor='link'
                    className={classes}
                >
                    {inner}
                </a>
            )
        }

        if (href.startsWith('#')) {
            return (
                <a href={href} data-cursor='link' className={classes}>
                    {inner}
                </a>
            )
        }

        return (
            <Link href={href} data-cursor='link' className={classes}>
                {inner}
            </Link>
        )
    }

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            data-cursor='link'
            className={classes}
        >
            {inner}
        </button>
    )
}
