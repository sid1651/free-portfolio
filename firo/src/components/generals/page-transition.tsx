import type { FC, ReactNode } from 'react'

import { useRouter } from 'next/router'

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef
} from 'react'

import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion/gsap'
import { scrollToTop, startScroll, stopScroll } from '@/lib/motion/lenis'
import { transitionState } from '@/lib/motion/transition'
import { LogoMark } from '@/components/generals/logo'

type PageTransitionContextValue = {
    navigate: (href: string) => void
}

const PageTransitionContext = createContext<PageTransitionContextValue>({
    navigate: () => undefined
})

export const usePageTransition = (): PageTransitionContextValue => useContext(PageTransitionContext)

interface PageTransitionProviderProps {
    children: ReactNode
}

/**
 * Covers the screen with two panels between pages, swaps the route underneath,
 * then lifts the panels so the incoming page can play its own intro.
 */
export const PageTransitionProvider: FC<PageTransitionProviderProps> = ({ children }): ReactNode => {
    const router = useRouter()
    const overlayRef = useRef<HTMLDivElement>(null)
    const busyRef = useRef(false)

    const lift = useCallback((): void => {
        const overlay = overlayRef.current

        const finish = (): void => {
            busyRef.current = false
            transitionState.active = false
            startScroll()
        }

        if (!overlay) {
            finish()
            return
        }

        const panels = overlay.querySelectorAll('[data-panel]')
        const mark = overlay.querySelector('[data-mark]')

        gsap.timeline({
            onComplete: () => {
                gsap.set(overlay, { visibility: 'hidden' })
                finish()
            }
        })
            .to(mark, { autoAlpha: 0, y: -24, duration: 0.4, ease: 'power2.in' })
            .to(panels, { yPercent: -100, duration: 1, ease: 'expo.inOut', stagger: { each: 0.08, from: 'end' } }, 0.1)

        startScroll()
        requestAnimationFrame(() => ScrollTrigger.refresh())
    }, [])

    const navigate = useCallback((href: string): void => {
        if (busyRef.current) return

        const overlay = overlayRef.current

        if (!overlay || prefersReducedMotion()) {
            router.push(href).then(() => scrollToTop()).catch(() => undefined)
            return
        }

        busyRef.current = true
        transitionState.active = true
        stopScroll()

        const panels = overlay.querySelectorAll('[data-panel]')
        const mark = overlay.querySelector('[data-mark]')

        gsap.set(overlay, { visibility: 'visible' })
        gsap.set(panels, { yPercent: 100 })
        gsap.set(mark, { autoAlpha: 0, y: 24 })

        gsap.timeline({
            onComplete: () => {
                router.push(href, undefined, { scroll: false })
                    .then(() => {
                        scrollToTop()
                        lift()
                    })
                    .catch(() => lift())
            }
        })
            .to(panels, { yPercent: 0, duration: 0.85, ease: 'expo.inOut', stagger: 0.08 })
            .to(mark, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'expo.out' }, 0.45)
    }, [lift, router])

    useEffect(() => {
        const handleComplete = (): void => {
            if (busyRef.current) return
            requestAnimationFrame(() => ScrollTrigger.refresh())
        }

        router.events.on('routeChangeComplete', handleComplete)
        return () => router.events.off('routeChangeComplete', handleComplete)
    }, [router.events])

    const value = useMemo(() => ({ navigate }), [navigate])

    return (
        <PageTransitionContext.Provider value={value}>
            {children}

            <div
                ref={overlayRef}
                className='pointer-events-none invisible fixed inset-0 z-[200]'
                aria-hidden='true'
            >
                <div data-panel='' className='absolute inset-0 bg-flare' />
                <div data-panel='' className='absolute inset-0 bg-ink' />

                <div data-mark='' className='absolute inset-0 flex flex-col items-center justify-center gap-5 text-bone opacity-0'>
                    <LogoMark className='size-12 text-flare' />

                    <span className='eyebrow text-stone'>
                        Novair Studio
                    </span>
                </div>
            </div>
        </PageTransitionContext.Provider>
    )
}
