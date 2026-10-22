import type { FC, ReactNode } from 'react'

import Lenis from 'lenis'
import { useEffect } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion/gsap'
import { setLenis } from '@/lib/motion/lenis'

interface SmoothScrollProps {
    children: ReactNode
}

/** Smooth wheel scrolling (desktop) kept in sync with ScrollTrigger. Touch devices keep native scrolling. */
export const SmoothScroll: FC<SmoothScrollProps> = ({ children }): ReactNode => {
    useEffect(() => {
        const refresh = (): void => {
            ScrollTrigger.refresh()
        }

        document.fonts?.ready.then(refresh).catch(() => undefined)
        window.addEventListener('load', refresh)

        if (prefersReducedMotion()) {
            return () => window.removeEventListener('load', refresh)
        }

        const lenis = new Lenis({
            lerp: 0.09,
            smoothWheel: true,
            wheelMultiplier: 0.95,
            anchors: { offset: -80 }
        })

        setLenis(lenis)

        const unsubscribe = lenis.on('scroll', ScrollTrigger.update)
        const tick = (time: number): void => {
            lenis.raf(time * 1000)
        }

        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)

        return () => {
            window.removeEventListener('load', refresh)
            unsubscribe()
            gsap.ticker.remove(tick)
            lenis.destroy()
            setLenis(null)
        }
    }, [])

    return children
}
