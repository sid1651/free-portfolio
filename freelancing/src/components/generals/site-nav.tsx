import type { FC, ReactNode } from 'react'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { gsap, ScrollTrigger } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect'
import { getLenis } from '@/components/generals/smooth-scroll'
import { useSiteReady } from '@/components/generals/ready-provider'
import { Wordmark } from '@/components/generals/wordmark'

import {
    primaryNav,
    overlayNav,
    secondaryNav
} from '@/constants/navigation'

/* ── Plates ──────────────────────────────────────────────────────────── */

type Plate = 'dark' | 'light' | 'accent'

/** Where the bar's own type sits, in px from the top of the viewport. */
const NAV_BASELINE = 42

/** Bar type, accent for the active/rolled link, and the wordmark's hover. */
const PLATE_TEXT: Record<Plate, string> = {
    dark: 'text-bone',
    light: 'text-ink',
    accent: 'text-ink'
}

const PLATE_ACCENT: Record<Plate, string> = {
    dark: 'text-acid',
    light: 'text-acid-dim',
    accent: 'text-bone'
}

const PLATE_MARK: Record<Plate, string> = {
    dark: 'group-hover/mark:text-acid',
    light: 'group-hover/mark:text-acid-dim',
    accent: 'group-hover/mark:text-bone'
}

/**
 * Classify a section from the background it actually paints.
 *
 * The palette is achromatic apart from the accent, so chroma alone separates
 * the accent plate from the greys — which means this keeps working if the
 * accent colour is changed again. Sections that paint nothing return null and
 * leave the bar on whatever plate it last found.
 */
const readPlate = (element: HTMLElement): Plate | null => {
    const parts = getComputedStyle(element)
        .backgroundColor.match(/[\d.]+/g)
        ?.map(Number)

    if (!parts || parts.length < 3) return null

    const [red, green, blue] = parts

    if ((parts[3] ?? 1) < 0.9) return null

    if (Math.max(red, green, blue) - Math.min(red, green, blue) > 40) {
        return 'accent'
    }

    const luma = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255

    return luma > 0.5 ? 'light' : 'dark'
}

/* ── Desktop link with the rolling label swap ────────────────────────── */

interface RollLinkProps {
    label: string
    href: string
    active: boolean
    accent: string
}

const RollLink: FC<RollLinkProps> = ({
    label,
    href,
    active,
    accent
}): ReactNode => {
    return (
        <Link
            href={href}
            data-cursor='link'
            className='group relative block overflow-hidden px-1 py-1 text-[15px] font-bold uppercase leading-none tracking-[-0.01em]'
        >
            <span
                className={cn(
                    'block transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[130%]',
                    active && accent
                )}
            >
                {label}
            </span>

            <span
                aria-hidden='true'
                className={cn(
                    'absolute inset-0 flex translate-y-[130%] items-center px-1 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0',
                    accent
                )}
            >
                {label}
            </span>
        </Link>
    )
}

/* ── Nav ─────────────────────────────────────────────────────────────── */

