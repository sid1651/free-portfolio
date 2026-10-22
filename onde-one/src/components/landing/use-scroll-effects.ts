import type { RefObject } from 'react'

import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'

/**
 * Page-wide scroll motion:
 * - `data-reveal` elements rise and fade in as they enter the viewport.
 * - `data-parallax="12"` elements drift by the given yPercent across their parent's scroll range.
 * Nothing is hidden for visitors who prefer reduced motion.
 */
export const useScrollEffects = (scope: RefObject<HTMLElement | null>): void => {
    useGSAP(() => {
        const media = gsap.matchMedia()

        media.add('(prefers-reduced-motion: no-preference)', () => {
            const items = gsap.utils.toArray<HTMLElement>('[data-reveal]')

            gsap.set(items, { autoAlpha: 0, y: 36 })

            const reveal = (batch: Element[]): void => {
                gsap.to(batch, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 1.2,
                    ease: 'expo.out',
                    stagger: 0.09,
                    overwrite: true
                })
            }

            ScrollTrigger.batch(items, {
                start: 'top 90%',
                onEnter: reveal,
                onEnterBack: reveal
            })

            gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((element) => {
                const amount = Number(element.dataset.parallax) || 10

                gsap.fromTo(
                    element,
                    { yPercent: -amount },
                    {
                        yPercent: amount,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: element.parentElement ?? element,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true
                        }
                    }
                )
            })
        })
    }, { scope })
}
