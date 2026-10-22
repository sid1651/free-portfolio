import type { FC, ReactNode } from 'react'

import Image from 'next/image'
import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { SectionHeading } from '@/components/landing/section-heading'

const MATERIALS = [
    {
        id: 'aluminum',
        name: 'Anodized aluminum',
        spec: '6061-T6, bead-blasted',
        copy: 'Milled from one solid block and bead-blasted to a satin, stone-smooth finish that resists fingerprints and everyday wear.',
        image: '/images/closeup-earcup.jpg',
        alt: 'Macro view of a midnight aluminum earcup meeting its polished bronze chamfer'
    },
    {
        id: 'steel',
        name: 'Polished stainless steel',
        spec: '316L, mirror and brushed',
        copy: 'Yokes and sliders are cut from the same marine-grade steel found in fine dive watches, so every click stays precise for years.',
        image: '/images/closeup-hinge.jpg',
        alt: 'Close-up of the polished stainless steel slider, hinge and knurled crown'
    },
    {
        id: 'knit',
        name: 'Three-dimensional knit',
        spec: 'Seamless, breathable canopy',
        copy: 'One seamless piece of breathable knit spreads the weight evenly across your head, so nothing presses and nothing pinches.',
        image: '/images/closeup-headband.jpg',
        alt: 'Close-up of the dark knit canopy beneath the aluminum headband'
    },
    {
        id: 'cushion',
        name: 'Memory foam, protein leather',
        spec: '22 mm slow-recovery foam',
        copy: 'Cushions slowly mould to the exact contours of your head, wrapped in soft protein leather that stays supple season after season.',
        image: '/images/closeup-cushion.jpg',
        alt: 'Close-up of a plush charcoal ear cushion with fine stitching'
    }
]

export const Materials: FC = (): ReactNode => {
    const sectionRef = useRef<HTMLElement>(null)
    const pinRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const progressRef = useRef<HTMLSpanElement>(null)

    useGSAP(() => {
        const media = gsap.matchMedia()

        media.add({ desktop: '(min-width: 768px)', reduce: '(prefers-reduced-motion: reduce)' }, (context) => {
            const { desktop, reduce } = context.conditions as { desktop: boolean; reduce: boolean }
            const track = trackRef.current

            if (!desktop || !track) return

            const distance = (): number => Math.max(0, track.scrollWidth - window.innerWidth)

            const tween = gsap.to(track, {
                x: () => -distance(),
                ease: 'none',
                scrollTrigger: {
                    trigger: pinRef.current,
                    start: 'top top',
                    end: () => `+=${distance()}`,
                    pin: true,
                    scrub: reduce ? true : 0.8,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress.toFixed(4)})`
                    }
                }
            })

            if (reduce) return

            gsap.utils.toArray<HTMLElement>('[data-material-image]').forEach((image) => {
                gsap.fromTo(
                    image,
                    { xPercent: -7 },
                    {
                        xPercent: 7,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: image.parentElement ?? image,
                            containerAnimation: tween,
                            start: 'left right',
                            end: 'right left',
                            scrub: true
                        }
                    }
                )
            })
        })
    }, { scope: sectionRef })

    return (
        <section
            id='materials'
            ref={sectionRef}
            data-nav='design'
            aria-labelledby='materials-title'
            className='relative bg-background'
        >
            <div ref={pinRef} className='relative overflow-hidden py-24 md:flex md:h-[100svh] md:items-center md:py-0'>
                <div ref={trackRef} className='flex flex-col gap-12 md:w-max md:flex-row md:items-center md:gap-8 md:px-10 md:will-change-transform'>
                    <div className='px-5 md:w-[min(36vw,540px)] md:shrink-0 md:px-0 md:pr-12'>
                        <SectionHeading
                            id='materials-title'
                            index='02'
                            eyebrow='Admire it · Materials'
                            title={<>Real materials. No coatings, no compromise.</>}
                            description='Four materials, chosen for how they feel after a decade of daily use, not just the day you unbox them.'
                        />

                        <p className='mt-10 hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:flex'>
                            <span aria-hidden className='h-px w-10 bg-current opacity-50' />
                            Keep scrolling
                        </p>
                    </div>

                    <div className='no-scrollbar snap-x snap-mandatory overflow-x-auto overscroll-x-contain md:overflow-visible'>
                        <ol className='flex w-max gap-4 px-5 md:gap-8 md:px-0'>
                            {MATERIALS.map((material, index) => (
                                <li key={material.id} className='w-[78vw] shrink-0 snap-start sm:w-[48vw] md:w-[calc(58svh*0.8)] md:max-w-[520px]'>
                                    <figure>
                                        <div className='relative aspect-[4/5] overflow-hidden rounded-3xl bg-paper'>
                                            <Image
                                                src={material.image}
                                                alt={material.alt}
                                                fill
                                                sizes='(min-width: 768px) 520px, (min-width: 640px) 48vw, 78vw'
                                                data-material-image
                                                className='scale-[1.16] object-cover'
                                            />

                                            <span className='absolute left-4 top-4 rounded-full bg-background/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground backdrop-blur-md'>
                                                {String(index + 1).padStart(2, '0')} / {String(MATERIALS.length).padStart(2, '0')}
                                            </span>
                                        </div>

                                        <figcaption className='mt-6 flex flex-col gap-2'>
                                            <span className='font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
                                                {material.spec}
                                            </span>
                                            <span className='font-heading stretch-semi text-2xl font-medium tracking-[-0.03em]'>
                                                {material.name}
                                            </span>
                                            <span className='max-w-sm text-sm leading-relaxed text-muted-foreground'>
                                                {material.copy}
                                            </span>
                                        </figcaption>
                                    </figure>
                                </li>
                            ))}

                            <li aria-hidden className='w-px shrink-0 md:w-[6vw]' />
                        </ol>
                    </div>
                </div>

                <div className='absolute inset-x-10 bottom-10 hidden md:block'>
                    <div className='relative mx-auto h-px max-w-[1520px] bg-border'>
                        <span ref={progressRef} className='absolute inset-0 origin-left scale-x-0 bg-foreground' />
                    </div>
                </div>
            </div>
        </section>
    )
}
