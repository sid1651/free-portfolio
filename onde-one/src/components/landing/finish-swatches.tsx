import type { FC, ReactNode } from 'react'
import type { Finish, FinishId } from '@/types'

import { cn } from '@/lib/utils'
import { FINISHES } from '@/constants/site'

interface FinishSwatchesProps {
    value: FinishId
    onChange: (finish: FinishId) => void
    label?: string
    className?: string
}

export const SwatchDot: FC<{ finish: Finish; className?: string }> = ({ finish, className }): ReactNode => {
    return (
        <span
            aria-hidden
            className={cn('block size-4 rounded-full', className)}
            style={{
                background: `radial-gradient(circle at 32% 28%, rgb(255 255 255 / 0.55), transparent 42%), ${finish.swatch}`,
                boxShadow: `inset 0 0 0 1.5px ${finish.accent}, inset 0 -3px 6px rgb(0 0 0 / 0.28)`
            }}
        />
    )
}

export const FinishSwatches: FC<FinishSwatchesProps> = ({ value, onChange, label = 'Finish', className }): ReactNode => {
    return (
        <div role='group' aria-label={label} className={cn('flex items-center gap-1.5', className)}>
            {FINISHES.map((finish) => {
                const active = finish.id === value

                return (
                    <button
                        key={finish.id}
                        type='button'
                        aria-pressed={active}
                        aria-label={finish.name}
                        title={finish.name}
                        onClick={() => onChange(finish.id)}
                        className='group relative grid size-8 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                    >
                        <span
                            aria-hidden
                            className={cn(
                                'absolute inset-0 rounded-full border transition-[border-color,transform] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]',
                                active ? 'scale-100 border-foreground/70' : 'scale-75 border-transparent group-hover:scale-90 group-hover:border-foreground/25'
                            )}
                        />
                        <SwatchDot finish={finish} className='transition-transform duration-300 group-hover:scale-110' />
                    </button>
                )
            })}
        </div>
    )
}
