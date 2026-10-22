import type { FC, KeyboardEvent, ReactNode } from 'react'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { NoiseWave } from '@/components/landing/noise-wave'
import { SectionHeading } from '@/components/landing/section-heading'

type SceneId = 'flight' | 'cafe'

interface Mode {
    id: string
    label: string
    title: string
    copy: string
    facts: string[]
    outside: number
    heard: number
    level: number
    scene: SceneId
    blur: number
}

const MODES: Mode[] = [
    {
        id: 'cancelling',
        label: 'Noise cancelling',
        title: 'Silence, on demand.',
        copy: 'Eight outward-facing microphones listen 50,000 times every second and cancel what they hear before it reaches you. Jet engines, rumbling trains and office chatter simply melt away.',
        facts: ['Up to 42 dB of reduction', 'Eight microphones for silence', 'Wind noise suppression'],
        outside: 78,
        heard: 34,
        level: 0.06,
        scene: 'flight',
        blur: 1
    },
    {
        id: 'adaptive',
        label: 'Adaptive',
        title: 'Exactly the right amount.',
        copy: 'Arden Halo listens to your surroundings constantly, letting important announcements and alarms through while the cabin drone stays out. It adapts so smoothly you never notice.',
        facts: ['Retunes every 5 milliseconds', 'Lets alerts and announcements in', 'Automatic travel profile'],
        outside: 74,
        heard: 49,
        level: 0.36,
        scene: 'flight',
        blur: 0.45
    },
    {
        id: 'transparency',
        label: 'Transparency',
        title: 'Open to the world.',
        copy: 'Voices sound as natural as if you had nothing on. Start a conversation and your music softens automatically, then returns the moment you are done talking.',
        facts: ['Conversation awareness', 'Natural, open voice pickup', 'Your own voice, heard clearly'],
        outside: 66,
        heard: 63,
        level: 0.9,
        scene: 'cafe',
        blur: 0
    }
]

const SCENES: Array<{ id: SceneId; image: string; alt: string; position: string; focus: string }> = [
    {
        id: 'flight',
        image: '/images/lifestyle-flight.jpg',
        alt: 'A woman resting by the window of a plane, wearing Arden Halo with noise cancelling on',
        position: '66% 40%',
        focus: '66% 38%'
    },
    {
        id: 'cafe',
        image: '/images/lifestyle-cafe.jpg',
        alt: 'A man laughing with a barista in a busy cafe while wearing Arden Halo',
        position: '30% 40%',
        focus: '30% 38%'
    }
]

const AUTOPLAY_MS = 7000

const Meter: FC<{ label: string; value: number; tone: 'muted' | 'bronze' }> = ({ label, value, tone }): ReactNode => {
    return (
        <div className='mt-4'>
            <div className='flex items-baseline justify-between'>
                <span className='text-xs text-muted-foreground'>
                    {label}
                </span>
                <span className='font-heading stretch-semi text-lg font-medium tabular-nums tracking-[-0.02em]'>
                    {value} dB
                </span>
            </div>

            <div className='mt-2 h-1 overflow-hidden rounded-full bg-foreground/10'>
                <div
                    className={cn('h-full origin-left rounded-full transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]', tone === 'bronze' ? 'bg-bronze' : 'bg-foreground/45')}
                    style={{ transform: `scaleX(${(value / 90).toFixed(3)})` }}
                />
            </div>
        </div>
    )
}

