import type { FC, ReactNode } from 'react'

import { gsap } from '@/lib/gsap'
import { useGsapContext } from '@/hooks/use-gsap'
import { CurtainMedia } from '@/components/motion/curtain-media'
import { Parallax } from '@/components/motion/media'

import {
    CharsIn,
    LinesIn,
    WordsIn,
    Reveal,
    DrawLine
} from '@/components/motion/reveal'

import { statement } from '@/constants/home'

/**
 * Section 07 — Artist statement.
 *
 * The ash plate, and the only symmetric composition on the page: the headline
 * is centred, a marker pulses on a rule beneath it, and the copy is then
 * flanked by two plates that travel in opposite directions. Everything either
 * side of this section is asymmetric, so the axis change is what marks it out
 * rather than another column split.
 */
export const Statement: FC = (): ReactNode => {
    const scope = useGsapContext<HTMLElement>(() => {
        const dot = scope.current?.querySelector('[data-statement-dot]')

        if (!dot) return

        gsap.to(dot, {
            opacity: 0.15,
            scale: 0.55,
            duration: 0.62,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        })
    }, [])

    return (
        <section
            id='statement'
            ref={scope}
            className='bg-ash edge-x pb-[15vh] pt-[11vh] text-ink'
        >
            {/* Centred opening */}
            <div className='mx-auto max-w-[940px] text-center'>
                <LinesIn
                    as='h2'
                    lines={statement.headline}
                    stagger={0.11}
                    skew={4}
                    from={120}
                    lineClassName='text-center'
                    className='display-tight text-[clamp(40px,8.2vw,116px)]'
                />

                <WordsIn
                    text={statement.subtitle}
                    delay={0.12}
                    stagger={0.03}
                    className='mx-auto mt-7 max-w-[34ch] text-[clamp(17px,2.1vw,26px)] font-bold uppercase leading-[1.16] tracking-[-0.045em]'
                />
            </div>

            {/* Marker on the axis */}
            <div className='mx-auto my-[9vh] flex max-w-[940px] items-center gap-4'>
                <div className='flex-1'>
                    <DrawLine color='#050609' className='opacity-30' />
                </div>

                <span
                    data-statement-dot
                    aria-hidden='true'
                    className='block size-[10px] shrink-0 rounded-full bg-ink'
                />

                <div className='flex-1'>
                    <DrawLine color='#050609' className='opacity-30' />
                </div>
            </div>

            {/* Flanked row — plates either side of the copy */}
            <div className='grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8'>
                <Parallax speed={-11} className='md:col-span-4'>
                    <CurtainMedia
                        src={statement.imageTop}
                        alt='Arden Halo headphones in a lifestyle setting'
                        mask='#d9d9d9'
                        zoom={1.3}
                        className='aspect-[3/4] w-full'
                    />
                </Parallax>

                <div className='md:col-span-4 md:self-center'>
                    <CharsIn
                        as='p'
                        text={statement.messageOne}
                        stagger={0.016}
                        className='text-[clamp(20px,2.6vw,34px)] font-black uppercase leading-[1.04] tracking-[-0.05em]'
                    />

                    <CharsIn
                        as='p'
                        text={statement.messageTwo}
                        delay={0.14}
                        stagger={0.016}
                        className='text-[clamp(20px,2.6vw,34px)] font-black uppercase leading-[1.04] tracking-[-0.05em] text-graphite'
                    />

                    <WordsIn
                        text={statement.lines}
                        delay={0.24}
                        className='mt-4 text-[15px] font-semibold tracking-[-0.03em] text-graphite'
                    />

                    <Reveal y={26} delay={0.3} className='mt-7'>
                        <p className='text-[15px] font-semibold leading-[1.45] tracking-[-0.03em] text-graphite'>
                            {statement.footnote}
                        </p>
                    </Reveal>

                    <Reveal
                        y={18}
                        delay={0.36}
                        staggerChildren
                        stagger={0.06}
                        className='mt-7 flex flex-wrap gap-x-5 gap-y-2'
                    >
                        {statement.features.map((feature) => (
                            <span
                                key={feature}
                                className='label-mono text-ink/60'
                            >
                                {feature}
                            </span>
                        ))}
                    </Reveal>
                </div>

                <Parallax speed={9} className='md:col-span-4'>
                    <CurtainMedia
                        src={statement.imageBottom}
                        alt='NOVAIR Studio campaign concept'
                        mask='#d9d9d9'
                        curtain='inverted'
                        zoom={1.25}
                        className='aspect-[3/4] w-full'
                    />
                </Parallax>
            </div>

            {/* Wide plate, full measure */}
            <div className='mt-[13vh]'>
                <Parallax speed={6}>
                    <CurtainMedia
                        src={statement.image}
                        alt={statement.imageCaption}
                        mask='#d9d9d9'
                        curtain='wipe-down'
                        zoom={1.28}
                        caption={statement.imageCaption}
                        sublabel={statement.imageLabel}
                        className='aspect-[4/5] w-full md:aspect-[16/7]'
                    />
                </Parallax>

                <Reveal
                    y={16}
                    delay={0.08}
                    className='mt-4 flex flex-wrap items-center gap-x-3'
                >
                    <span className='text-[14px] font-bold uppercase tracking-[-0.03em]'>
                        {statement.imageCaption}
                    </span>

                    <span className='label-mono text-graphite'>
                        / {statement.imageLabel}
                    </span>
                </Reveal>
            </div>
        </section>
    )
}
