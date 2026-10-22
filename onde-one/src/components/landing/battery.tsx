import type { FC, ReactNode } from 'react'

import { useRef } from 'react'
import { Moon, Plane, Usb, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { gsap, useGSAP } from '@/lib/gsap'
import { Counter } from '@/components/landing/counter'
import { SectionHeading } from '@/components/landing/section-heading'

const CELLS = Array.from({ length: 60 }, (_, index) => index)

export const Battery: FC = (): ReactNode => {
    const sectionRef = useRef<HTMLElement>(null)

    useGSAP(() => {
        const media = gsap.matchMedia()

        media.add('(prefers-reduced-motion: no-preference)', () => {
            gsap.fromTo(
                '.battery-cell',
                { opacity: 0.14, scaleY: 0.35 },
                {
                    opacity: 1,
                    scaleY: 1,
                    duration: 0.55,
                    ease: 'power2.out',
                    stagger: 0.022,
                    scrollTrigger: { trigger: '.battery-cells', start: 'top 88%', once: true }
                }
            )

            gsap.fromTo(
                '.charge-fill',
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 1.8,
                    ease: 'power2.inOut',
                    scrollTrigger: { trigger: '.charge-fill', start: 'top 92%', once: true }
                }
            )
        })
    }, { scope: sectionRef })

    return (
        <section
            id='battery'
            ref={sectionRef}
            data-nav='features'
            aria-labelledby='battery-title'
            className='relative bg-background py-24 md:py-40'
        >
            <div className='mx-auto max-w-[1600px] px-5 md:px-10'>
                <div className='flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between'>
                    <SectionHeading
                        id='battery-title'
                        index='06'
                        eyebrow='Live with it · Battery'
                        title={<>Charge weekly, not daily.</>}
                    />

                    <p data-reveal className='max-w-md text-base leading-relaxed text-muted-foreground md:text-lg'>
                        A highly efficient custom chip and a battery that runs the full length of the headband mean you charge about once a week, not every night.
                    </p>
                </div>

                <div className='mt-14 grid gap-4 md:mt-20 md:grid-cols-6 md:gap-5'>
                    <article data-reveal className='relative flex flex-col overflow-hidden rounded-[2rem] bg-foreground p-7 text-background md:col-span-4 md:row-span-2 md:p-12'>
                        <div className='flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-background/60'>
                            <span>Playback</span>
                            <span>Noise cancelling on</span>
                        </div>

                        <h3 className='sr-only'>
                            Up to 60 hours of playback
                        </h3>

                        <p aria-hidden className='mt-10 flex items-start font-heading stretch-wide text-[clamp(7rem,19vw,17rem)] font-semibold leading-[0.8] tracking-[-0.06em]'>
                            <Counter value={60} duration={2.2} />
                            <span className='ml-3 mt-[0.1em] text-[0.26em] tracking-[-0.02em]'>
                                h
                            </span>
                        </p>

                        <p className='mt-8 max-w-md leading-relaxed text-background/70'>
                            A full week of commutes, a long-haul flight there and back and every quiet evening in between. Turn noise cancelling off and you get up to 80 hours.
                        </p>

                        <div className='mt-auto pt-10'>
                            <div aria-hidden className='battery-cells flex h-14 items-end gap-[2px] md:gap-[3px]'>
                                {CELLS.map((cell) => (
                                    <span
                                        key={cell}
                                        className={cn('battery-cell block h-full flex-1 origin-bottom rounded-full', cell === CELLS.length - 1 ? 'bg-bronze' : 'bg-background/85')}
                                    />
                                ))}
                            </div>

                            <div className='mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-background/50'>
                                <span>0 h</span>
                                <span>30 h</span>
                                <span>60 h</span>
                            </div>
                        </div>
                    </article>

                    <article data-reveal className='flex flex-col rounded-[2rem] bg-paper p-7 md:col-span-2 md:p-9'>
                        <Zap aria-hidden className='size-5 text-bronze' strokeWidth={1.5} />

                        <h3 className='mt-8 font-heading stretch-semi text-5xl font-medium tracking-[-0.04em]'>
                            5 min
                        </h3>
                        <p className='mt-3 leading-relaxed text-muted-foreground'>
                            of charging gives you four hours of listening.
                        </p>

                        <div className='mt-auto pt-8'>
                            <div aria-hidden className='relative h-1.5 overflow-hidden rounded-full bg-foreground/10'>
                                <span className='charge-fill absolute inset-0 origin-left rounded-full bg-[linear-gradient(90deg,var(--bronze),oklch(0.82_0.075_85))]' />
                            </div>

                            <div className='mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground'>
                                <span>Plug in</span>
                                <span>4 h ready</span>
                            </div>
                        </div>
                    </article>

                    <article data-reveal className='flex flex-col rounded-[2rem] bg-paper p-7 md:col-span-2 md:p-9'>
                        <Usb aria-hidden className='size-5 text-bronze' strokeWidth={1.5} />

                        <h3 className='mt-8 font-heading stretch-semi text-3xl font-medium leading-tight tracking-[-0.03em]'>
                            Lossless over USB-C
                        </h3>
                        <p className='mt-3 leading-relaxed text-muted-foreground'>
                            Plug in for 24-bit listening while you charge.
                        </p>
                    </article>

                    <article data-reveal className='rounded-[2rem] border border-border p-7 md:col-span-3 md:p-9'>
                        <Moon aria-hidden className='size-5 text-bronze' strokeWidth={1.5} />

                        <h3 className='mt-8 font-heading stretch-semi text-3xl font-medium leading-tight tracking-[-0.03em]'>
                            Smart standby
                        </h3>
                        <p className='mt-3 max-w-md leading-relaxed text-muted-foreground'>
                            Set them down and they slip into deep sleep. Lift them up and they are ready before they reach your ears.
                        </p>
                    </article>

                    <article data-reveal className='rounded-[2rem] border border-border p-7 md:col-span-3 md:p-9'>
                        <Plane aria-hidden className='size-5 text-bronze' strokeWidth={1.5} />

                        <h3 className='mt-8 font-heading stretch-semi text-3xl font-medium leading-tight tracking-[-0.03em]'>
                            Folds flat, travels light
                        </h3>
                        <p className='mt-3 max-w-md leading-relaxed text-muted-foreground'>
                            The earcups rotate flat into a slim, felt-lined case that fits easily into any bag.
                        </p>
                    </article>
                </div>
            </div>
        </section>
    )
}
