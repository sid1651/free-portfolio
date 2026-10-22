import type { FC, ReactNode } from 'react'
import type { FinishId } from '@/types'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { gsap, useGSAP } from '@/lib/gsap'
import { FinishSwatches } from '@/components/landing/finish-swatches'
import { LazyHeadphonesStage } from '@/components/landing/showcase/lazy-stage'
import { FINISHES } from '@/constants/site'

const HEADLINE = ['QUIET,', 'REFINED.']

const DragHint: FC<{ dimmed: boolean }> = ({ dimmed }): ReactNode => {
    return (
        <div className={cn('transition-opacity duration-700', dimmed ? 'opacity-45' : 'opacity-100')}>
            <div className='flex flex-col items-center gap-3 motion-safe:animate-fade [animation-delay:1.7s]'>
                <span aria-hidden className='relative block h-px w-16 bg-foreground/15'>
                    <span className='absolute left-1/2 top-1/2 block size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bronze motion-safe:animate-glide' />
                </span>

                <p className='flex items-center gap-2.5 rounded-full border border-foreground/10 bg-background/70 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.26em] text-foreground shadow-[0_10px_30px_-14px_rgb(0_0_0/0.35)] backdrop-blur-md'>
                    <ChevronLeft aria-hidden className='size-3.5 motion-safe:animate-nudge-left' />
                    Drag to explore
                    <ChevronRight aria-hidden className='size-3.5 motion-safe:animate-nudge-right' />
                </p>
            </div>
        </div>
    )
}

export const Hero: FC = (): ReactNode => {
    const sectionRef = useRef<HTMLElement>(null)
    const stageRef = useRef<HTMLDivElement>(null)
    const lineOneRef = useRef<HTMLSpanElement>(null)
    const lineTwoRef = useRef<HTMLSpanElement>(null)
    const rotationRef = useRef<HTMLElement>(null)
    const tiltRef = useRef<HTMLElement>(null)
    const [finish, setFinish] = useState<FinishId>('midnight')
    const [interacted, setInteracted] = useState(false)
    const [unsupported, setUnsupported] = useState(false)
    const activeFinish = FINISHES.find((item) => item.id === finish) ?? FINISHES[0]

    useGSAP(() => {
        const media = gsap.matchMedia()

        media.add('(prefers-reduced-motion: no-preference)', () => {
            gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            })
                .to(stageRef.current, { yPercent: 14, scale: 0.94, ease: 'none' }, 0)
                .to(lineOneRef.current, { xPercent: -9, ease: 'none' }, 0)
                .to(lineTwoRef.current, { xPercent: 7, ease: 'none' }, 0)
                .to('.hero-chrome', { autoAlpha: 0, y: -24, ease: 'power1.in' }, 0)
        })
    }, { scope: sectionRef })

    return (
        <section
            id='hero'
            ref={sectionRef}
            aria-labelledby='hero-title'
            className='relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-background'
        >
            <div aria-hidden className='pointer-events-none absolute inset-0'>
                <div className='absolute inset-[-6%] bg-[radial-gradient(52%_48%_at_50%_42%,oklch(0.995_0.003_250)_0%,oklch(0.985_0.005_250/0.6)_45%,transparent_75%)] [transform:translate3d(calc(var(--mx,0)*-26px),calc(var(--my,0)*-18px),0)]' />
                <div className='absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(to_bottom,transparent,oklch(0.92_0.014_252/0.75))]' />
                <div className='absolute left-1/2 top-[41%] aspect-square h-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/[0.05] [transform:translate3d(calc(var(--mx,0)*14px),calc(var(--my,0)*10px),0)]' />
            </div>

            <div ref={stageRef} className='absolute inset-0 will-change-transform'>
                {unsupported ? (
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='relative h-[58%] w-full max-w-5xl -translate-y-[7%]'>
                            <Image
                                src='/images/product-studio.jpg'
                                alt='Arden Halo headphones in midnight with bronze chamfers'
                                fill
                                preload
                                sizes='(min-width: 1024px) 70vw, 100vw'
                                className='object-contain mix-blend-multiply'
                            />
                        </div>
                    </div>
                ) : (
                    <LazyHeadphonesStage
                        finish={finish}
                        readouts={{ rotation: rotationRef, tilt: tiltRef }}
                        parallaxTarget={sectionRef}
                        onInteract={() => setInteracted(true)}
                        onUnsupported={() => setUnsupported(true)}
                        className='size-full'
                    />
                )}
            </div>

            <div className='pointer-events-none relative z-10 mx-auto flex h-full max-w-[1600px] flex-col px-5 pb-6 pt-20 md:px-10 md:pb-10 md:pt-28'>
                <div className='hero-chrome'>
                    <div className='flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground motion-safe:animate-fade [animation-delay:1.2s] md:text-[11px]'>
                        <div className='flex flex-col gap-1.5'>
                            <span className='text-foreground'>
                                Arden Halo
                            </span>
                            <span>
                                Studio view, 360°
                            </span>
                        </div>

                        <dl className='grid grid-cols-[auto_auto] gap-x-4 gap-y-1.5 text-right'>
                            <dt>Rot</dt>
                            <dd ref={rotationRef} className='tabular-nums text-foreground'>
                                324°
                            </dd>
                            <dt>Tilt</dt>
                            <dd ref={tiltRef} className='tabular-nums text-foreground'>
                                +07°
                            </dd>
                            <dt className='hidden md:block'>Finish</dt>
                            <dd className='hidden text-foreground md:block'>
                                {activeFinish.name}
                            </dd>
                        </dl>
                    </div>
                </div>

                <div className='flex-1' />

                <div className='hero-chrome mb-7 flex justify-center md:mb-5'>
                    <DragHint dimmed={interacted} />
                </div>

                <div className='flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10'>
                    <h1
                        id='hero-title'
                        className='font-heading stretch-wide text-[12.2vw] font-semibold uppercase leading-[0.86] tracking-[-0.045em] text-foreground md:text-[clamp(3.6rem,min(7.2vw,13vh),8.6rem)]'
                    >
                        <span className='sr-only'>
                            Quiet, refined.
                        </span>

                        <span aria-hidden className='block'>
                            {HEADLINE.map((line, lineIndex) => (
                                <span
                                    key={line}
                                    ref={lineIndex === 0 ? lineOneRef : lineTwoRef}
                                    className='block overflow-hidden pb-[0.05em] will-change-transform'
                                >
                                    {Array.from(line).map((character, characterIndex) => (
                                        <span
                                            key={`${line}-${characterIndex}`}
                                            className='inline-block motion-safe:animate-rise'
                                            style={{ animationDelay: `${0.25 + (lineIndex * 6 + characterIndex) * 0.045}s` }}
                                        >
                                            {character}
                                        </span>
                                    ))}
                                </span>
                            ))}
                        </span>
                    </h1>

                    <div className='hero-chrome pointer-events-auto'>
                        <div className='flex items-center justify-between gap-6 motion-safe:animate-fade-up [animation-delay:1.35s] lg:w-[19rem] lg:flex-col lg:items-start lg:gap-5'>
                            <p className='hidden max-w-[22rem] text-sm leading-relaxed text-muted-foreground sm:block lg:text-[15px]'>
                                Sculpted aluminum, intelligent quiet and sixty hours of sound so close it feels like the music is in the room with you.
                            </p>

                            <div className='flex items-center gap-3'>
                                <FinishSwatches value={finish} onChange={setFinish} label='Preview a finish' />
                                <span className='font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
                                    {activeFinish.name}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
