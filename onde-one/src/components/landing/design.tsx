import type { FC, ReactNode } from 'react'

import Image from 'next/image'
import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { SectionHeading } from '@/components/landing/section-heading'

const STATS = [
    { value: '92 min', label: 'on the mill for every single earcup' },
    { value: '0.01 mm', label: 'maximum gap between joining parts' },
    { value: '14', label: 'finishing steps, each one done by hand' }
]

export const Design: FC = (): ReactNode => {
    const sectionRef = useRef<HTMLElement>(null)
    const pinRef = useRef<HTMLDivElement>(null)
    const frameRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLDivElement>(null)
    const captionRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const media = gsap.matchMedia()

        media.add({ desktop: '(min-width: 768px)', reduce: '(prefers-reduced-motion: reduce)' }, (context) => {
            const { desktop, reduce } = context.conditions as { desktop: boolean; reduce: boolean }

            if (reduce) return

            if (desktop) {
                gsap.timeline({
                    scrollTrigger: {
                        trigger: pinRef.current,
                        start: 'top top',
                        end: '+=115%',
                        scrub: 0.8,
                        pin: true,
                        anticipatePin: 1
                    }
                })
                    .fromTo(frameRef.current, { clipPath: 'inset(16% 22% 16% 22% round 32px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', duration: 1 })
                    .fromTo(imageRef.current, { scale: 1.3 }, { scale: 1, ease: 'none', duration: 1 }, 0)
                    .fromTo(captionRef.current, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.32 }, 0.72)

                return
            }

            gsap.timeline({
                scrollTrigger: {
                    trigger: frameRef.current,
                    start: 'top 88%',
                    end: 'center 45%',
                    scrub: 0.8
                }
            })
                .fromTo(frameRef.current, { clipPath: 'inset(12% 10% 12% 10% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 24px)', ease: 'none' })
                .fromTo(imageRef.current, { scale: 1.25 }, { scale: 1, ease: 'none' }, 0)
        })
    }, { scope: sectionRef })

    return (
        <section
            id='design'
            ref={sectionRef}
            data-nav='design'
            aria-labelledby='design-title'
            className='relative bg-background'
        >
            <div className='mx-auto max-w-[1600px] px-5 pt-10 md:px-10 md:pt-16'>
                <div className='grid gap-10 lg:grid-cols-12 lg:items-end'>
                    <SectionHeading
                        id='design-title'
                        index='01'
                        eyebrow='Admire it · Industrial design'
                        title={<>Sculpted from<br />solid metal.</>}
                        className='lg:col-span-7'
                    />

                    <p data-reveal className='max-w-md text-base leading-relaxed text-muted-foreground md:text-lg lg:col-span-4 lg:col-start-9'>
                        Every earcup starts life as a single block of aerospace-grade aluminum. Ninety-two minutes on a five-axis mill turn it into one seamless shell, softly bead-blasted and edged with a hand-polished bronze chamfer.
                    </p>
                </div>
            </div>

            <div ref={pinRef} className='relative mt-12 md:mt-20 md:h-[100svh] md:overflow-hidden'>
                <div className='relative mx-5 aspect-[4/5] md:absolute md:inset-0 md:mx-0 md:aspect-auto'>
                    <div ref={frameRef} className='absolute inset-0 overflow-hidden rounded-3xl bg-paper md:rounded-none'>
                        <div ref={imageRef} className='absolute inset-0 will-change-transform'>
                            <Image
                                src='/images/product-studio.jpg'
                                alt='Arden Halo headphones floating in a photo studio, midnight earcups framed by bronze chamfers'
                                fill
                                sizes='100vw'
                                className='object-cover object-[50%_45%]'
                            />
                        </div>
                    </div>
                </div>

                <div
                    ref={captionRef}
                    className='mx-auto flex max-w-[1600px] flex-col gap-8 px-5 pt-10 md:absolute md:inset-x-0 md:bottom-0 md:flex-row md:items-end md:justify-between md:px-10 md:pb-14 md:pt-0'
                >
                    <p className='font-heading stretch-semi text-[clamp(2.1rem,4.4vw,4.4rem)] font-medium leading-[0.95] tracking-[-0.04em]'>
                        One block.
                        <br />
                        One form.
                        <br />
                        Zero seams.
                    </p>

                    <dl className='grid grid-cols-3 gap-5 md:max-w-2xl md:gap-10'>
                        {STATS.map((stat) => (
                            <div key={stat.value} className='flex flex-col gap-2 border-t border-foreground/20 pt-4'>
                                <dt className='order-2 text-xs leading-relaxed text-foreground/70 md:text-sm'>
                                    {stat.label}
                                </dt>
                                <dd className='order-1 font-heading stretch-semi text-xl font-medium tracking-[-0.03em] md:text-3xl'>
                                    {stat.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    )
}
