import type { FC, ReactNode } from 'react'

import { useEffect, useRef } from 'react'
import { gsap, isFinePointer, prefersReducedMotion } from '@/lib/motion/gsap'

/**
 * A soft follower that turns into a label ("View", "Read", "Play") over elements
 * marked with data-cursor. Only active with a mouse; the native cursor stays visible.
 */
export const Cursor: FC = (): ReactNode => {
    const rootRef = useRef<HTMLDivElement>(null)
    const dotRef = useRef<HTMLDivElement>(null)
    const labelRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const root = rootRef.current
        const dot = dotRef.current
        const label = labelRef.current

        if (!root || !dot || !label || !isFinePointer()) return

        const reduced = prefersReducedMotion()
        const duration = reduced ? 0.01 : 0.55

        const moveX = gsap.quickTo(root, 'x', { duration, ease: 'expo.out' })
        const moveY = gsap.quickTo(root, 'y', { duration, ease: 'expo.out' })

        let visible = false
        let activeLabel = ''

        const show = (): void => {
            if (visible) return
            visible = true
            gsap.to(root, { autoAlpha: 1, duration: 0.3 })
        }

        const setActive = (text: string): void => {
            if (text === activeLabel) return
            activeLabel = text

            if (text) {
                label.textContent = text
                gsap.to(dot, { scale: 1, duration: 0.5, ease: 'expo.out' })
                gsap.to(label, { autoAlpha: 1, duration: 0.3, delay: 0.08 })
            }
            else {
                gsap.to(label, { autoAlpha: 0, duration: 0.15 })
                gsap.to(dot, { scale: 0.14, duration: 0.5, ease: 'expo.out' })
            }
        }

        const handleMove = (event: PointerEvent): void => {
            if (event.pointerType !== 'mouse') return

            show()
            moveX(event.clientX)
            moveY(event.clientY)

            const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-cursor]') : null
            setActive(target?.dataset.cursor ?? '')
        }

        const handleLeave = (): void => {
            visible = false
            gsap.to(root, { autoAlpha: 0, duration: 0.3 })
        }

        const handleDown = (): void => {
            gsap.to(dot, { scale: activeLabel ? 0.9 : 0.1, duration: 0.2 })
        }

        const handleUp = (): void => {
            gsap.to(dot, { scale: activeLabel ? 1 : 0.14, duration: 0.4, ease: 'expo.out' })
        }

        gsap.set(dot, { scale: 0.14 })

        window.addEventListener('pointermove', handleMove, { passive: true })
        window.addEventListener('pointerdown', handleDown, { passive: true })
        window.addEventListener('pointerup', handleUp, { passive: true })
        document.documentElement.addEventListener('pointerleave', handleLeave)

        return () => {
            window.removeEventListener('pointermove', handleMove)
            window.removeEventListener('pointerdown', handleDown)
            window.removeEventListener('pointerup', handleUp)
            document.documentElement.removeEventListener('pointerleave', handleLeave)
        }
    }, [])

    return (
        <div
            ref={rootRef}
            className='pointer-events-none fixed left-0 top-0 z-[150] hidden opacity-0 [@media(hover:hover)_and_(pointer:fine)]:block'
            aria-hidden='true'
        >
            <div
                ref={dotRef}
                className='flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-flare text-ink'
            >
                <span ref={labelRef} className='eyebrow font-medium opacity-0'>
                    View
                </span>
            </div>
        </div>
    )
}
