import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, useGSAP)
    gsap.defaults({ ease: 'expo.out', duration: 1.2 })
    ScrollTrigger.config({ ignoreMobileResize: true })
}

export const prefersReducedMotion = (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const isFinePointer = (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

export { gsap, ScrollTrigger, useGSAP }
