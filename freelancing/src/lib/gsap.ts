import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

if (typeof window !== 'undefined' && !registered) {
    gsap.registerPlugin(ScrollTrigger)

    ScrollTrigger.config({
        ignoreMobileResize: true
    })

    gsap.defaults({
        ease: 'expo.out',
        duration: 1.1
    })

    registered = true
}

/**
 * Easing curves lifted from the reference motion system.
 * `editorial` is the signature curve: fast out of the gate, long settle.
 */
export const ease = {
    editorial: 'expo.out',
    slide: 'power4.out',
    crisp: 'power3.out',
    soft: 'power2.out',
    linear: 'none',
    overshoot: 'back.out(1.6)'
} as const

export { gsap, ScrollTrigger }
