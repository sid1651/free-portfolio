import type { FC, ReactNode } from 'react'

import Image from 'next/image'
import { useState } from 'react'
import {
    Bluetooth,
    LocateFixed,
    MessageCircle,
    MonitorSmartphone,
    Orbit,
    SlidersHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Eyebrow, SectionHeading } from '@/components/landing/section-heading'

type HotspotId = 'crown' | 'button' | 'light' | 'port'

const HOTSPOTS: Record<HotspotId, { x: number; y: number }> = {
    crown: { x: 41, y: 30 },
    button: { x: 54.6, y: 52.3 },
    light: { x: 59.9, y: 66.3 },
    port: { x: 66.7, y: 64.5 }
}

const GESTURES: Array<{ id: string; hotspot: HotspotId; action: string; result: string }> = [
    { id: 'turn', hotspot: 'crown', action: 'Turn the crown', result: 'Adjust the volume in fine, weighted steps.' },
    { id: 'press', hotspot: 'crown', action: 'Press the crown', result: 'Play, pause or answer a call. Press twice to skip ahead.' },
    { id: 'hold', hotspot: 'crown', action: 'Press and hold', result: 'Talk to your voice assistant without reaching for your phone.' },
    { id: 'mode', hotspot: 'button', action: 'Press the mode button', result: 'Move between noise cancelling, adaptive and transparency.' },
    { id: 'lift', hotspot: 'light', action: 'Lift an earcup', result: 'Music pauses, then carries on the moment you put it back.' },
    { id: 'plug', hotspot: 'port', action: 'Plug in USB-C', result: 'Charge and listen in lossless 24-bit at the same time.' }
]

const CONNECTIVITY = [
    { icon: MonitorSmartphone, title: 'Multipoint', copy: 'Connected to your laptop and phone together, switching instantly when a call comes in.' },
    { icon: Bluetooth, title: 'Bluetooth 6.0', copy: 'Lower latency, longer range and full support for LE Audio and Auracast.' },
    { icon: Orbit, title: 'Spatial audio', copy: 'Head-tracked audio that stays anchored to your screen as you move.' },
    { icon: MessageCircle, title: 'Conversation awareness', copy: 'Start talking and your music dims while voices come forward.' },
    { icon: SlidersHorizontal, title: 'The Arden app', copy: 'Adjust the EQ, customise the controls and receive updates quietly in the background.' },
    { icon: LocateFixed, title: 'Find your Halo', copy: 'See where you last left them and play a sound to locate them.' }
]

