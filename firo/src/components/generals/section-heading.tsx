import type { FC, ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { SplitWords } from '@/components/generals/split-words'

interface EyebrowProps {
    children: ReactNode
    className?: string
    index?: string
}

/** Small mono label used above sections, optionally with an index like (02). */
export const Eyebrow: FC<EyebrowProps> = ({ children, className, index }): ReactNode => {
    return (
        <span className={cn('eyebrow inline-flex items-center gap-3', className)}>
            {index && (
                <span className='text-flare'>
                    ({index})
                </span>
            )}

            {children}
        </span>
    )
}

interface DisplayHeadingProps {
    text: string
    as?: 'h1' | 'h2' | 'h3'
    className?: string
    reveal?: boolean
    accent?: string
}

/**
 * Large wide-set heading. `accent` names one word that switches to the italic serif,
 * which is the signature typographic gesture of the NOVAIR system.
 */
export const DisplayHeading: FC<DisplayHeadingProps> = ({ text, as: Tag = 'h2', className, reveal = true, accent }): ReactNode => {
    if (!accent) {
        return (
            <Tag className={cn('font-wide font-semibold uppercase tracking-[-0.035em]', className)} data-reveal={reveal ? 'words' : undefined}>
                <SplitWords text={text} />
            </Tag>
        )
    }

    const [before, after] = text.split(accent)

    return (
        <Tag className={cn('font-wide font-semibold uppercase tracking-[-0.035em]', className)} data-reveal={reveal ? 'words' : undefined}>
            {before && <SplitWords text={before.trim()} />}
            {before && ' '}
            <SplitWords text={accent} wordClassName='font-serif font-normal normal-case italic tracking-[-0.01em]' />
            {after && ' '}
            {after && <SplitWords text={after.trim()} />}
        </Tag>
    )
}
