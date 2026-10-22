import type { FC, ReactNode } from 'react'

import { gsap } from '@/lib/gsap'
import { useGsapContext } from '@/hooks/use-gsap'
import { CurtainMedia } from '@/components/motion/curtain-media'
import { LinesIn, WordsIn, Reveal, DrawLine } from '@/components/motion/reveal'

import { concept } from '@/constants/home'

/**
 * Section 03 — Concept.
 *
 * The plate on the left is pinned for the length of the section while the
 * right-hand column keeps moving past it, and the image inside the pinned
 * frame slowly reframes itself so the stationary element is never static.
 */
export const Concept: FC = (): ReactNode => {
    const scope = useGsapContext<HTMLElement>(() => {
        const root = scope.current

        if (!root) return

        const plate = root.querySelector('[data-concept-plate]')
        const revision = root.querySelector('[data-concept-revision]')

        if (plate) {
            gsap.fromTo(
                plate,
                { scale: 1.16, yPercent: -4 },
                {
                    scale: 1,
                    yPercent: 4,
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

        if (revision) {
            gsap.to(revision, {
                xPercent: -18,
                ease: 'none',
                scrollTrigger: {
                    trigger: root,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.4
                }
            })
        }
    }, [])

    return (
        <section
            id='concept'
            ref={scope}
            className='bg-ink edge-x py-[15vh] text-bone'
        >
            <div className='grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8'>
                {/* Pinned plate — held on the right, against the sections
                    either side that put their picture on the left. */}
                <div className='lg:col-span-4 lg:col-start-9 lg:row-start-1'>
                    <div className='lg:sticky lg:top-[14vh]'>
                        <div data-concept-plate className='will-change-transform'>
                            <CurtainMedia
                                src={concept.image}
                                alt='Black and white portrait from the Hitha portfolio'
                                mask='#050609'
                                staticZoom={1}
                                className='aspect-[3/4] w-full'
                            />
                        </div>

                        <div
                            aria-hidden='true'
                            className='mt-4 h-[36px] w-full opacity-60'
                            style={{
                                backgroundImage:
                                    'url(/images/tnobQFH7tWaSDaDgkbY5Q6JOla8.svg)',
                                backgroundRepeat: 'repeat',
                                backgroundSize: '11px auto'
                            }}
                        />

                        <div className='mt-3 flex items-center justify-between'>
                            <span className='label-mono text-acid'>
                                {concept.imageTitle}
                            </span>

                            <span
                                data-concept-revision
                                className='label-mono whitespace-nowrap text-dust'
                            >
                                {concept.revision}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Scrolling column */}
                <div className='lg:col-span-7 lg:col-start-1 lg:row-start-1'>
                    <Reveal y={14} className='mb-6'>
                        <span className='label-mono text-dust'>
                            {concept.kicker}
                        </span>
                    </Reveal>

                    <LinesIn
                        as='h2'
                        lines={concept.title}
                        stagger={0.1}
                        from={118}
                        className='display-tight text-[clamp(40px,7vw,96px)]'
                    />

                    <WordsIn
                        text={concept.description}
                        delay={0.2}
                        stagger={0.025}
                        className='mt-8 max-w-[46ch] text-[clamp(16px,1.7vw,20px)] font-semibold leading-[1.35] tracking-[-0.03em] text-smoke'
                    />

                    <LinesIn
                        as='p'
                        lines={concept.strapline}
                        delay={0.1}
                        stagger={0.1}
                        skew={-3}
                        start='top 84%'
                        className='mt-[9vh] display-tight text-[clamp(28px,4.4vw,60px)] text-acid'
                    />

                    <div className='mt-[8vh] flex flex-col gap-8'>
                        {concept.catalog.map((entry, index) => (
                            <div key={entry.code}>
                                <DrawLine
                                    color='#292929'
                                    delay={index * 0.1}
                                    className='mb-4'
                                />

                                <Reveal
                                    y={22}
                                    delay={index * 0.1}
                                    start='top 92%'
                                    className='grid grid-cols-1 gap-3 md:grid-cols-[110px_1fr]'
                                >
                                    <span className='label-mono text-acid'>
                                        {entry.code}
                                    </span>

                                    <p className='max-w-[52ch] text-[16px] font-semibold leading-[1.35] tracking-[-0.03em] text-ash'>
                                        {entry.body}
                                    </p>
                                </Reveal>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
