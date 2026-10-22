import type { FC, ReactNode } from 'react'

import { Counter } from '@/components/landing/counter'
import { SectionHeading } from '@/components/landing/section-heading'
import { SoundField } from '@/components/landing/sound-field'

const STATS = [
    { value: 40, suffix: ' mm', label: 'Bespoke driver with a beryllium-coated diaphragm' },
    { text: '4 Hz–40 kHz', label: 'Frequency range that reaches beyond human hearing' },
    { value: 24, suffix: '-bit', label: 'Hi-res lossless audio over USB-C at up to 96 kHz' },
    { value: 360, suffix: '°', label: 'Spatial sound with real-time head tracking' }
]

const DriverVisual: FC = (): ReactNode => {
    return (
        <div aria-hidden className='relative mx-auto aspect-square w-full max-w-[520px] text-foreground'>
            {[0, 1, 2, 3].map((ring) => (
                <span
                    key={ring}
                    className='absolute inset-0 rounded-full border border-bronze/50 opacity-0 motion-safe:animate-ripple'
                    style={{ animationDelay: `${ring * 1.2}s` }}
                />
            ))}

            <svg viewBox='0 0 400 400' className='relative size-full'>
                <defs>
                    <radialGradient id='driver-dome' cx='40%' cy='36%' r='70%'>
                        <stop offset='0%' stopColor='#ffffff' />
                        <stop offset='45%' stopColor='#d3d8e0' />
                        <stop offset='100%' stopColor='#848c9a' />
                    </radialGradient>
                    <radialGradient id='driver-cone' cx='50%' cy='50%' r='50%'>
                        <stop offset='20%' stopColor='#f8f9fb' />
                        <stop offset='100%' stopColor='#e2e6ec' />
                    </radialGradient>
                </defs>

                <circle cx='200' cy='200' r='196' fill='none' stroke='currentColor' strokeOpacity='0.14' />

                {Array.from({ length: 72 }, (_, index) => {
                    const angle = (index / 72) * Math.PI * 2
                    const inner = index % 6 === 0 ? 180 : 186

                    return (
                        <line
                            key={index}
                            x1={200 + Math.cos(angle) * inner}
                            y1={200 + Math.sin(angle) * inner}
                            x2={200 + Math.cos(angle) * 192}
                            y2={200 + Math.sin(angle) * 192}
                            stroke='currentColor'
                            strokeOpacity={index % 6 === 0 ? 0.45 : 0.18}
                        />
                    )
                })}

                <circle cx='200' cy='200' r='168' fill='url(#driver-cone)' stroke='currentColor' strokeOpacity='0.12' />
                <circle cx='200' cy='200' r='150' fill='none' stroke='currentColor' strokeOpacity='0.2' strokeWidth='10' strokeDasharray='1 5' />

                {Array.from({ length: 12 }, (_, index) => (
                    <circle
                        key={index}
                        cx='200'
                        cy='200'
                        r={64 + index * 7}
                        fill='none'
                        stroke='currentColor'
                        strokeOpacity={0.05 + (index % 3 === 0 ? 0.06 : 0)}
                    />
                ))}

                <circle cx='200' cy='200' r='56' fill='url(#driver-dome)' />
                <circle cx='200' cy='200' r='56' fill='none' stroke='#b08a4e' strokeWidth='1.5' />
            </svg>

            <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground'>
                40 mm
            </span>
        </div>
    )
}

export const Sound: FC = (): ReactNode => {
    return (
        <section
            id='sound'
            data-nav='sound'
            aria-labelledby='sound-title'
            className='relative overflow-hidden bg-paper py-24 md:py-40'
        >
            <div className='mx-auto max-w-[1600px] px-5 md:px-10'>
                <div className='grid items-center gap-16 lg:grid-cols-12'>
                    <SectionHeading
                        id='sound-title'
                        index='04'
                        eyebrow='Hear it · Immersive sound'
                        title={<>Hear music the way it was meant to be heard.</>}
                        description='A bespoke 40 mm driver with an almost weightless diaphragm delivers bass that is deep and controlled, vocals that sound true and detail so fine it seems to float in the space around you.'
                        className='lg:col-span-6'
                    />

                    <div data-reveal className='lg:col-span-5 lg:col-start-8'>
                        <DriverVisual />
                    </div>
                </div>

                <div data-reveal className='relative mt-20 overflow-hidden rounded-[2rem] border border-foreground/10 bg-background md:mt-28'>
                    <SoundField className='h-[52vh] min-h-[340px] md:h-[62vh]' />

                    <div className='pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 md:p-8'>
                        <div>
                            <p className='font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
                                Spatial audio
                            </p>
                            <p className='mt-2 max-w-xs font-heading stretch-semi text-xl font-medium tracking-[-0.02em] md:text-2xl'>
                                A soundstage that stays fixed as you move.
                            </p>
                        </div>

                        <p className='hidden font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:block'>
                            Head tracking, 1,000 Hz
                        </p>
                    </div>

                    <p className='pointer-events-none absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:bottom-8 md:left-8'>
                        Move across the field to steer the sound
                    </p>
                </div>

                <dl className='mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-foreground/15 pt-10 lg:grid-cols-4'>
                    {STATS.map((stat) => (
                        <div key={stat.label} data-reveal className='flex flex-col gap-3'>
                            <dt className='order-2 max-w-[15rem] text-sm leading-relaxed text-muted-foreground'>
                                {stat.label}
                            </dt>
                            <dd className='order-1 font-heading stretch-semi text-[clamp(2rem,3.4vw,3.2rem)] font-medium leading-none tracking-[-0.04em]'>
                                {typeof stat.value === 'number' ? <Counter value={stat.value} suffix={stat.suffix} /> : stat.text}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    )
}
