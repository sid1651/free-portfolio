import type { FC, ReactNode } from 'react'

import { gsap } from '@/lib/gsap'
import { useGsapContext } from '@/hooks/use-gsap'
import { useSiteReady } from '@/components/generals/ready-provider'
import { CurtainMedia } from '@/components/motion/curtain-media'
import { Marquee } from '@/components/motion/marquee'

import {
    CharsIn,
    LinesIn,
    TrackIn,
    Reveal,
    DrawLine
} from '@/components/motion/reveal'

import { hero } from '@/constants/home'
import { studio } from '@/constants/site'

/**
 * Section 00 — Hero.
 *
 * The portrait is the plate, not an inset: it runs full bleed behind a pair of
 * scrims that carve out the reading areas. Everything else is hung off the two
 * edges — meta at the top, statement and phase meters across the middle, and
 * the wordmark locked to the bottom as a single full-width line under an
 * accent rule.
 *
 * Load: the curtain wipes down while the picture eases out of an over-crop,
 * then the statement masks up line by line, the meters draw their fills, the
 * wordmark rises glyph by glyph, and the rule draws left to right underneath
 * it. Scroll: four layers leave on four different rates — statement fastest,
 * then the meters, then the wordmark sinking, and the picture slowest of all,
 * so the stack visibly comes apart as the section goes.
 */
