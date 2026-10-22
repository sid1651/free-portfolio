import type { FC, ReactNode } from 'react'

import { useState } from 'react'

import { cn } from '@/lib/utils'
import { CurtainMedia } from '@/components/motion/curtain-media'
import { Parallax } from '@/components/motion/media'
import { Marquee } from '@/components/motion/marquee'
import { LinesIn, TrackIn, Reveal } from '@/components/motion/reveal'

import { featured } from '@/constants/home'

/**
 * Section 05 — Featured study.
 *
 * The acid plate. Two wide bands slide past each other in opposite directions
 * while the artifact thumbnails cross-fade the upper band on hover, so the
 * section reacts to the pointer as well as to the scroll.
 */
export const Featured: FC = (): ReactNode => {
    const [active, setActive] = useState<number | null>(null)

    return (
        <section
            id='featured-study'
            className='relative overflow-hidden bg-acid py-[10vh] text-ink'
        >
            <div className='border-y border-ink/25 py-4'>
                <Marquee speed={42} repeat={4} direction='right'>
                    <span className='display-tight px-8 text-[clamp(40px,7vw,96px)]'>
                        {featured.marquee}
                    </span>

                    <span
                        aria-hidden='true'
                        className='display-tight px-8 text-[clamp(40px,7vw,96px)] text-transparent'
                        style={{ WebkitTextStroke: '1px #050609' }}
                    >
                        {featured.marquee}
                    </span>
                </Marquee>
            </div>

            <div className='mt-[8vh] grid grid-cols-1 gap-12 edge-x lg:grid-cols-12 lg:gap-8'>
                {/* Left — narrower than the plates, so the media leads. */}
                <div className='lg:col-span-4'>
                    <div className='flex items-center justify-between'>
                        <Reveal y={12}>
                            <span className='label-mono text-ink/60'>
                                {featured.study}
                            </span>
                        </Reveal>

                        <TrackIn
                            text={featured.kicker}
                            fromTracking={0.34}
                            toTracking={0.04}
                            className='text-[12px] font-bold uppercase'
                        />
                    </div>

                    <div
                        aria-hidden='true'
                        className='my-6 h-[30px] w-full opacity-40'
                        style={{
                            backgroundImage:
                                'url(/images/KQaQPBCQCv0Dk6IXosxWxpY7pFE.svg)',
                            backgroundRepeat: 'repeat',
                            backgroundSize: '11px auto'
                        }}
                    />

                    <LinesIn
                        as='h2'
                        lines={featured.headline}
                        stagger={0.08}
                        from={116}
                        className='display-tight text-[clamp(38px,6vw,86px)]'
                    />

                    <LinesIn
                        as='p'
                        lines={featured.headlineTwo}
                        delay={0.14}
                        stagger={0.08}
                        from={116}
                        className='display-tight text-[clamp(38px,6vw,86px)] text-bone'
                    />

                    <Reveal y={24} delay={0.24} className='mt-9 max-w-[38ch]'>
                        <p className='text-[16px] font-bold uppercase leading-[1.25] tracking-[-0.04em]'>
                            {featured.artistDescription}
                        </p>

                        <p className='mt-5 text-[14px] font-semibold uppercase leading-[1.3] tracking-[-0.03em] text-ink/65'>
                            {featured.editorial}
                        </p>
                    </Reveal>

                    {/* Artifacts */}
                    <div className='mt-10 grid grid-cols-3 gap-3'>
                        {featured.thumbnails.map((thumb, index) => (
                            <button
                                key={thumb.caption}
                                type='button'
                                data-cursor='view'
                                onMouseEnter={() => setActive(index)}
                                onMouseLeave={() => setActive(null)}
                                onFocus={() => setActive(index)}
                                onBlur={() => setActive(null)}
                                aria-label={`Preview ${thumb.caption}`}
                                className='group text-left'
                            >
                                <div
                                    className={cn(
                                        'relative aspect-square w-full overflow-hidden transition-[filter,transform] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                                        active === index
                                            ? 'scale-[1.04] grayscale-0'
                                            : 'grayscale'
                                    )}
                                >
                                    <img
                                        src={thumb.src}
                                        alt={thumb.caption}
                                        loading='lazy'
                                        decoding='async'
                                        className='size-full object-cover'
                                    />
                                </div>

                                <span
                                    className={cn(
                                        'label-mono mt-2 block transition-colors duration-500',
                                        active === index
                                            ? 'text-ink'
                                            : 'text-ink/55'
                                    )}
                                >
                                    {thumb.caption}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right */}
                <div className='lg:col-span-7 lg:col-start-6'>
                    <Parallax speed={-10}>
                        <div className='relative aspect-[16/6] w-full overflow-hidden'>
                            <CurtainMedia
                                src={featured.wideTop}
                                alt='Arden Halo headphones in studio light'
                                mask='#f4521c'
                                staticZoom={1}
                                imageClassName='object-[center_28%]'
                                className='absolute inset-0 size-full'
                            />

                            {featured.thumbnails.map((thumb, index) => (
                                <img
                                    key={thumb.src}
                                    src={thumb.src}
                                    alt=''
                                    aria-hidden='true'
                                    loading='lazy'
                                    decoding='async'
                                    className={cn(
                                        'absolute inset-0 size-full object-cover transition-opacity duration-[700ms] ease-out',
                                        active === index
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                    )}
                                />
                            ))}
                        </div>
                    </Parallax>

                    <Parallax speed={12} className='mt-5'>
                        <CurtainMedia
                            src={featured.wideBottom}
                            alt='NOVAIR Studio portrait concept'
                            mask='#f4521c'
                            curtain='inverted'
                            zoom={1.3}
                            className='aspect-[16/6] w-full'
                        />
                    </Parallax>

                    <div className='mt-8 overflow-hidden'>
                        <Marquee speed={26} repeat={6} direction='left'>
                            <span className='label-mono px-5 text-ink/70'>
                                {featured.connected}
                            </span>
                        </Marquee>
                    </div>
                </div>
            </div>
        </section>
    )
}
