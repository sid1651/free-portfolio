import type { FC, ReactNode } from 'react'

import { ScrubCrop } from '@/components/motion/media'
import { LinesIn, ScrubChars, Reveal } from '@/components/motion/reveal'

import { intro } from '@/constants/home'

/**
 * Section 01 — Intro.
 *
 * The frame itself is the animation: the picture starts as a narrow column
 * and widens across the scroll pass while the photo inside drifts the other
 * way. The statement underneath is read glyph by glyph by the scroll.
 */
export const Intro: FC = (): ReactNode => {
    return (
        <section
            id='intro'
            className='relative overflow-hidden bg-ink pb-[17vh] pt-[9vh] text-bone'
        >
            {/* Header rule above the plate, not a caption hung below it. */}
            <div className='edge-x'>
                <Reveal
                    y={14}
                    className='mb-5 flex items-end justify-between gap-6 border-b border-hairline pb-4'
                >
                    <span className='label-mono text-acid'>
                        {intro.caption}
                    </span>

                    <span className='label-mono text-dust'>
                        / {intro.captionLabel}
                    </span>
                </Reveal>
            </div>

            <div className='flex justify-center'>
                <ScrubCrop
                    src={intro.image}
                    alt={intro.caption}
                    drift={18}
                    fromWidth={38}
                    toWidth={92}
                    className='h-[46vh] md:h-[72vh]'
                />
            </div>

            <div className='edge-x'>
                {/* Right-aligned, against the left-aligned sections either side. */}
                <LinesIn
                    as='h2'
                    lines={intro.title}
                    stagger={0.12}
                    skew={3}
                    start='top 82%'
                    lineClassName='text-right'
                    className='mt-[11vh] display-tight text-[clamp(34px,7.4vw,104px)]'
                />

                <div className='mt-12 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-12'>
                    <div className='md:col-span-3'>
                        <Reveal y={24} start='top 88%'>
                            <p className='text-[16px] font-semibold leading-[1.4] tracking-[-0.03em] text-smoke'>
                                {intro.note}
                            </p>
                        </Reveal>

                        <Reveal y={24} delay={0.12} start='top 88%'>
                            <p className='mt-6 text-[16px] font-semibold uppercase leading-[1.3] tracking-[-0.04em] text-dust'>
                                {intro.footnote}
                            </p>
                        </Reveal>
                    </div>

                    <ScrubChars
                        text={intro.subtitle}
                        dim={0.14}
                        className='text-[clamp(17px,2.2vw,28px)] font-bold uppercase leading-[1.18] tracking-[-0.045em] md:col-span-8 md:col-start-5'
                    />
                </div>
            </div>
        </section>
    )
}