export const Hero: FC = (): ReactNode => {
    const ready = useSiteReady()

    const scope = useGsapContext<HTMLElement>(() => {
        const root = scope.current

        if (!root) return

        const portrait = root.querySelector('[data-hero-portrait]')
        const statement = root.querySelector('[data-hero-statement]')
        const meters = root.querySelector('[data-hero-meters]')
        const mark = root.querySelector('[data-hero-mark]')
        const cue = root.querySelector('[data-hero-cue]')

        /* Load: the picture settles out of its crop behind the curtain. */
        const media = root.querySelector('[data-hero-portrait] [data-media-inner]')

        if (media && ready) {
            gsap.fromTo(
                media,
                { scale: 1.16 },
                { scale: 1, duration: 2.4, ease: 'expo.out', delay: 0.1 }
            )
        }

        /* Scroll: one trigger, four rates. */
        const leave = (target: Element | null, vars: gsap.TweenVars): void => {
            if (!target) return

            gsap.to(target, {
                ...vars,
                ease: 'none',
                scrollTrigger: {
                    trigger: root,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            })
        }

        leave(portrait, { yPercent: 13, scale: 1.1 })
        leave(mark, { yPercent: 16 })
        leave(meters, { yPercent: -34, autoAlpha: 0.1 })
        leave(statement, { yPercent: -58, autoAlpha: 0 })

        if (cue) {
            gsap.to(cue, {
                autoAlpha: 0,
                y: -14,
                ease: 'none',
                scrollTrigger: {
                    trigger: root,
                    start: 'top top',
                    end: '14% top',
                    scrub: true
                }
            })
        }
    }, [ready])

    return (
        <section
            id='hero'
            ref={scope}
            className='relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-bone'
        >
            {/* Plate */}
            <div
                data-hero-portrait
                className='absolute inset-0 z-0 will-change-transform'
            >
                <CurtainMedia
                    src={hero.image}
                    alt='Abstract black glass sculpture with a warm line of light'
                    mask='#050609'
                    curtain='wipe-down'
                    staticZoom={1}
                    priority
                    className='size-full'
                    imageClassName='object-[80%_22%] opacity-90 md:object-[100%_30%]'
                />

                {/* Carves the left column out of the picture for the type. */}
                <div
                    aria-hidden='true'
                    className='pointer-events-none absolute inset-0 bg-[linear-gradient(98deg,#050609_6%,rgba(5,6,9,0.78)_34%,rgba(5,6,9,0.18)_66%,rgba(5,6,9,0.5)_100%)]'
                />

                <div
                    aria-hidden='true'
                    className='pointer-events-none absolute inset-x-0 bottom-0 h-[56%] bg-gradient-to-t from-ink via-ink/85 to-transparent'
                />
            </div>

            {/* Grain */}
            <div
                aria-hidden='true'
                className='grain-layer pointer-events-none absolute inset-0 z-[1] opacity-[0.05]'
            />

            {/* Top meta */}
            <div className='relative z-[2] flex items-start justify-between gap-6 edge-x pt-[13vh] md:pt-[15vh]'>
                <Reveal y={14} trigger='load' delay={0.95}>
                    <p className='label-mono text-bone/70'>
                        IDX/{studio.initials} — {studio.yearTo}
                    </p>
                </Reveal>

                <TrackIn
                    text={studio.role}
                    trigger='load'
                    delay={1}
                    duration={1.8}
                    fromTracking={0.34}
                    toTracking={-0.02}
                    className='label-mono text-right text-bone/70'
                />
            </div>

            {/* Middle */}
            <div className='relative z-[2] flex flex-1 items-center edge-x py-10'>
                <div className='grid w-full grid-cols-1 items-center gap-10 md:grid-cols-12'>
                    <div
                        data-hero-statement
                        className='will-change-transform md:col-span-7'
                    >
                        <LinesIn
                            as='h1'
                            lines={hero.statement}
                            trigger='load'
                            delay={0.34}
                            stagger={0.1}
                            duration={1.35}
                            from={128}
                            className='text-[clamp(26px,5.4vw,72px)] font-black uppercase leading-[1.02] tracking-[-0.05em]'
                        />
                    </div>

                    <div
                        data-hero-meters
                        className='will-change-transform md:col-span-4 md:col-start-9'
                    >
                        {hero.phases.map((phase, index) => (
                            <PhaseMeter
                                key={phase.index}
                                phase={phase}
                                delay={1.05 + index * 0.09}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Wordmark */}
            <div className='relative z-[2] edge-x'>
                <div data-hero-mark className='will-change-transform'>
                    <CharsIn
                        as='p'
                        text={hero.wordmark}
                        trigger='load'
                        delay={0.52}
                        stagger={0.07}
                        duration={1.6}
                        from={130}
                        className='display-tight text-[23vw] leading-[0.76] text-bone md:text-[25vw]'
                    />
                </div>

                <DrawLine
                    color='#f4521c'
                    thickness={3}
                    trigger='load'
                    delay={1.3}
                    duration={1.6}
                />

                <div className='flex items-end justify-between gap-6 pb-6 pt-4'>
                    <Reveal y={16} trigger='load' delay={1.46}>
                        <p className='text-[clamp(14px,1.4vw,20px)] font-bold tracking-[-0.03em]'>
                            {studio.artist}
                        </p>
                    </Reveal>

                    <div
                        data-hero-cue
                        className='flex items-end gap-3'
                    >
                        <Reveal y={16} trigger='load' delay={1.52}>
                            <span className='label-mono text-acid'>
                                {hero.explore}
                            </span>
                        </Reveal>

                        <DrawLine
                            orientation='vertical'
                            color='#f4521c'
                            trigger='load'
                            delay={1.58}
                            style={{ height: 34 }}
                        />
                    </div>
                </div>
            </div>

            {/* Skill rail */}
            <div className='relative z-[2] border-t border-hairline py-3'>
                <Marquee speed={38} repeat={3} reactive>
                    {hero.skills.map((skill) => (
                        <span
                            key={skill}
                            className='label-mono flex items-center whitespace-nowrap px-6 text-dust'
                        >
                            {skill}
                            <span className='ml-6 block size-[3px] bg-acid' />
                        </span>
                    ))}
                </Marquee>
            </div>
        </section>
    )
}

/* ── Phase meter ─────────────────────────────────────────────────────── */

interface PhaseMeterProps {
    phase: (typeof hero.phases)[number]
    delay: number
}

/**
 * A rule that fills to the phase's own value. Gated on `useSiteReady` so the
 * fills draw with the rest of the hero rather than racing the curtain.
 */
const PhaseMeter: FC<PhaseMeterProps> = ({ phase, delay }): ReactNode => {
    const ready = useSiteReady()

    const scope = useGsapContext<HTMLDivElement>(() => {
        const fill = scope.current?.querySelector('[data-phase-fill]')

        if (!fill) return

        gsap.set(fill, { scaleX: 0 })

        if (!ready) return

        gsap.to(fill, {
            scaleX: phase.fill,
            duration: 1.5,
            ease: 'expo.out',
            delay
        })
    }, [ready, delay])

    return (
        <div
            ref={scope}
            className='grid grid-cols-[auto_1fr_auto] items-center gap-4 border-t border-hairline py-[10px]'
        >
            <Reveal y={10} trigger='load' delay={delay}>
                <span className='label-mono text-bone/45'>{phase.index}</span>
            </Reveal>

            <div
                aria-hidden='true'
                className='relative h-px w-full bg-hairline'
            >
                <span
                    data-phase-fill
                    className='absolute inset-y-0 left-0 block w-full origin-left bg-acid'
                />
            </div>

            <Reveal y={10} trigger='load' delay={delay + 0.08}>
                <span className='label-mono text-bone/70'>
                    {phase.label}
                    <span className='text-acid'>{phase.value}</span>
                </span>
            </Reveal>
        </div>
    )
}
