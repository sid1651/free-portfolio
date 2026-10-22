import type { FC, ReactNode } from 'react'

import Lenis from 'lenis'
import { createContext, useContext, useEffect, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

interface SmoothScrollProps {
    children: ReactNode
}

const SmoothScrollContext = createContext<Lenis | null>(null)

export const useSmoothScroll = (): Lenis | null => useContext(SmoothScrollContext)

const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4)

export const SmoothScroll: FC<SmoothScrollProps> = ({ children }): ReactNode => {
    const [lenis, setLenis] = useState<Lenis | null>(null)

    useEffect(() => {
        const instance = new Lenis({
            lerp: 0.085,
            smoothWheel: true,
            wheelMultiplier: 0.95
        })

        instance.on('scroll', ScrollTrigger.update)

        const onTick = (time: number): void => {
            instance.raf(time * 1000)
        }

        gsap.ticker.add(onTick)
        gsap.ticker.lagSmoothing(0)

        const onClick = (event: MouseEvent): void => {
            if (event.defaultPrevented || event.button !== 0) return
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

            const origin = event.target
            if (!(origin instanceof Element)) return

            const anchor = origin.closest('a[href^="#"]')
            if (!anchor) return

            const hash = anchor.getAttribute('href') ?? ''

            if (hash.length <= 1) {
                event.preventDefault()
                instance.scrollTo(0, { force: true, duration: 1.6, easing: easeOutQuart })
                return
            }

            const destination = document.getElementById(decodeURIComponent(hash.slice(1)))
            if (!destination) return

            event.preventDefault()
            instance.scrollTo(destination, { force: true, duration: 1.6, easing: easeOutQuart })

            if (destination.hasAttribute('tabindex')) destination.focus({ preventScroll: true })
        }

        const refresh = (): void => {
            ScrollTrigger.refresh()
        }

        document.addEventListener('click', onClick)
        document.fonts?.ready.then(refresh).catch(() => undefined)
        setLenis(instance)

        return () => {
            document.removeEventListener('click', onClick)
            gsap.ticker.remove(onTick)
            instance.destroy()
            setLenis(null)
        }
    }, [])

    return (
        <SmoothScrollContext.Provider value={lenis}>
            {children}
        </SmoothScrollContext.Provider>
    )
}
