import type { FC, ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface SplitTextProps {
    text: string
    className?: string
    wordClassName?: string
    charClassName?: string
    /** Wrap every word in its own overflow-hidden mask. */
    mask?: boolean
}

/**
 * Deterministic character split rendered straight into the markup, so the
 * server and the client produce byte-identical HTML. GSAP then animates the
 * `.split-char` nodes. Screen readers get the intact string via `aria-label`.
 */
export const SplitChars: FC<SplitTextProps> = ({
    text,
    className,
    wordClassName,
    charClassName,
    mask = true
}): ReactNode => {
    const words = text.split(' ')

    return (
        <span aria-label={text} className={cn('inline', className)}>
            {words.map((word, wordIndex) => (
                <span
                    aria-hidden='true'
                    key={`${word}-${wordIndex}`}
                    className={cn(
                        'split-word relative whitespace-nowrap',
                        mask && 'mask-box overflow-hidden align-bottom',
                        wordClassName
                    )}
                >
                    {Array.from(word).map((char, charIndex) => (
                        <span
                            key={`${char}-${charIndex}`}
                            className={cn('split-char', charClassName)}
                        >
                            {char}
                        </span>
                    ))}

                    {wordIndex < words.length - 1 && (
                        <span className='split-char'>&nbsp;</span>
                    )}
                </span>
            ))}
        </span>
    )
}

/**
 * Word-level split. Used where the reference moves whole words rather than
 * individual glyphs (body copy, long statements).
 */
export const SplitWords: FC<SplitTextProps> = ({
    text,
    className,
    wordClassName,
    mask = true
}): ReactNode => {
    const words = text.split(' ')

    return (
        <span aria-label={text} className={cn('inline', className)}>
            {words.map((word, wordIndex) => (
                <span
                    aria-hidden='true'
                    key={`${word}-${wordIndex}`}
                    className={cn(
                        'relative inline-block whitespace-nowrap',
                        mask && 'mask-box overflow-hidden align-bottom'
                    )}
                >
                    <span className={cn('split-word', wordClassName)}>
                        {word}
                    </span>

                    {wordIndex < words.length - 1 && (
                        <span aria-hidden='true'>&nbsp;</span>
                    )}
                </span>
            ))}
        </span>
    )
}
