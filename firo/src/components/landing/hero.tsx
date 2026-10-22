import type { FC, ReactNode } from 'react'

import Image from 'next/image'
import { ArrowDown } from 'lucide-react'
import { useRef } from 'react'
import { gsap, isFinePointer, prefersReducedMotion, useGSAP } from '@/lib/motion/gsap'
import { useIntro } from '@/hooks/use-intro'
import { RecLabel, Viewfinder } from '@/components/generals/viewfinder'
import { SplitWords } from '@/components/generals/split-words'
import { Timecode } from '@/components/generals/timecode'
import { heroContent } from '@/constants/content'
import { brandAvatars, media } from '@/constants/media'
import { siteConfig } from '@/constants/site'

const scatterCards = [
    { image: media.resultShirt, x: '14%', y: '24%', r: -8, label: 'Campaign' },
    { image: media.brandWhiteCoat, x: '84%', y: '20%', r: 6, label: 'Editorial' },
    { image: media.showcaseMotionOrange, x: '8%', y: '68%', r: 5, label: 'Motion' },
    { image: media.brandSunglasses, x: '90%', y: '66%', r: -6, label: 'Product' },
    { image: media.redLips, x: '28%', y: '86%', r: 4, label: 'Beauty' },
    { image: media.showcaseCheers, x: '72%', y: '86%', r: -4, label: 'Social' }
]

const lineClass = 'block font-wide text-[clamp(2.6rem,12vw,17rem)] font-semibold uppercase leading-[0.8] tracking-[-0.055em]'