export const Controls: FC = (): ReactNode => {
    const [activeIndex, setActiveIndex] = useState(0)
    const active = GESTURES[activeIndex]

    return (
        <section
            id='controls'
            data-nav='features'
            aria-labelledby='controls-title'
            className='relative bg-paper py-24 md:py-40'
        >
            <div className='mx-auto max-w-[1600px] px-5 md:px-10'>
                <div className='grid gap-14 lg:grid-cols-12 lg:gap-8'>
                    <div className='lg:col-span-6'>
                        <div data-reveal className='relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-background lg:sticky lg:top-28'>
                            <Image
                                src='/images/closeup-controls.jpg'
                                alt='Macro view of the knurled steel crown, mode button, status light and USB-C port on the right earcup'
                                fill
                                sizes='(min-width: 1024px) 46vw, 100vw'
                                className='object-cover'
                            />

                            {(Object.keys(HOTSPOTS) as HotspotId[]).map((id) => {
                                const spot = HOTSPOTS[id]
                                const isActive = active.hotspot === id

                                return (
                                    <span
                                        key={id}
                                        aria-hidden
                                        className='absolute'
                                        style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                                    >
                                        <span
                                            className={cn(
                                                'absolute -left-6 -top-6 block size-12 rounded-full border border-white/90 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]',
                                                isActive ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                                            )}
                                        />
                                        {isActive && (
                                            <span className='absolute -left-6 -top-6 block size-12 rounded-full border border-white/70 motion-safe:animate-ping-soft' />
                                        )}
                                        <span
                                            className={cn(
                                                'absolute -left-[7px] -top-[7px] block size-3.5 rounded-full border-2 border-white shadow-[0_2px_10px_rgb(0_0_0/0.35)] transition-colors duration-300',
                                                isActive ? 'bg-bronze' : 'bg-white/40'
                                            )}
                                        />
                                    </span>
                                )
                            })}

                            <div className='absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-2xl border border-white/50 bg-background/80 px-5 py-4 backdrop-blur-xl md:inset-x-6 md:bottom-6'>
                                <p className='font-heading stretch-semi text-lg font-medium tracking-[-0.02em]'>
                                    {active.action}
                                </p>
                                <p className='font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground'>
                                    {String(activeIndex + 1).padStart(2, '0')} / {String(GESTURES.length).padStart(2, '0')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='lg:col-span-5 lg:col-start-8'>
                        <SectionHeading
                            id='controls-title'
                            index='07'
                            eyebrow='Live with it · Controls'
                            title={<>Intuitive by touch.</>}
                            description='No hidden touch panels to guess at. A precision crown and one button handle everything, so your fingers find them without a second thought.'
                        />

                        <ul data-reveal className='mt-12 border-t border-foreground/15'>
                            {GESTURES.map((gesture, index) => {
                                const isActive = index === activeIndex

                                return (
                                    <li key={gesture.id}>
                                        <button
                                            type='button'
                                            aria-pressed={isActive}
                                            onClick={() => setActiveIndex(index)}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            onFocus={() => setActiveIndex(index)}
                                            className='group flex w-full items-start gap-5 border-b border-foreground/15 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring'
                                        >
                                            <span className={cn('pt-1.5 font-mono text-[10px] tracking-[0.2em] transition-colors', isActive ? 'text-bronze' : 'text-muted-foreground')}>
                                                {String(index + 1).padStart(2, '0')}
                                            </span>

                                            <span className='flex-1'>
                                                <span className={cn('block font-heading stretch-semi text-xl font-medium tracking-[-0.02em] transition-colors duration-300 md:text-2xl', isActive ? 'text-foreground' : 'text-foreground/55 group-hover:text-foreground/80')}>
                                                    {gesture.action}
                                                </span>
                                                <span className={cn('mt-1.5 block text-sm leading-relaxed transition-colors duration-300', isActive ? 'text-muted-foreground' : 'text-muted-foreground/70')}>
                                                    {gesture.result}
                                                </span>
                                            </span>

                                            <span
                                                aria-hidden
                                                className={cn('mt-2.5 block size-2 rounded-full transition-[background-color,transform] duration-300', isActive ? 'scale-100 bg-bronze' : 'scale-50 bg-foreground/25')}
                                            />
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>

                <div className='mt-24 md:mt-36'>
                    <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
                        <div className='flex flex-col gap-6'>
                            <div data-reveal>
                                <Eyebrow index='07.1' label='Connectivity' />
                            </div>
                            <h3 data-reveal className='max-w-2xl font-heading stretch-semi text-[clamp(2rem,3.6vw,3.4rem)] font-medium leading-[1] tracking-[-0.04em]'>
                                Works seamlessly with every device you own.
                            </h3>
                        </div>
                    </div>

                    <ul data-reveal className='mt-12 grid gap-px overflow-hidden rounded-[2rem] border border-foreground/10 bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3'>
                        {CONNECTIVITY.map((item) => (
                            <li key={item.title} className='flex flex-col gap-5 bg-paper p-7 md:p-9'>
                                <item.icon aria-hidden className='size-5 text-bronze' strokeWidth={1.5} />
                                <div>
                                    <p className='font-heading stretch-semi text-xl font-medium tracking-[-0.02em]'>
                                        {item.title}
                                    </p>
                                    <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                                        {item.copy}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}
