import type { FC, ReactNode } from 'react'

import Image from 'next/image'
import { Feather, Rotate3d, Ruler, Weight } from 'lucide-react'
import { SectionHeading } from '@/components/landing/section-heading'

const FEATURES = [
    { icon: Weight, value: '268 g', label: 'Weight balanced so precisely it vanishes once they settle.' },
    { icon: Ruler, value: '12 stops', label: 'Steel sliders glide out and lock in with a soft, precise click.' },
    { icon: Rotate3d, value: '±30°', label: 'Twin-axis hinges adapt to the unique shape of your head.' },
    { icon: Feather, value: '22 mm', label: 'Slow-rebound memory foam that stays cool for hours.' }
]

const PRESSURE_POINTS = Array.from({ length: 12 }, (_, index) => {
    const angle = (index / 12) * Math.PI * 2

    return {
        x: 100 + Math.cos(angle) * 72,
        y: 120 + Math.sin(angle) * 90,
        delay: index * 0.27
    }
})

const PressureMap: FC = (): ReactNode => {
    return (
        <svg viewBox='0 0 200 240' aria-hidden className='w-full text-foreground'>
            <defs>
                <radialGradient id='pressure-glow' cx='50%' cy='50%' r='50%'>
                    <stop offset='0%' style={{ stopColor: 'var(--bronze)', stopOpacity: 0.6 }} />
                    <stop offset='100%' style={{ stopColor: 'var(--bronze)', stopOpacity: 0 }} />
                </radialGradient>
            </defs>

            {[0, 1, 2, 3, 4].map((ring) => (
                <ellipse
                    key={ring}
                    cx='100'
                    cy='120'
                    rx={92 - ring * 10}
                    ry={112 - ring * 11}
                    fill='none'
                    stroke='currentColor'
                    strokeOpacity={ring === 0 || ring === 4 ? 0.28 : 0.1}
                    strokeWidth='1'
                />
            ))}

            {PRESSURE_POINTS.map((point) => (
                <circle
                    key={`${point.x}-${point.y}`}
                    cx={point.x}
                    cy={point.y}
                    r='20'
                    fill='url(#pressure-glow)'
                    className='motion-safe:animate-breathe'
                    style={{ animationDelay: `${point.delay}s` }}
                />
            ))}

            <ellipse cx='100' cy='120' rx='46' ry='60' fill='none' stroke='currentColor' strokeOpacity='0.16' strokeDasharray='2 4' />
        </svg>
    )
}

export const Comfort: FC = (): ReactNode => {
    return (
        <section
            id='comfort'
            data-nav='design'
            aria-labelledby='comfort-title'
            className='relative overflow-hidden bg-background py-24 md:py-40'
        >
            <div className='mx-auto grid max-w-[1600px] gap-16 px-5 md:px-10 lg:grid-cols-12 lg:gap-8'>
                <div className='relative lg:col-span-6'>
                    <div data-reveal className='relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-paper'>
                        <div data-parallax='7' className='absolute inset-x-0 -inset-y-[9%]'>
                            <Image
                                src='/images/worn-profile.jpg'
                                alt='A woman with short dark hair wearing Arden Halo headphones, eyes closed, in soft window light'
                                fill
                                sizes='(min-width: 1024px) 46vw, 100vw'
                                className='object-cover object-[50%_40%]'
                            />
                        </div>
                    </div>

                    <div
                        data-reveal
                        className='absolute -bottom-10 right-3 w-[58%] max-w-[270px] rounded-3xl border border-border/80 bg-background/85 p-5 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.35)] backdrop-blur-xl sm:right-6 md:-right-6 md:p-6'
                    >
                        <PressureMap />

                        <p className='mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
                            Pressure map
                        </p>
                        <p className='mt-1.5 text-sm leading-snug'>
                            Gentle, even pressure around the entire cushion. No hot spots, ever.
                        </p>
                    </div>
                </div>

                <div className='flex flex-col justify-center pt-6 lg:col-span-5 lg:col-start-8 lg:pt-0'>
                    <SectionHeading
                        id='comfort-title'
                        index='03'
                        eyebrow='Admire it · Comfort'
                        title={<>Comfort you stop noticing.</>}
                        description='We refined the clamping force across more than two thousand fittings, so Arden Halo stays secure on a brisk morning walk yet feels weightless at the end of a twelve-hour flight.'
                    />

                    <ul className='mt-12 grid overflow-hidden rounded-3xl border border-border sm:grid-cols-2'>
                        {FEATURES.map((feature) => (
                            <li
                                key={feature.value}
                                data-reveal
                                className='flex flex-col gap-4 border-border p-6 [&:not(:last-child)]:border-b sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(3)]:border-b-0 md:p-7'
                            >
                                <feature.icon aria-hidden className='size-5 text-bronze' strokeWidth={1.5} />
                                <span className='font-heading stretch-semi text-3xl font-medium tracking-[-0.03em]'>
                                    {feature.value}
                                </span>
                                <span className='text-sm leading-relaxed text-muted-foreground'>
                                    {feature.label}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}
