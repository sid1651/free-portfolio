import type { RefObject } from 'react'

import { gsap, useGSAP } from '@/lib/motion/gsap'

const within = (root: HTMLElement, selector: string): HTMLElement[] => Array.from(root.querySelectorAll<HTMLElement>(selector))

/**
 * Wires the declarative motion attributes found inside `scope`:
 * - data-reveal="fade"     fades and lifts one element
 * - data-reveal="stagger"  fades and lifts every direct child in sequence
 * - data-reveal="words"    raises the masked words rendered by <SplitWords>
 * - data-reveal="image"    wipes an image frame open (see <Media reveal>)
 * - data-reveal="line"     draws a hairline from the left
 * - data-parallax="10"     drifts the frame's [data-parallax-inner] while scrolling
 * - data-count="300"       counts a number up when it enters the viewport
 * Everything is skipped when the visitor prefers reduced motion.
 */
export const useReveal = (scope: RefObject<HTMLElement | null>, dependencies: unknown[] = []): void => {
    useGSAP(() => {
        const root = scope.current
        if (!root) return

        const mm = gsap.matchMedia()

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            within(root, '[data-reveal="fade"]').forEach((element) => {
                gsap.from(element, {
                    autoAlpha: 0,
                    y: 56,
                    duration: 1.3,
                    delay: Number(element.dataset.revealDelay ?? 0),
                    scrollTrigger: { trigger: element, start: 'top 90%', toggleActions: 'play none none none' }
                })
            })

            within(root, '[data-reveal="stagger"]').forEach((group) => {
                gsap.from(group.children, {
                    autoAlpha: 0,
                    y: 48,
                    duration: 1.2,
                    stagger: 0.09,
                    scrollTrigger: { trigger: group, start: 'top 88%', toggleActions: 'play none none none' }
                })
            })

            within(root, '[data-reveal="words"]').forEach((element) => {
                gsap.from(element.querySelectorAll('[data-word]'), {
                    yPercent: 118,
                    duration: 1.25,
                    stagger: 0.045,
                    scrollTrigger: { trigger: element, start: 'top 88%', toggleActions: 'play none none none' }
                })
            })

            // Plain tweens (not timelines) so each scroll trigger is measured the moment it is created.
            within(root, '[data-reveal="image"]').forEach((element) => {
                const inner = element.querySelector('[data-reveal-inner]')

                gsap.fromTo(
                    element,
                    { clipPath: 'inset(100% 0% 0% 0%)' },
                    {
                        clipPath: 'inset(0% 0% 0% 0%)',
                        duration: 1.5,
                        ease: 'expo.inOut',
                        scrollTrigger: { trigger: element, start: 'top 92%', toggleActions: 'play none none none' }
                    }
                )

                if (inner) {
                    gsap.fromTo(inner, { scale: 1.32 }, {
                        scale: 1,
                        duration: 2.1,
                        delay: 0.1,
                        ease: 'expo.out',
                        scrollTrigger: { trigger: element, start: 'top 92%', toggleActions: 'play none none none' }
                    })
                }
            })

            within(root, '[data-reveal="line"]').forEach((element) => {
                gsap.from(element, {
                    scaleX: 0,
                    transformOrigin: '0% 50%',
                    duration: 1.6,
                    ease: 'expo.inOut',
                    scrollTrigger: { trigger: element, start: 'top 94%', toggleActions: 'play none none none' }
                })
            })

            within(root, '[data-parallax]').forEach((element) => {
                const amount = Number(element.dataset.parallax) || 10
                const inner = element.querySelector<HTMLElement>('[data-parallax-inner]') ?? element

                gsap.fromTo(
                    inner,
                    { yPercent: -amount },
                    {
                        yPercent: amount,
                        ease: 'none',
                        scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: true }
                    }
                )
            })

            const counters = within(root, '[data-count]')

            counters.forEach((element) => {
                const target = Number(element.dataset.count)
                if (!Number.isFinite(target)) return

                const counter = { value: 0 }
                element.textContent = '0'

                gsap.to(counter, {
                    value: target,
                    duration: 2.2,
                    ease: 'expo.out',
                    scrollTrigger: { trigger: element, start: 'top 92%', toggleActions: 'play none none none' },
                    onUpdate: () => {
                        element.textContent = String(Math.round(counter.value))
                    },
                    onComplete: () => {
                        element.textContent = String(target)
                    }
                })
            })

            return () => {
                counters.forEach((element) => {
                    if (element.dataset.count) element.textContent = element.dataset.count
                })
            }
        })

        return () => mm.revert()
    }, { scope, dependencies, revertOnUpdate: true })
}
