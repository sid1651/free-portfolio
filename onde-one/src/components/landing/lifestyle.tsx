import type { FC, ReactNode } from 'react'

import Image from 'next/image'
import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { SectionHeading } from '@/components/landing/section-heading'

const MOMENTS = [
    {
        time: '07:40',
        title: 'The commute',
        copy: 'The train gets crowded. Your world stays perfectly calm.',
        image: '/images/lifestyle-commute.jpg',
        alt: 'A man on a morning train looking out of the window, wearing Arden Halo',
        position: '68% 40%'
    },
    {
        time: '10:15',
        title: 'Deep work',
        copy: 'Hours of deep focus, and you never once noticed you were wearing them.',
        image: '/images/lifestyle-studio.jpg',
        alt: 'A woman working at an oak desk in a bright home studio, wearing Arden Halo',
        position: '38% 40%'
    },
    {
        time: '18:50',
        title: 'The long way home',
        copy: 'Transparency on. The city returns gently, in rich, natural stereo.',
        image: '/images/lifestyle-city.jpg',
        alt: 'A man in a trench coat walking down a stone street at dusk, wearing Arden Halo',
        position: '62% 35%'
    },
    {
        time: '22:30',
        title: 'Unwind',
        copy: 'One final album before bed, with forty hours of battery still left.',
        image: '/images/lifestyle-home.jpg',
        alt: 'A woman relaxing on a linen sofa in lamplight, eyes closed, wearing Arden Halo',
        position: '72% 40%'
    }
]

export const Lifestyle: FC = (): ReactNode => {
    const sectionRef = useRef<HTMLElement>(null)
    const pinRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const layers = gsap.utils.toArray<HTMLElement>('.moment-layer')
        const captions = gsap.utils.toArray<HTMLElement>('.moment-caption')
        const ticks = gsap.utils.toArray<HTMLElement>('.moment-tick')
        const media = gsap.matchMedia()

        media.add({ reduce: '(prefers-reduced-motion: reduce)' }, (context) => {
            const { reduce } = context.conditions as { reduce: boolean }
            const timeline = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                    trigger: pinRef.current,
                    start: 'top top',
                    end: () => `+=${window.innerHeight * (MOMENTS.length - 1)}`,
                    pin: true,
                    scrub: reduce ? true : 0.8,
                    anticipatePin: 1,
                    invalidateOnRefresh: true
                }
            })

            layers.forEach((layer, index) => {
                if (index === 0) return

                const at = index - 1
                const image = layer.querySelector('.moment-image')
                const shade = layers[index - 1].querySelector('.moment-shade')

                timeline.fromTo(layer, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, at)

                if (image && !reduce) timeline.fromTo(image, { scale: 1.22, yPercent: 8 }, { scale: 1, yPercent: 0, duration: 1 }, at)
                if (shade) timeline.fromTo(shade, { opacity: 0 }, { opacity: 0.55, duration: 1 }, at)

                timeline.to(captions[index - 1], { autoAlpha: 0, y: -36, duration: 0.3, ease: 'power1.in' }, at + 0.12)
                timeline.fromTo(captions[index], { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }, at + 0.6)
                timeline.fromTo(ticks[index], { scaleX: 0 }, { scaleX: 1, duration: 1 }, at)
            })
        })
    }, { scope: sectionRef })

    return (
        <section
            id='lifestyle'
            ref={sectionRef}
            aria-labelledby='lifestyle-title'
            className='relative bg-background'
        >
            <div className='mx-auto max-w-[1600px] px-5 pb-12 pt-24 md:px-10 md:pb-16 md:pt-40'>
                <div className='flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between'>
                    <SectionHeading
                        id='lifestyle-title'
                        index='08'
                        eyebrow='Own it · Every day'
                        title={<>A day with Arden Halo.</>}
                    />

                    <p data-reveal className='max-w-md text-base leading-relaxed text-muted-foreground md:text-lg'>
                        From the first train of the morning to the final song at night, all on a single charge, with plenty to spare for tomorrow.
                    </p>
                </div>

                <ol className='sr-only'>
                    {MOMENTS.map((moment) => (
                        <li key={moment.time}>
                            {moment.time}, {moment.title}. {moment.copy}
                        </li>
                    ))}
                </ol>
            </div>

            <div ref={pinRef} className='relative h-[100svh] overflow-hidden bg-foreground'>
                {MOMENTS.map((moment, index) => (
                    <div
                        key={moment.time}
                        className='moment-layer absolute inset-0 overflow-hidden'
                        style={index > 0 ? { clipPath: 'inset(100% 0% 0% 0%)' } : undefined}
                    >
                        <div className='moment-image absolute inset-0 will-change-transform'>
                            <Image
                                src={moment.image}
                                alt={moment.alt}
                                fill
                                sizes='100vw'
                                className='object-cover'
                                style={{ objectPosition: moment.position }}
                            />
                        </div>
                        <div aria-hidden className='absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.68),rgb(0_0_0/0.08)_45%,rgb(0_0_0/0.18))]' />
                        <div aria-hidden className='moment-shade absolute inset-0 bg-black opacity-0' />
                    </div>
                ))}

                <div aria-hidden className='absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-5 pb-8 md:px-10 md:pb-12'>
                    <div className='relative min-h-[240px] md:min-h-[260px]'>
                        {MOMENTS.map((moment, index) => (
                            <div
                                key={moment.time}
                                className='moment-caption absolute bottom-0 left-0 max-w-3xl text-white'
                                style={index > 0 ? { opacity: 0, visibility: 'hidden' } : undefined}
                            >
                                <p className='flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-white/75'>
                                    <span className='size-1.5 rounded-full bg-bronze' />
                                    {moment.time}
                                </p>
                                <p className='mt-4 font-heading stretch-semi text-[clamp(2.6rem,5.6vw,5.4rem)] font-medium leading-[0.95] tracking-[-0.045em]'>
                                    {moment.title}
                                </p>
                                <p className='mt-4 max-w-md text-base leading-relaxed text-white/80 md:text-lg'>
                                    {moment.copy}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className='mt-8 grid grid-cols-4 gap-2 md:max-w-md'>
                        {MOMENTS.map((moment, index) => (
                            <div key={moment.time} className='relative h-0.5 overflow-hidden rounded-full bg-white/25'>
                                <span
                                    className='moment-tick absolute inset-0 origin-left bg-white'
                                    style={index > 0 ? { transform: 'scaleX(0)' } : undefined}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
