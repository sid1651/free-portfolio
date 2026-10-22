import type { FC, ReactNode } from 'react'

import { gsap } from '@/lib/gsap'
import { useGsapContext } from '@/hooks/use-gsap'
import { LinesIn, WordsIn, Reveal } from '@/components/motion/reveal'

import { process } from '@/constants/home'

/**
 * Section 04 — Process.
 *
 * The section pins and the four module cards travel sideways under it, so the
 * scroll wheel drives horizontal movement while the background plate creeps
 * the opposite way. The progress rule under the cards tracks the same value.
 */
export const Process: FC = (): ReactNode => {
    const scope = useGsapContext<HTMLElement>(() => {
        const root = scope.current

        if (!root) return

        const track = root.querySelector<HTMLElement>('[data-process-track]')
        const plate = root.querySelector('[data-process-plate]')
        const bar = root.querySelector('[data-process-bar]')

        if (plate) {
            gsap.fromTo(
                plate,
                { yPercent: -8, scale: 1.18 },
                {
                    yPercent: 8,
                    scale: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: root,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1
                    }
                }
            )
        }

        if (!track) return

        /* Recomputed on every refresh so a resize re-measures the track. */
        const travel = () =>
            Math.max(0, track.scrollWidth - window.innerWidth + 48)

        const setup = () => {
            if (travel() <= 0) return

            gsap.to(track, {
                x: () => -travel(),
                ease: 'none',
                scrollTrigger: {
                    trigger: root,
                    start: 'top top',
                    end: () => `+=${travel() + window.innerHeight * 0.6}`,
                    pin: true,
                    scrub: 0.8,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: 1,
                    onUpdate: (self) => {
                        if (bar) {
                            gsap.set(bar, { scaleX: self.progress })
                        }
                    }
                }
            })
        }

        const desktop = window.matchMedia('(min-width: 768px)')

        if (desktop.matches) setup()
    }, [])

    return (
        <section
            id='process'
            ref={scope}
            className='relative isolate overflow-hidden bg-ink py-[12vh] text-bone md:py-0'
        >
            <div
                data-process-plate
                aria-hidden='true'
                className='absolute inset-0 -z-10 opacity-20 will-change-transform'
            >
                <img
                    src={process.background}
                    alt=''
                    loading='lazy'
                    decoding='async'
                    className='size-full object-cover grayscale'
                />

                <div className='absolute inset-0 bg-gradient-to-b from-ink via-ink/60 to-ink' />
            </div>

            <div className='flex flex-col justify-center md:min-h-[100svh]'>
                <div className='edge-x'>
                    <Reveal y={14} className='mb-5'>
                        <span className='label-mono text-acid'>
                            {process.label}
                        </span>
                    </Reveal>

                    <LinesIn
                        as='h2'
                        lines={process.title}
                        stagger={0.1}
                        className='display-tight text-[clamp(32px,5.6vw,76px)]'
                    />

                    <WordsIn
                        text={process.subtitle}
                        delay={0.18}
                        stagger={0.03}
                        className='mt-6 max-w-[40ch] text-[clamp(16px,1.7vw,22px)] font-semibold leading-[1.3] tracking-[-0.04em] text-smoke'
                    />

                    <div className='mt-4 flex items-center gap-3'>
                        <span className='label-mono text-dust'>
                            {process.source}
                        </span>

                        <span className='label-mono text-graphite'>
                            {process.sourceNote}
                        </span>
                    </div>
                </div>

                <div className='mt-[8vh] overflow-hidden'>
                    <div
                        data-process-track
                        className='flex w-max gap-4 pl-[18px] pr-[18px] will-change-transform md:gap-6 md:pl-[26px]'
                    >
                        {process.modules.map((module, index) => (
                            <article
                                key={module.code}
                                className='group flex w-[74vw] shrink-0 flex-col justify-between border border-hairline bg-ink-soft/70 p-6 transition-colors duration-700 hover:border-acid sm:w-[46vw] md:w-[30vw] md:p-8'
                            >
                                <div className='flex items-start justify-between gap-4'>
                                    <span className='label-mono text-acid'>
                                        {module.code}
                                    </span>

                                    <span className='label-mono text-graphite'>
                                        {String(index + 1).padStart(2, '0')}/04
                                    </span>
                                </div>

                                <div className='my-10 h-px w-full bg-hairline transition-colors duration-700 group-hover:bg-acid' />

                                <p className='text-[15px] font-semibold leading-[1.4] tracking-[-0.03em] text-ash md:text-[17px]'>
                                    {module.body}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>

                <div className='mt-8 edge-x pb-[6vh] md:pb-[8vh]'>
                    <div className='h-px w-full bg-hairline'>
                        <div
                            data-process-bar
                            className='h-px w-full origin-left scale-x-0 bg-acid'
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
