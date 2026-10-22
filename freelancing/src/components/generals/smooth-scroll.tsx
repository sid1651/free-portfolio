import type { FC, ReactNode } from 'react'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

import { gsap, ScrollTrigger } from '@/lib/gsap'

interface SmoothScrollProps {
    children: ReactNode
}

let instance: Lenis | null = null

export const getLenis = (): Lenis | null => instance

/**
 * Inertial scrolling driven by the GSAP ticker, with ScrollTrigger updated
 * from the same loop. Every scrubbed animation on the site reads its progress
 * from here, which is what gives the scroll its weight.
 */
export const SmoothScroll: FC<SmoothScrollProps> = ({ children }): ReactNode => {
    const raf = useRef<((time: number) => void) | null>(null)

    useEffect(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

        if (reduced.matches) return

        const lenis = new Lenis({
            duration: 1.15,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.6,
            infinite: false
        })

        instance = lenis

        lenis.on('scroll', ScrollTrigger.update)

        raf.current = (time: number) => lenis.raf(time * 1000)

        gsap.ticker.add(raf.current)
        gsap.ticker.lagSmoothing(0)

        ScrollTrigger.refresh()

        /* Same-page anchors glide instead of jumping. */
        const onClick = (event: MouseEvent) => {
            if (event.defaultPrevented || event.button !== 0) return

            const anchor = (event.target as HTMLElement | null)?.closest('a')

            if (!anchor) return

            const raw = anchor.getAttribute('href')

            if (!raw) return

            const hashIndex = raw.indexOf('#')

            if (hashIndex < 0) return

            const path = raw.slice(0, hashIndex)

            if (path && path !== window.location.pathname) return

            const target = document.getElementById(raw.slice(hashIndex + 1))

            if (!target) return

            event.preventDefault()
            lenis.scrollTo(target, { offset: -70, duration: 1.4 })
            window.history.replaceState(null, '', raw.slice(hashIndex))
        }

        document.addEventListener('click', onClick)

        return () => {
            document.removeEventListener('click', onClick)

            if (raf.current) gsap.ticker.remove(raf.current)

            lenis.destroy()
            instance = null
        }
    }, [])

    return <>{children}</>
}
