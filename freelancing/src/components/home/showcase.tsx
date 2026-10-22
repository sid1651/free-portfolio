import type { FC, ReactNode } from 'react'

import { ArrowUpRight } from 'lucide-react'

import { CurtainMedia } from '@/components/motion/curtain-media'
import { Parallax } from '@/components/motion/media'
import { ScrubChars, WordsIn, Reveal, DrawLine } from '@/components/motion/reveal'

import { showcase } from '@/constants/home'

/**
 * Section 09 — Showcase.
 *
 * The second acid plate. The quote is scrubbed in glyph by glyph against a
 * portrait that keeps moving behind it, and the play control grows a ring on
 * hover rather than changing colour.
 */
export const Showcase: FC = (): ReactNode => {
    return (
        <section
            id='showcase'
            className='relative overflow-hidden bg-acid py-[9vh] text-ink'
        >
            <div className='grid grid-cols-1 gap-12 edge-x lg:grid-cols-12 lg:gap-8'>
                <div className='lg:col-span-6'>
                    <ScrubChars
                        as='blockquote'
                        text={showcase.quote}
                        dim={0.16}
                        className='max-w-[22ch] text-[clamp(24px,3.6vw,50px)] font-black uppercase leading-[1.06] tracking-[-0.05em]'
                    />

                    <Reveal y={18} delay={0.1} className='mt-6'>
                        <span className='label-mono text-ink/60'>
                            {showcase.quoteAuthor}
                        </span>
                    </Reveal>

                    <div className='mt-[8vh]'>
                        <DrawLine color='#050609' className='mb-6 opacity-40' />

                        <a
                            href='/about'
                            data-cursor='link'
                            data-cursor-label='EXPLORE'
                            aria-label={`Read about ${showcase.title}`}
                            className='group flex items-center gap-5 text-left'
                        >
                            <span className='relative flex size-[62px] shrink-0 items-center justify-center rounded-full border border-ink transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105'>
                                <ArrowUpRight className='size-5' />

                                <span
                                    aria-hidden='true'
                                    className='absolute inset-0 scale-100 rounded-full border border-ink opacity-0 transition-all duration-[900ms] ease-out group-hover:scale-[1.35] group-hover:opacity-40'
                                />
                            </span>

                            <span>
                                <span className='block text-[clamp(18px,2vw,26px)] font-black uppercase leading-[1.1] tracking-[-0.05em]'>
                                    {showcase.title}
                                </span>

                                <span className='mt-1 block max-w-[44ch] text-[14px] font-semibold leading-[1.35] tracking-[-0.03em] text-ink/70'>
                                    {showcase.subtitle}
                                </span>
                            </span>
                        </a>

                        <Reveal
                            y={20}
                            delay={0.14}
                            className='mt-8 flex flex-wrap gap-x-8 gap-y-3'
                        >
                            <span className='label-mono text-ink/60'>
                                {showcase.duration}
                            </span>

                            <span className='label-mono text-ink/60'>
                                {showcase.format}
                            </span>

                            <span className='label-mono text-ink/60'>
                                {showcase.recorded}
                            </span>
                        </Reveal>
                    </div>
                </div>

                <div className='lg:col-span-5 lg:col-start-8'>
                    <Parallax speed={-9}>
                        <CurtainMedia
                            src={showcase.image}
                            alt={showcase.imageCaption}
                            mask='#f4521c'
                            curtain='wipe-down'
                            zoom={1.3}
                            caption={showcase.imageCaption}
                            sublabel={showcase.imageLabel}
                            className='aspect-[3/4] w-full'
                        />
                    </Parallax>

                    <WordsIn
                        text={`${showcase.imageCaption} / ${showcase.imageLabel}`}
                        delay={0.1}
                        className='label-mono mt-4 text-ink/60'
                    />
                </div>
            </div>
        </section>
    )
}
