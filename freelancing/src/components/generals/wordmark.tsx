import type { FC, ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface WordmarkProps {
    className?: string
    /** Letters swap to the accent colour one after another on hover. */
    interactive?: boolean
    /**
     * Hover colour for the letters. Overridden where the mark sits on the
     * accent plate itself and the default would disappear into it.
     */
    accent?: string
}

const LETTERS = Array.from('alchemy')

export const Wordmark: FC<WordmarkProps> = ({
    className,
    interactive = true,
    accent = 'group-hover/mark:text-acid'
}): ReactNode => {
    return (
        <span
            aria-label='Alchemy'
            className={cn(
                'group/mark inline-flex select-none items-baseline text-[26px] font-black leading-none tracking-[-0.055em] text-bone',
                className
            )}
        >
            {LETTERS.map((letter, index) => (
                <span
                    key={index}
                    aria-hidden='true'
                    className={cn(
                        'inline-block transition-[color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                        interactive &&
                            cn('group-hover/mark:-translate-y-[2px]', accent)
                    )}
                    style={{ transitionDelay: `${index * 35}ms` }}
                >
                    {letter}
                </span>
            ))}
        </span>
    )
}
