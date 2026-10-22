import type { FC, ReactNode } from 'react'

import { useState } from 'react'

import { gsap } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import { useGsapContext } from '@/hooks/use-gsap'
import { LinesIn, TrackIn, Reveal } from '@/components/motion/reveal'

import { workTypes } from '@/constants/home'
import { studio } from '@/constants/site'

/**
 * Section 06 — Work types.
 *
 * Five archive rows. Each rule wipes in from the left as its row arrives, and
 * hovering a row pushes its number, title and body out at three different
 * rates so the line comes apart under the pointer.
 */
export const WorkTypes: FC = (): ReactNode => {
    const [active, setActive] = useState<number | null>(null)

    const scope = useGsapContext<HTMLElement>(() => {
        const rows = gsap.utils.toArray<HTMLElement>('[data-type-row]')

        rows.forEach((row, index) => {
            const rule = row.querySelector('[data-type-rule]')

            if (!rule) return

            gsap.fromTo(
                rule,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 1.3,
                    ease: 'expo.out',
                    delay: index * 0.04,
                    scrollTrigger: { trigger: row, start: 'top 92%', once: true }
                }
            )
        })
    }, [])

    return (
        <section
            id='work-types'
            ref={scope}
            className='bg-ink edge-x pb-[12vh] pt-[16vh] text-bone'
        >
            {/* Reversed header — the meta rail takes the left edge and the
                headline is pushed right, against the usual big-left split. */}
            <div className='grid grid-cols-1 gap-10 lg:grid-cols-12'>
                <div className='lg:col-span-8 lg:col-start-5 lg:row-start-1'>
                    <Reveal y={14} className='mb-6'>
                        <span className='display-tight text-[clamp(30px,4.6vw,64px)] text-acid'>
                            {studio.brand}
                        </span>
                    </Reveal>

                    <LinesIn
                        as='h2'
                        lines={workTypes.headline}
                        stagger={0.1}
                        skew={2}
                        className='max-w-[18ch] text-[clamp(24px,3.6vw,50px)] font-semibold leading-[1.1] tracking-[-0.045em] text-smoke'
                    />
                </div>

                <div className='flex flex-col justify-end gap-2 lg:col-span-3 lg:col-start-1 lg:row-start-1'>
                    <TrackIn
                        text={workTypes.storage}
                        fromTracking={0.3}
                        toTracking={0.03}
                        className='text-[13px] font-bold uppercase text-bone'
                    />

                    <Reveal y={12} delay={0.1}>
                        <span className='label-mono text-dust'>
                            — {workTypes.years}
                        </span>
                    </Reveal>

                    <Reveal y={12} delay={0.16}>
                        <span className='label-mono text-acid'>
                            {workTypes.archive}
                        </span>
                    </Reveal>
                </div>
            </div>

            <div className='mt-[10vh]'>
                {workTypes.features.map((feature, index) => (
                    <div
                        key={feature.number}
                        data-type-row
                        onMouseEnter={() => setActive(index)}
                        onMouseLeave={() => setActive(null)}
                        className='group relative py-7'
                    >
                        <div
                            data-type-rule
                            aria-hidden='true'
                            className={cn(
                                'absolute inset-x-0 top-0 h-px origin-left transition-colors duration-700',
                                active === index ? 'bg-acid' : 'bg-hairline'
                            )}
                        />

                        <div className='grid grid-cols-1 gap-4 md:grid-cols-12 md:items-baseline md:gap-6'>
                            <span
                                className={cn(
                                    'label-mono transition-[transform,color] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:col-span-2',
                                    active === index
                                        ? 'translate-x-2 text-acid'
                                        : 'text-dust'
                                )}
                            >
                                {feature.mod}
                            </span>

                            <h3
                                className={cn(
                                    'text-[clamp(22px,3.4vw,44px)] font-black uppercase leading-[1.02] tracking-[-0.05em] transition-[transform,color] duration-[760ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:col-span-5',
                                    active === index
                                        ? 'translate-x-4 text-acid'
                                        : 'text-bone'
                                )}
                            >
                                {feature.title}
                            </h3>

                            <span
                                className={cn(
                                    'label-mono transition-transform duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:col-span-1',
                                    active === index
                                        ? 'translate-x-1 text-acid'
                                        : 'text-graphite'
                                )}
                            >
                                / {feature.number}
                            </span>

                            <p
                                className={cn(
                                    'max-w-[48ch] text-[15px] font-semibold leading-[1.4] tracking-[-0.03em] transition-[transform,color] duration-[880ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:col-span-4',
                                    active === index
                                        ? '-translate-x-2 text-ash'
                                        : 'text-dust'
                                )}
                            >
                                {feature.body}
                            </p>
                        </div>
                    </div>
                ))}

                <div className='h-px w-full bg-hairline' />
            </div>
        </section>
    )
}