export const Hero: FC = (): ReactNode => {
    const scope = useRef<HTMLElement>(null)

    useIntro(scope, (timeline, root) => {
        const words = root.querySelectorAll('[data-hero-line] [data-word]')
        const frame = root.querySelector('[data-hero-frame]')
        const frameMedia = root.querySelector('[data-hero-frame-media]')
        const meta = root.querySelectorAll('[data-hero-meta]')
        const hud = root.querySelectorAll('[data-hero-hud]')

        const rows = root.querySelectorAll('[data-hero-row-inner]')
        const bloom = root.querySelector('[data-hero-bloom]')
        const badge = root.querySelector('[data-hero-badge]')

        timeline
            .from(bloom, { scale: 0.4, autoAlpha: 0, duration: 2.4, ease: 'expo.out' }, 0)
            .fromTo(frame, { clipPath: 'inset(50% 0% 50% 0%)', rotate: -6 }, { clipPath: 'inset(0% 0% 0% 0%)', rotate: 0, duration: 1.6, ease: 'expo.inOut' }, 0)
            .from(frameMedia, { scale: 1.45, duration: 2.2 }, 0.2)
            .from(rows, { xPercent: (index: number) => (index % 2 === 0 ? -14 : 14), duration: 1.8, stagger: 0.08 }, 0.3)
            .from(words, { yPercent: 120, rotate: 6, duration: 1.4, stagger: 0.1 }, 0.35)
            .from(hud, { autoAlpha: 0, duration: 0.8, stagger: 0.06, ease: 'power2.out' }, 1.1)
            .from(meta, { autoAlpha: 0, y: 24, duration: 1.2, stagger: 0.08 }, 0.9)
            .from(badge, { scale: 0, rotate: -120, duration: 1.4, ease: 'back.out(1.6)' }, 1.2)
    })

    useGSAP(() => {
        const root = scope.current
        if (!root || !isFinePointer() || prefersReducedMotion()) return

        const tilt = root.querySelector('[data-hero-tilt]')
        const text = root.querySelector('[data-hero-pointer-text]')
        const bloom = root.querySelector('[data-hero-bloom-move]')
        if (!tilt || !text || !bloom) return

        const tiltX = gsap.quickTo(tilt, 'rotationY', { duration: 1.2, ease: 'expo.out' })
        const tiltY = gsap.quickTo(tilt, 'rotationX', { duration: 1.2, ease: 'expo.out' })
        const moveTiltX = gsap.quickTo(tilt, 'x', { duration: 1.2, ease: 'expo.out' })
        const moveTiltY = gsap.quickTo(tilt, 'y', { duration: 1.2, ease: 'expo.out' })
        const moveTextX = gsap.quickTo(text, 'x', { duration: 1.6, ease: 'expo.out' })
        const moveBloomX = gsap.quickTo(bloom, 'x', { duration: 2.4, ease: 'expo.out' })
        const moveBloomY = gsap.quickTo(bloom, 'y', { duration: 2.4, ease: 'expo.out' })

        gsap.set(tilt, { transformPerspective: 900 })

        const handleMove = (event: PointerEvent): void => {
            const bounds = root.getBoundingClientRect()
            const x = (event.clientX - bounds.left) / bounds.width - 0.5
            const y = (event.clientY - bounds.top) / bounds.height - 0.5

            tiltX(x * 14)
            tiltY(y * -10)
            moveTiltX(x * 40)
            moveTiltY(y * 30)
            moveTextX(x * -30)
            moveBloomX(x * 160)
            moveBloomY(y * 120)
        }

        const handleLeave = (): void => {
            tiltX(0)
            tiltY(0)
            moveTiltX(0)
            moveTiltY(0)
            moveTextX(0)
            moveBloomX(0)
            moveBloomY(0)
        }

        root.addEventListener('pointermove', handleMove)
        root.addEventListener('pointerleave', handleLeave)

        return () => {
            root.removeEventListener('pointermove', handleMove)
            root.removeEventListener('pointerleave', handleLeave)
        }
    }, { scope })

    useGSAP(() => {
        const root = scope.current
        if (!root) return

        const mm = gsap.matchMedia()

        mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
            const timeline = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: { trigger: root, start: 'top top', end: '+=110%', scrub: 1, pin: true, anticipatePin: 1 }
            })

            timeline
                .to('[data-hero-row="1"]', { xPercent: -14 }, 0)
                .to('[data-hero-row="2"]', { xPercent: 10 }, 0)
                .to('[data-hero-row="3"]', { xPercent: 16 }, 0)
                .to('[data-hero-fade]', { autoAlpha: 0, y: -40, duration: 0.5 }, 0)
                .to('[data-hero-frame-wrap]', { scale: 1.15 }, 0)
                .fromTo(
                    '[data-hero-card]',
                    { left: '50%', top: '50%', scale: 0.3, rotate: 0, autoAlpha: 0 },
                    {
                        left: (_: number, el: HTMLElement) => el.dataset.x ?? '50%',
                        top: (_: number, el: HTMLElement) => el.dataset.y ?? '50%',
                        scale: 1,
                        rotate: (_: number, el: HTMLElement) => Number(el.dataset.r ?? 0),
                        autoAlpha: 1,
                        ease: 'power3.out',
                        stagger: 0.04
                    },
                    0.1
                )
                .fromTo('[data-hero-caption]', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.6)
        })

        return () => mm.revert()
    }, { scope })

    return (
        <section
            ref={scope}
            id='hero'
            aria-label='NOVAIR Studio introduction'
            className='relative flex min-h-[100svh] flex-col overflow-hidden bg-ink pb-8 pt-24 text-bone md:pt-28'
        >
            <div className='pointer-events-none absolute left-1/2 top-1/2 size-[110vw] -translate-x-1/2 -translate-y-1/2 md:size-[70vw]' data-hero-bloom-move='' aria-hidden='true'>
                <div className='size-full' data-hero-bloom=''>
                    <div className='nova-bloom bloom-breathe size-full opacity-[0.22]' />
                </div>
            </div>

            <div className='relative z-10' data-hero-fade=''>
                <div className='gutter grid grid-cols-2 items-start gap-4 md:grid-cols-3' data-intro=''>
                    <div data-hero-meta=''>
                        <RecLabel label={heroContent.eyebrow} className='text-bone' />
                    </div>

                    <p className='eyebrow hidden text-center text-stone md:block' data-hero-meta=''>
                        {heroContent.kicker}
                    </p>

                    <p className='eyebrow text-right text-stone' data-hero-meta=''>
                        Est. {siteConfig.founded} / Amsterdam
                    </p>
                </div>
            </div>

            <div className='relative flex flex-1 items-center py-10 md:py-6'>
                <div className='pointer-events-none absolute inset-0 hidden md:block' aria-hidden='true'>
                    {scatterCards.map(card => (
                        <figure
                            key={card.image.src}
                            className='pointer-events-auto invisible absolute left-1/2 top-1/2 flex w-[9vw] min-w-28 -translate-x-1/2 -translate-y-1/2 flex-col gap-2 opacity-0'
                            data-hero-card=''
                            data-x={card.x}
                            data-y={card.y}
                            data-r={card.r}
                        >
                            <div className='relative aspect-[3/4] overflow-hidden bg-ink-raised shadow-2xl shadow-black/60'>
                                <Image src={card.image.src} alt='' fill sizes='12vw' className='object-cover' />
                                <Viewfinder size='sm' className='inset-2' />
                            </div>
                            <figcaption className='eyebrow flex justify-between text-[0.55rem] text-stone'>
                                <span>{card.label}</span>
                                <span className='text-flare'>AI</span>
                            </figcaption>
                        </figure>
                    ))}

                    <p className='invisible absolute inset-x-0 bottom-4 text-center opacity-0' data-hero-caption=''>
                        <span className='eyebrow text-stone'>One brief / </span>
                        <span className='font-serif text-2xl italic text-bone'>every frame, directed by people.</span>
                    </p>
                </div>

                <div
                    className='absolute left-1/2 top-1/2 z-0 w-[min(48vw,17rem)] -translate-x-1/2 -translate-y-1/2 md:w-[clamp(14rem,22vw,24rem)]'
                    data-hero-frame-wrap=''
                >
                    <div data-hero-tilt=''>
                        <div className='relative aspect-[9/16] overflow-hidden bg-ink-raised' data-intro='' data-hero-frame=''>
                        <div className='absolute inset-0' data-hero-frame-media=''>
                            <Image
                                src='/images/hero-portrait-hd.png'
                                alt='Portrait of a woman with a fringe, her face crossed by warm motion blur streaks'
                                fill
                                preload
                                sizes='(min-width: 768px) 28vw, 60vw'
                                className='object-cover object-[50%_35%]'
                            />
                        </div>

                        <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/25 via-transparent to-ink/35' aria-hidden='true' />

                        <Viewfinder />

                        <div className='eyebrow absolute inset-x-6 top-6 z-10 flex justify-between text-[0.6rem] text-bone/90' data-hero-hud=''>
                            <Timecode />
                            <span>4K / 24</span>
                        </div>

                        <div className='eyebrow absolute inset-x-6 bottom-6 z-10 flex justify-between text-[0.6rem] text-bone/90' data-hero-hud=''>
                            <span>Cam A</span>
                            <span>9:16</span>
                        </div>

                        <span className='scan-line pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-flare/80 shadow-[0_0_12px_2px_rgba(255,107,43,0.5)]' aria-hidden='true' />
                        </div>
                    </div>
                </div>

                <h1 className='gutter relative z-10 w-full text-white mix-blend-difference' data-intro='' data-hero-line='' data-hero-pointer-text=''>
                    <span className={lineClass} data-hero-row='1'>
                        <span className='block' data-hero-row-inner=''>
                            <SplitWords text={heroContent.lines[0]} />
                        </span>
                    </span>

                    <span className='block text-right' data-hero-row='2'>
                        <span className='inline-block' data-hero-row-inner=''>
                            <SplitWords
                                text={heroContent.lines[1]}
                                className='inline-block pr-[2vw] font-serif text-[clamp(3rem,13.5vw,19rem)] font-normal italic leading-[0.86] tracking-[-0.03em]'
                            />
                        </span>
                    </span>

                    <span className={`${lineClass} pl-[8vw]`} data-hero-row='3'>
                        <span className='block' data-hero-row-inner=''>
                            <SplitWords text={heroContent.lines[2]} />
                        </span>
                    </span>
                </h1>
            </div>

            <div className='relative z-10' data-hero-fade=''>
                <div className='gutter grid gap-8 md:grid-cols-12 md:items-end' data-intro=''>
                    <p className='max-w-sm text-base leading-relaxed text-bone/80 md:col-span-5 md:text-lg' data-hero-meta=''>
                        {heroContent.description}
                    </p>

                    <div className='flex items-center gap-4 md:col-span-4 md:col-start-7' data-hero-meta=''>
                        <div className='flex -space-x-3'>
                            {brandAvatars.map(avatar => (
                                <span key={avatar.src} className='relative size-10 overflow-hidden rounded-full border-2 border-ink md:size-11'>
                                    <Image src={avatar.src} alt={avatar.alt} fill sizes='44px' className='object-cover' />
                                </span>
                            ))}
                        </div>

                        <div className='flex flex-col'>
                            <span className='text-sm font-medium'>
                                {heroContent.badge}
                            </span>
                            <span className='eyebrow text-stone'>
                                Trusted by modern brands
                            </span>
                        </div>
                    </div>

                    <a
                        href='#manifesto'
                        className='group hidden items-center justify-end gap-3 text-sm md:col-span-2 md:flex'
                        data-hero-meta=''
                    >
                        <span className='sr-only'>Scroll to explore</span>
                        <span className='relative flex size-24 items-center justify-center' data-hero-badge='' aria-hidden='true'>
                            <svg viewBox='0 0 100 100' className='spin-slow absolute inset-0 size-full text-stone transition-colors group-hover:text-bone'>
                                <defs>
                                    <path id='hero-badge-circle' d='M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0' />
                                </defs>
                                <text className='fill-current font-mono text-[9.5px] uppercase tracking-[0.32em]'>
                                    <textPath href='#hero-badge-circle'>Scroll to explore / Novair Studio /</textPath>
                                </text>
                            </svg>
                            <span className='flex size-10 items-center justify-center rounded-full border border-bone/30 transition-colors group-hover:border-flare group-hover:bg-flare group-hover:text-ink'>
                                <ArrowDown className='size-4' />
                            </span>
                        </span>
                    </a>
                </div>
            </div>
        </section>
    )
}
