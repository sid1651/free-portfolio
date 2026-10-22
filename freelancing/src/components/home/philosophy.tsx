import type { FC, ReactNode } from 'react'

import { gsap } from '@/lib/gsap'
import { useGsapContext } from '@/hooks/use-gsap'
import { CharsIn, WordsIn, Reveal, DrawLine } from '@/components/motion/reveal'

import { philosophy } from '@/constants/home'

/**
 * Section 08 — Creative philosophy.
 *
 * The bone plate. A ring of type turns continuously around the mark at the
 * centre and speeds up with the scroll, the two side columns arrive from
 * opposite edges, and the three cards deal in from below on a long stagger.
 */
export const Philosophy: FC = (): ReactNode => {
    const scope = useGsapContext<HTMLElement>(() => {
        const root = scope.current

        if (!root) return

        const ring = root.querySelector('[data-philosophy-ring]')
        const mark = root.querySelector('[data-philosophy-mark]')

        if (ring) {
            gsap.to(ring, {
                rotate: 360,
                duration: 26,
                ease: 'none',
                repeat: -1
            })

            gsap.to(ring, {
                rotate: '+=180',
                ease: 'none',
                scrollTrigger: {
                    trigger: root,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.2
                }
            })
        }

        if (mark) {
            gsap.fromTo(
                mark,
                { scale: 0.6, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 1.4,
                    ease: 'expo.out',
                    scrollTrigger: { trigger: root, start: 'top 76%', once: true }
                }
            )
        }
    }, [])

    return (
        <section
            id='philosophy'
            ref={scope}
            className='bg-bone edge-x py-[18vh] text-ink'
        >
            <div className='grid grid-cols-1 items-center gap-10 md:grid-cols-12'>
                <Reveal
                    x={-50}
                    y={0}
                    duration={1.3}
                    className='md:col-span-4'
                >
                    <p className='max-w-[16ch] text-[clamp(22px,2.8vw,34px)] font-black uppercase leading-[1.04] tracking-[-0.05em]'>
                        {philosophy.left}
                    </p>

                    <p className='mt-4 max-w-[34ch] text-[15px] font-semibold leading-[1.4] tracking-[-0.03em] text-graphite'>
                        {philosophy.leftNote}
                    </p>
                </Reveal>

                {/* Rotating mark */}
                <div className='relative mx-auto aspect-square w-[58vw] max-w-[320px] md:col-span-4 md:w-full'>
                    <div
                        data-philosophy-ring
                        aria-hidden='true'
                        className='absolute inset-0'
                    >
                        <svg viewBox='0 0 200 200' className='size-full'>
                            <defs>
                                <path
                                    id='philosophy-circle'
                                    d='M 100,100 m -74,0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0'
                                    fill='none'
                                />
                            </defs>

                            <text
                                fill='#050609'
                                fontSize='11'
                                letterSpacing='2.4'
                                style={{
                                    fontFamily:
                                        'var(--font-app-mono, monospace)'
                                }}
                            >
                                <textPath href='#philosophy-circle'>
                                    {philosophy.circularText}
                                </textPath>
                            </text>
                        </svg>
                    </div>

                    <div
                        data-philosophy-mark
                        className='absolute inset-[24%] flex items-center justify-center overflow-hidden'
                    >
                        <img
                            src={philosophy.rabbit}
                            alt=''
                            aria-hidden='true'
                            loading='lazy'
                            decoding='async'
                            className='size-full scale-[1.34] object-contain'
                        />
                    </div>
                </div>

                <Reveal
                    x={50}
                    y={0}
                    duration={1.3}
                    delay={0.1}
                    className='md:col-span-4'
                >
                    <p className='max-w-[38ch] text-[15px] font-semibold leading-[1.45] tracking-[-0.03em] text-graphite'>
                        {philosophy.right}
                    </p>
                </Reveal>
            </div>

            <div className='mt-[12vh]'>
                <CharsIn
                    as='h2'
                    text={philosophy.headline}
                    stagger={0.014}
                    duration={1.05}
                    className='display-tight text-[clamp(30px,6.6vw,92px)]'
                />

                <div className='mt-8 grid grid-cols-1 gap-8 md:grid-cols-12'>
                    <WordsIn
                        text={philosophy.signatureText}
                        stagger={0.016}
                        className='max-w-[62ch] text-[15px] font-semibold leading-[1.45] tracking-[-0.03em] text-graphite md:col-span-7'
                    />

                    <Reveal
                        y={24}
                        delay={0.12}
                        className='flex flex-col items-start gap-3 md:col-span-4 md:col-start-9 md:items-end'
                    >
                        <span className='text-[52px] font-black italic leading-none tracking-[-0.07em] text-acid'>
                            {philosophy.signature}
                        </span>

                        <span className='label-mono text-dust'>
                            {philosophy.tag}
                        </span>

                        <p className='text-[18px] font-black uppercase tracking-[-0.05em]'>
                            {philosophy.name[0]}{' '}
                            <span className='text-acid-dim'>
                                {philosophy.name[1]}
                            </span>
                        </p>
                    </Reveal>
                </div>
            </div>

            <Reveal
                y={70}
                duration={1.3}
                staggerChildren
                stagger={0.12}
                className='mt-[10vh] grid grid-cols-1 gap-px bg-hairline md:grid-cols-3'
            >
                {philosophy.cards.map((card) => (
                    <article
                        key={card.title}
                        className='group bg-ink p-7 text-bone transition-colors duration-700 hover:bg-ink-soft md:p-9'
                    >
                        <h3 className='text-[clamp(22px,2.4vw,30px)] font-black uppercase tracking-[-0.05em] transition-colors duration-500 group-hover:text-acid'>
                            {card.title}
                        </h3>

                        <DrawLine color='#292929' className='my-5' />

                        <p className='text-[15px] font-semibold leading-[1.45] tracking-[-0.03em] text-dust'>
                            {card.body}
                        </p>
                    </article>
                ))}
            </Reveal>
        </section>
    )
}
