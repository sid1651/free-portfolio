import type { RefObject } from 'react'

import { useEffect } from 'react'
import { gsap, isFinePointer, prefersReducedMotion } from '@/lib/motion/gsap'

/**
 * Makes `preview` follow the pointer while it is over `area` (mouse only).
 * The preview is positioned relative to `area`, so place both in the same positioned parent.
 */
export const useHoverPreview = (
    area: RefObject<HTMLElement | null>,
    preview: RefObject<HTMLElement | null>,
    onLeave?: () => void
): void => {
    useEffect(() => {
        const zone = area.current
        const card = preview.current
        if (!zone || !card || !isFinePointer()) return

        const reduced = prefersReducedMotion()
        const moveX = gsap.quickTo(card, 'x', { duration: reduced ? 0.01 : 0.8, ease: 'expo.out' })
        const moveY = gsap.quickTo(card, 'y', { duration: reduced ? 0.01 : 0.8, ease: 'expo.out' })

        const handleMove = (event: PointerEvent): void => {
            const bounds = zone.getBoundingClientRect()
            moveX(event.clientX - bounds.left)
            moveY(event.clientY - bounds.top)
        }

        const handleEnter = (): void => {
            gsap.to(card, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'expo.out' })
        }

        const handleLeave = (): void => {
            gsap.to(card, { autoAlpha: 0, scale: 0.85, duration: 0.4, ease: 'power2.out' })
            onLeave?.()
        }

        gsap.set(card, { autoAlpha: 0, scale: 0.85, xPercent: -50, yPercent: -50 })

        zone.addEventListener('pointermove', handleMove)
        zone.addEventListener('pointerenter', handleEnter)
        zone.addEventListener('pointerleave', handleLeave)

        return () => {
            zone.removeEventListener('pointermove', handleMove)
            zone.removeEventListener('pointerenter', handleEnter)
            zone.removeEventListener('pointerleave', handleLeave)
        }
    }, [area, preview, onLeave])
}
