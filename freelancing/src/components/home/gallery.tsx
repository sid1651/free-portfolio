import type { FC, ReactNode } from 'react'

import { useCallback, useState } from 'react'

import { CurtainMedia } from '@/components/motion/curtain-media'
import { Parallax } from '@/components/motion/media'
import { Reveal } from '@/components/motion/reveal'
import { GalleryLightbox } from '@/components/home/gallery-lightbox'

import { gallery } from '@/constants/home'

/* Each tile gets its own travel and its own curtain so the grid never lands
   as one block. Middle tiles lead the scroll, outer tiles lag behind it. */
const RHYTHM = [
    { speed: 9, offset: 'md:mt-[9vh]', ratio: 'aspect-[3/4]' },
    { speed: -12, offset: '', ratio: 'aspect-[2/3]' },
    { speed: 6, offset: 'md:mt-[16vh]', ratio: 'aspect-[6/5]' },
    { speed: -8, offset: 'md:mt-[4vh]', ratio: 'aspect-[7/10]' },
    { speed: 13, offset: 'md:mt-[20vh]', ratio: 'aspect-[2/3]' },
    { speed: -5, offset: '', ratio: 'aspect-[3/4]' }
] as const

/**
 * Section 02 — Image gallery.
 * Six plates on staggered baselines, each drifting at a different rate.
 */
export const Gallery: FC = (): ReactNode => {
    const [active, setActive] = useState<number | null>(null)

    const close = useCallback(() => setActive(null), [])

    const step = useCallback((direction: 1 | -1) => {
        setActive((current) => {
            if (current === null) return current

            return (current + direction + gallery.length) % gallery.length
        })
    }, [])

    return (
        <section
            id='gallery'
            className='bg-ink edge-x pb-[14vh] pt-[4vh] text-bone'
        >
            <h2 className='sr-only'>Selected frames</h2>

            <div className='grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6'>
                {gallery.map((item, index) => {
                    const rhythm = RHYTHM[index]

                    return (
                        <figure
                            key={item.src}
                            className={`group ${rhythm.offset}`}
                        >
                            <button
                                type='button'
                                onClick={() => setActive(index)}
                                aria-label={`Open ${item.caption} full size`}
                                data-cursor='link'
                                className='block w-full text-left'
                            >
                                <Parallax speed={rhythm.speed}>
                                    <CurtainMedia
                                        src={item.src}
                                        alt={item.caption}
                                        mask='#050609'
                                        curtain={
                                            index % 3 === 1
                                                ? 'inverted'
                                                : 'split'
                                        }
                                        zoom={1.32}
                                        className={`w-full ${rhythm.ratio}`}
                                        imageClassName='transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]'
                                    />
                                </Parallax>
                            </button>

                            <Reveal y={18} delay={0.08} start='top 94%'>
                                <figcaption className='mt-4'>
                                    <p className='text-[13px] font-bold uppercase leading-[1.2] tracking-[-0.03em] text-bone transition-colors duration-500 group-hover:text-acid md:text-[15px]'>
                                        {item.caption}
                                    </p>

                                    <p className='label-mono mt-1 text-dust'>
                                        {item.label} — {item.place}
                                    </p>
                                </figcaption>
                            </Reveal>
                        </figure>
                    )
                })}
            </div>

            <GalleryLightbox index={active} onClose={close} onStep={step} />
        </section>
    )
}