export const NoiseControl: FC = (): ReactNode => {
    const sectionRef = useRef<HTMLElement>(null)
    const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
    const [activeIndex, setActiveIndex] = useState(0)
    const [autoplay, setAutoplay] = useState(true)
    const [inView, setInView] = useState(false)
    const active = MODES[activeIndex]

    useEffect(() => {
        const section = sectionRef.current

        if (!section) return

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setAutoplay(false)

        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 })

        observer.observe(section)

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!autoplay || !inView) return

        const timer = window.setTimeout(() => {
            setActiveIndex((index) => (index + 1) % MODES.length)
        }, AUTOPLAY_MS)

        return () => window.clearTimeout(timer)
    }, [autoplay, inView, activeIndex])

    const select = (index: number, focus = false): void => {
        setAutoplay(false)
        setActiveIndex(index)

        if (focus) tabRefs.current[index]?.focus()
    }

    const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number): void => {
        const last = MODES.length - 1
        let next = -1

        if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
        if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
        if (event.key === 'Home') next = 0
        if (event.key === 'End') next = last

        if (next < 0) return

        event.preventDefault()
        select(next, true)
    }

    return (
        <section
            id='noise-control'
            ref={sectionRef}
            data-nav='noise-control'
            aria-labelledby='noise-title'
            className='relative bg-background py-24 md:py-40'
        >
            <div className='mx-auto max-w-[1600px] px-5 md:px-10'>
                <div className='flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between'>
                    <SectionHeading
                        id='noise-title'
                        index='05'
                        eyebrow='Hear it · Noise control'
                        title={<>You decide how much of the world comes through.</>}
                        className='lg:max-w-3xl'
                    />

                    <div
                        data-reveal
                        role='tablist'
                        aria-label='Listening modes'
                        className='no-scrollbar flex w-full overflow-x-auto rounded-full border border-border bg-paper p-1 sm:w-auto'
                    >
                        {MODES.map((mode, index) => {
                            const selected = index === activeIndex

                            return (
                                <button
                                    key={mode.id}
                                    ref={(element) => {
                                        tabRefs.current[index] = element
                                    }}
                                    id={`mode-tab-${mode.id}`}
                                    type='button'
                                    role='tab'
                                    aria-selected={selected}
                                    aria-controls='mode-panel'
                                    tabIndex={selected ? 0 : -1}
                                    onClick={() => select(index)}
                                    onKeyDown={(event) => onTabKeyDown(event, index)}
                                    className={cn(
                                        'relative flex-1 overflow-hidden whitespace-nowrap rounded-full px-4 py-2.5 text-sm transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-none sm:px-6',
                                        selected ? 'bg-foreground text-background' : 'text-foreground/70 hover:text-foreground'
                                    )}
                                >
                                    {mode.label}

                                    {selected && autoplay && inView && (
                                        <span
                                            key={`${mode.id}-${activeIndex}`}
                                            aria-hidden
                                            className='absolute inset-x-5 bottom-1 h-px origin-left bg-background/60 motion-safe:animate-progress'
                                        />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className='mt-12 grid gap-5 lg:grid-cols-12 lg:gap-6'>
                    <div data-reveal className='relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-paper sm:aspect-[16/11] lg:col-span-8 lg:aspect-auto lg:min-h-[640px]'>
                        {SCENES.map((scene) => {
                            const visible = scene.id === active.scene

                            return (
                                <div
                                    key={scene.id}
                                    aria-hidden={!visible}
                                    className={cn('absolute inset-0 transition-opacity duration-1000 ease-out', visible ? 'opacity-100' : 'opacity-0')}
                                >
                                    <Image
                                        src={scene.image}
                                        alt={scene.alt}
                                        fill
                                        sizes='(min-width: 1024px) 64vw, 100vw'
                                        className='object-cover'
                                        style={{ objectPosition: scene.position }}
                                    />

                                    {scene.id === 'flight' && (
                                        <div
                                            aria-hidden
                                            className='absolute inset-0 transition-opacity duration-1000 ease-out'
                                            style={{
                                                opacity: active.scene === 'flight' ? active.blur : 0,
                                                maskImage: `radial-gradient(ellipse 30% 44% at ${scene.focus}, transparent 45%, black 100%)`,
                                                WebkitMaskImage: `radial-gradient(ellipse 30% 44% at ${scene.focus}, transparent 45%, black 100%)`
                                            }}
                                        >
                                            <Image
                                                src={scene.image}
                                                alt=''
                                                fill
                                                sizes='(min-width: 1024px) 64vw, 100vw'
                                                className='scale-105 object-cover blur-[14px] saturate-[0.55]'
                                                style={{ objectPosition: scene.position }}
                                            />
                                            <div className='absolute inset-0 bg-background/15' />
                                        </div>
                                    )}

                                    {scene.id === 'cafe' && (
                                        <div aria-hidden className='absolute left-[90%] top-[32%] size-40 -translate-x-1/2 -translate-y-1/2'>
                                            {[0, 1, 2].map((ring) => (
                                                <span
                                                    key={ring}
                                                    className='absolute inset-0 rounded-full border border-white/70 opacity-0 motion-safe:animate-ripple'
                                                    style={{ animationDelay: `${ring * 1.4}s` }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                        <div className='absolute inset-x-4 bottom-4 rounded-2xl border border-white/50 bg-background/75 p-4 shadow-[0_20px_50px_-25px_rgb(0_0_0/0.45)] backdrop-blur-xl sm:inset-x-auto sm:left-6 sm:w-[320px] md:bottom-6 md:p-5'>
                            <div className='flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground'>
                                <span>Live level</span>
                                <span className='flex items-center gap-2 text-foreground'>
                                    <span className='size-1.5 rounded-full bg-bronze motion-safe:animate-breathe' />
                                    {active.label}
                                </span>
                            </div>

                            <Meter label='Outside' value={active.outside} tone='muted' />
                            <Meter label='What reaches you' value={active.heard} tone='bronze' />
                        </div>
                    </div>

                    <div
                        id='mode-panel'
                        role='tabpanel'
                        aria-labelledby={`mode-tab-${active.id}`}
                        className='flex flex-col justify-between gap-10 rounded-[2rem] border border-border p-6 md:p-10 lg:col-span-4'
                    >
                        <div key={active.id} className='motion-safe:animate-fade-up'>
                            <p className='font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
                                Mode {String(activeIndex + 1).padStart(2, '0')} / {String(MODES.length).padStart(2, '0')}
                            </p>

                            <h3 className='mt-5 font-heading stretch-semi text-[clamp(2rem,3vw,2.8rem)] font-medium leading-[1] tracking-[-0.035em]'>
                                {active.title}
                            </h3>

                            <p className='mt-5 leading-relaxed text-muted-foreground'>
                                {active.copy}
                            </p>

                            <ul className='mt-8 flex flex-col divide-y divide-border border-y border-border'>
                                {active.facts.map((fact) => (
                                    <li key={fact} className='flex items-center gap-3 py-3 text-sm'>
                                        <span aria-hidden className='size-1.5 rounded-full bg-bronze' />
                                        {fact}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <NoiseWave level={active.level} />

                            <div className='mt-3 flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground'>
                                <span className='flex items-center gap-2'>
                                    <span aria-hidden className='h-px w-5 bg-foreground/40' />
                                    Outside
                                </span>
                                <span className='flex items-center gap-2'>
                                    <span aria-hidden className='h-0.5 w-5 bg-bronze' />
                                    What you hear
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
