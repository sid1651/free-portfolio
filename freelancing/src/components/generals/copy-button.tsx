import type { FC, ReactNode } from 'react'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

interface CopyButtonProps {
    value: string
    label: string
    copiedLabel: string
    className?: string
}

/**
 * Copy-to-clipboard with the label swapping in place, matching the
 * "Phone copied!" behaviour of the reference footer.
 */
export const CopyButton: FC<CopyButtonProps> = ({
    value,
    label,
    copiedLabel,
    className
}): ReactNode => {
    const [copied, setCopied] = useState(false)
    const timer = useRef<number | null>(null)

    useEffect(() => {
        return () => {
            if (timer.current) window.clearTimeout(timer.current)
        }
    }, [])

    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(value)
        } catch {
            return
        }

        setCopied(true)

        if (timer.current) window.clearTimeout(timer.current)

        timer.current = window.setTimeout(() => setCopied(false), 1800)
    }

    return (
        <button
            type='button'
            onClick={onCopy}
            data-cursor='link'
            data-cursor-label='COPY'
            aria-label={`Copy ${label}`}
            className={cn(
                'group relative block overflow-hidden text-left',
                className
            )}
        >
            <span
                className={cn(
                    'block transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                    copied && '-translate-y-full'
                )}
            >
                {label}
            </span>

            <span
                aria-live='polite'
                className={cn(
                    'absolute inset-0 block translate-y-full transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                    copied && 'translate-y-0'
                )}
            >
                {copiedLabel}
            </span>
        </button>
    )
}
