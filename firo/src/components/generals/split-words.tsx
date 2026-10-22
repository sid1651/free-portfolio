import type { FC, ReactNode } from 'react'

import { Fragment } from 'react'
import { cn } from '@/lib/utils'

interface SplitWordsProps {
    text: string
    className?: string
    wordClassName?: string
}

/**
 * Renders static copy as masked words so headings can rise into place.
 * Screen readers get the plain sentence; the split copy is hidden from them.
 */
export const SplitWords: FC<SplitWordsProps> = ({ text, className, wordClassName }): ReactNode => {
    const words = text.split(' ').filter(Boolean)

    return (
        <span className={className}>
            <span className='sr-only'>
                {text}
            </span>

            <span aria-hidden='true'>
                {words.map((word, index) => (
                    <Fragment key={`${word}-${index}`}>
                        <span className='word-mask'>
                            <span className={cn('word-inner', wordClassName)} data-word=''>
                                {word}
                            </span>
                        </span>

                        {index < words.length - 1 && ' '}
                    </Fragment>
                ))}
            </span>
        </span>
    )
}