export const SiteNav: FC = (): ReactNode => {
    const router = useRouter()
    const ready = useSiteReady()
    const [open, setOpen] = useState(false)
    const [plate, setPlate] = useState<Plate>('dark')
    const barRef = useRef<HTMLElement | null>(null)
    const overlayRef = useRef<HTMLDivElement | null>(null)

    /* The open menu paints its own dark panel over everything below it. */
    const surface: Plate = open ? 'dark' : plate

    const isActive = (href: string): boolean => {
        if (href === '/') return router.pathname === '/'
        if (href.startsWith('/#')) return false

        return router.asPath.startsWith(href)
    }

    /* Entry: the bar drops in once the curtain lifts. */
    useIsomorphicLayoutEffect(() => {
        const bar = barRef.current

        if (!bar || !ready) return

        const context = gsap.context(() => {
            gsap.fromTo(
                bar,
                { yPercent: -120, opacity: 0 },
                {
                    yPercent: 0,
                    opacity: 1,
                    duration: 1.1,
                    ease: 'expo.out',
                    delay: 0.15
                }
            )
        }, bar)

        return () => context.revert()
    }, [ready])

    /* Recolour the bar to whatever plate is passing under it. The sections
       alternate between near-black, the accent and the light greys, so a
       single fixed colour is unreadable on at least one of them. */
    useEffect(() => {
        let triggers: ReturnType<typeof ScrollTrigger.create>[] = []

        /* A frame's grace so the incoming page's sections are laid out. */
        const frame = requestAnimationFrame(() => {
            const plates = Array.from(
                document.querySelectorAll<HTMLElement>('section, footer')
            ).flatMap((element) => {
                const value = readPlate(element)

                return value ? [{ element, value }] : []
            })

            /* Sync once up front: a trigger that is already active when it is
               created does not fire, so the first plate would be missed. */
            const current = plates.find(({ element }) => {
                const rect = element.getBoundingClientRect()

                return rect.top <= NAV_BASELINE && rect.bottom > NAV_BASELINE
            })

            if (current) setPlate(current.value)

            triggers = plates.map(({ element, value }) =>
                ScrollTrigger.create({
                    trigger: element,
                    start: `top ${NAV_BASELINE}px`,
                    end: `bottom ${NAV_BASELINE}px`,
                    onToggle: (self) => {
                        if (self.isActive) setPlate(value)
                    }
                })
            )
        })

        return () => {
            cancelAnimationFrame(frame)
            triggers.forEach((trigger) => trigger.kill())
        }
    }, [router.asPath])

    /* Hide going down, reveal coming back up. */
    useEffect(() => {
        const bar = barRef.current

        if (!bar) return

        let last = window.scrollY
        let hidden = false

        const onScroll = () => {
            const current = window.scrollY
            const goingDown = current > last && current > 140

            if (goingDown && !hidden && !open) {
                hidden = true
                gsap.to(bar, { yPercent: -110, duration: 0.6, ease: 'power3.out' })
            }

            if (!goingDown && hidden) {
                hidden = false
                gsap.to(bar, { yPercent: 0, duration: 0.7, ease: 'expo.out' })
            }

            last = current
        }

        window.addEventListener('scroll', onScroll, { passive: true })

        return () => window.removeEventListener('scroll', onScroll)
    }, [open])

    /* Overlay choreography. */
    useIsomorphicLayoutEffect(() => {
        const overlay = overlayRef.current

        if (!overlay) return

        const panel = overlay.querySelector('[data-menu-panel]')
        const items = overlay.querySelectorAll('[data-menu-item]')
        const minor = overlay.querySelectorAll('[data-menu-minor]')
        const meta = overlay.querySelectorAll('[data-menu-meta]')

        const context = gsap.context(() => {
            if (open) {
                gsap.set(overlay, { pointerEvents: 'auto' })

                const timeline = gsap.timeline()

                timeline
                    .set(overlay, { autoAlpha: 1 })
                    .fromTo(
                        panel,
                        { clipPath: 'inset(0% 0% 100% 0%)' },
                        {
                            clipPath: 'inset(0% 0% 0% 0%)',
                            duration: 0.78,
                            ease: 'power4.inOut'
                        }
                    )
                    .fromTo(
                        items,
                        { yPercent: 110, opacity: 0, rotate: 3 },
                        {
                            yPercent: 0,
                            opacity: 1,
                            rotate: 0,
                            duration: 0.95,
                            ease: 'expo.out',
                            stagger: 0.07
                        },
                        '-=0.38'
                    )
                    .fromTo(
                        minor,
                        { y: 20, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.7,
                            ease: 'expo.out',
                            stagger: 0.05
                        },
                        '-=0.6'
                    )
                    .fromTo(
                        meta,
                        { opacity: 0 },
                        { opacity: 1, duration: 0.6, stagger: 0.08 },
                        '-=0.5'
                    )

                return
            }

            const timeline = gsap.timeline({
                onComplete: () => gsap.set(overlay, { pointerEvents: 'none' })
            })

            timeline
                .to(items, {
                    yPercent: -90,
                    opacity: 0,
                    duration: 0.42,
                    ease: 'power3.in',
                    stagger: 0.035
                })
                .to([minor, meta], { opacity: 0, duration: 0.25 }, 0)
                .to(
                    panel,
                    {
                        clipPath: 'inset(0% 0% 100% 0%)',
                        duration: 0.62,
                        ease: 'power4.inOut'
                    },
                    '-=0.18'
                )
                .set(overlay, { autoAlpha: 0 })
        }, overlay)

        return () => context.revert()
    }, [open])

    /* Lock the page while the menu is open. */
    useEffect(() => {
        const lenis = getLenis()

        if (open) {
            lenis?.stop()
            document.body.style.overflow = 'hidden'
        } else {
            lenis?.start()
            document.body.style.overflow = ''
        }

        return () => {
            document.body.style.overflow = ''
        }
    }, [open])

    useEffect(() => {
        const close = () => setOpen(false)

        router.events.on('routeChangeStart', close)

        return () => router.events.off('routeChangeStart', close)
    }, [router])

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false)
        }

        window.addEventListener('keydown', onKey)

        return () => window.removeEventListener('keydown', onKey)
    }, [])

    return (
        <>
            <header
                ref={barRef}
                className={cn(
                    'fixed inset-x-0 top-0 z-[500] edge-x py-[18px] transition-colors duration-500 ease-out md:py-[22px]',
                    PLATE_TEXT[surface]
                )}
            >
                <nav
                    aria-label='Primary'
                    className='flex items-center justify-between'
                >
                    <Link
                        href='/'
                        aria-label='Alchemy — home'
                        data-cursor='link'
                        className='relative z-10'
                    >
                        <Wordmark
                            className='text-current'
                            accent={PLATE_MARK[surface]}
                        />
                    </Link>

                    <div className='hidden items-center gap-7 md:flex'>
                        {primaryNav.map((link) => (
                            <RollLink
                                key={link.href}
                                label={link.label}
                                href={link.href}
                                active={isActive(link.href)}
                                accent={PLATE_ACCENT[surface]}
                            />
                        ))}
                    </div>

                    <button
                        type='button'
                        aria-expanded={open}
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        onClick={() => setOpen((value) => !value)}
                        className='relative z-10 flex size-8 flex-col items-end justify-center gap-[6px] md:hidden'
                    >
                        <span
                            className={cn(
                                'block h-[2px] w-7 bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                                open && 'translate-y-[4px] rotate-45'
                            )}
                        />
                        <span
                            className={cn(
                                'block h-[2px] w-5 bg-current transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                                open && 'w-7 -translate-y-[4px] -rotate-45'
                            )}
                        />
                    </button>
                </nav>
            </header>

            <div
                ref={overlayRef}
                className='invisible fixed inset-0 z-[480] opacity-0 md:hidden'
            >
                <div
                    data-menu-panel
                    className='relative flex h-full w-full flex-col justify-between bg-ink edge-x pb-10 pt-28'
                >
                    <div className='pointer-events-none absolute inset-0 opacity-[0.05] grain-layer' />

                    <div className='relative'>
                        {overlayNav.map((link) => (
                            <div key={link.href} className='overflow-hidden'>
                                <Link
                                    href={link.href}
                                    data-menu-item
                                    onClick={() => setOpen(false)}
                                    className='block py-[2px] text-[13vw] font-bold uppercase leading-[1.06] tracking-[-0.04em] text-bone active:text-acid'
                                >
                                    {link.label}
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className='relative flex flex-col gap-6'>
                        <div className='flex flex-wrap gap-x-6 gap-y-2'>
                            {secondaryNav.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    data-menu-minor
                                    onClick={() => setOpen(false)}
                                    className='text-[22px] font-bold leading-none tracking-[-0.03em] text-dust'
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div
                            data-menu-meta
                            className='flex items-end justify-between border-t border-hairline pt-5'
                        >
                            <span className='label-mono text-dust'>
                                IDX/AK — 2026
                            </span>

                            <span className='label-mono text-acid'>
                                MENU/OPEN
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
