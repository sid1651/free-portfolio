import type { FC, ReactNode } from 'react'
import type { MediaAsset } from '@/constants/media'

import Image from 'next/image'
import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { cn } from '@/lib/utils'
import { useReveal } from '@/hooks/use-reveal'
import { SplitWords } from '@/components/generals/split-words'
import { Viewfinder } from '@/components/generals/viewfinder'
import { media } from '@/constants/media'

type Column = {
    frames: (MediaAsset & { ratio: string })[]
    speed: number
    className?: string
}

const columns: Column[] = [
    {
        speed: -18,
        frames: [
            { ...media.resultShirt, ratio: 'aspect-[3/4]' },
            { ...media.showcaseCheers, ratio: 'aspect-[4/5]' },
            { ...media.brandSunglasses, ratio: 'aspect-[3/4]' }
        ]
    },
    {
        speed: 14,
        className: 'mt-[18vh]',
        frames: [
            { ...media.brandWhiteCoat, ratio: 'aspect-[4/3]' },
            { ...media.showcaseMotionOrange, ratio: 'aspect-square' },
            { ...media.heroVeil, ratio: 'aspect-[4/3]' }
        ]
    },
    {
        speed: -26,
        className: 'mt-[6vh]',
        frames: [
            { ...media.showcaseRedBar, ratio: 'aspect-[5/6]' },
            { ...media.resultLamp, ratio: 'aspect-[3/5]' },
            { ...media.brandJuice, ratio: 'aspect-[4/5]' }
        ]
    }
]

export const Showcase: FC = (): ReactNode => {
    const scope = useRef<HTMLElement>(null)

    useReveal(scope)

    useGSAP(() => {
        const root = scope.current
        if (!root) return

        const mm = gsap.matchMedia()

        mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
            root.querySelectorAll<HTMLElement>('[data-column]').forEach((column) => {
                const speed = Number(column.dataset.column) || 0

                gsap.fromTo(column, { yPercent: speed * -0.5 }, {
                    yPercent: speed,
                    ease: 'none',
                    scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true }
                })
            })

            gsap.fromTo(root.querySelector('[data-showcase-title]'), { scale: 0.86 }, {
                scale: 1.08,
                ease: 'none',
                scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true }
            })
        })

        return () => mm.revert()
    }, { scope })

    let frameNumber = 0

    return (
        <section ref={scope} id='showcase' aria-labelledby='showcase-title' className='relative overflow-hidden bg-ink py-24 text-bone md:py-32'>
            <div className='gutter relative grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6'>
                {columns.map((column, columnIndex) => (
                    <div
                        key={columnIndex}
                        className={cn('flex flex-col gap-3 md:gap-6', column.className, columnIndex === 2 && 'hidden md:flex')}
                        data-column={column.speed}
                    >
                        {column.frames.map((frame) => {
                            frameNumber += 1

                            return (
                                <figure key={frame.src} className='group flex flex-col gap-2'>
                                    <div className={cn('relative overflow-hidden bg-ink-raised', frame.ratio)}>
                                        <Image
                                            src={frame.src}
                                            alt={frame.alt}
                                            fill
                                            sizes='(min-width: 768px) 32vw, 46vw'
                                            className='object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105'
                                        />
                                        <Viewfinder size='sm' className='opacity-0 transition-opacity duration-500 group-hover:opacity-100' />
                                    </div>

                                    <figcaption className='eyebrow flex justify-between text-[0.6rem] text-stone'>
                                        <span>Fr {String(frameNumber).padStart(3, '0')}</span>
                                        <span>Novair / AI</span>
                                    </figcaption>
                                </figure>
                            )
                        })}
                    </div>
                ))}

                <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
                    <h2
                        id='showcase-title'
                        className='text-center text-white mix-blend-difference'
                        data-showcase-title=''
                    >
                        <span className='eyebrow mb-6 block text-white/80'>
                            Show Reel / 2026
                        </span>

                        <span className='block font-wide text-[clamp(3rem,12vw,14rem)] font-semibold uppercase leading-[0.82] tracking-[-0.06em]' data-reveal='words'>
                            <SplitWords text='Human' />
                        </span>

                        <span className='block font-serif text-[clamp(3rem,12vw,14rem)] italic leading-[0.82] tracking-[-0.03em]' data-reveal='words'>
                            <SplitWords text='× AI' />
                        </span>
                    </h2>
                </div>
            </div>
        </section>
    )
}
