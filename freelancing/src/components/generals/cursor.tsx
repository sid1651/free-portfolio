import type { FC, ReactNode } from 'react'

import { useEffect, useRef, useState } from 'react'

import { gsap } from '@/lib/gsap'

/**
 * A lagging ring plus a hard dot. Interactive elements can change its state
 * with `data-cursor="view" | "drag" | "link" | "hide"` and label it with
 * `data-cursor-label`.
 */
export const Cursor: FC = (): ReactNode => {
    const [enabled, setEnabled] = useState(false)
    const ringRef = useRef<HTMLDivElement | null>(null)
    const dotRef = useRef<HTMLDivElement | null>(null)
    const labelRef = useRef<HTMLSpanElement | null>(null)

    useEffect(() => {
        const finePointer = window.matchMedia('(pointer: fine)').matches

        if (!finePointer) return

        setEnabled(true)
    }, [])

    useEffect(() => {
        if (!enabled) return

        const ring = ringRef.current
        const dot = dotRef.current
        const label = labelRef.current

        if (!ring || !dot || !label) return

        const moveRingX = gsap.quickTo(ring, 'x', {
            duration: 0.55,
            ease: 'power3.out'
        })
        const moveRingY = gsap.quickTo(ring, 'y', {
            duration: 0.55,
            ease: 'power3.out'
        })
        const moveDotX = gsap.quickTo(dot, 'x', {
            duration: 0.12,
            ease: 'power3.out'
        })
        const moveDotY = gsap.quickTo(dot, 'y', {
            duration: 0.12,
            ease: 'power3.out'
        })

        let visible = false

        const onMove = (event: PointerEvent) => {
            if (!visible) {
                visible = true
                gsap.to([ring, dot], { autoAlpha: 1, duration: 0.3 })
            }

            moveRingX(event.clientX)
            moveRingY(event.clientY)
            moveDotX(event.clientX)
            moveDotY(event.clientY)
        }

        const onLeave = () => {
            visible = false
            gsap.to([ring, dot], { autoAlpha: 0, duration: 0.2 })
        }

        const onOver = (event: PointerEvent) => {
            const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
                '[data-cursor], a, button'
            )

            if (!target) {
                gsap.to(ring, {
                    scale: 1,
                    borderColor: '#4a4a4a',
                    backgroundColor: 'rgba(5,6,9,0)',
                    duration: 0.4
                })
                gsap.to(label, { autoAlpha: 0, duration: 0.2 })
                gsap.to(dot, { scale: 1, duration: 0.3 })

                return
            }

            const mode = target.dataset.cursor ?? 'link'
            const text = target.dataset.cursorLabel

            if (mode === 'hide') {
                gsap.to([ring, dot], { autoAlpha: 0, duration: 0.2 })
                return
            }

            label.textContent = text ?? ''

            gsap.to(ring, {
                scale: text ? 3.4 : 2.1,
                borderColor: '#f4521c',
                backgroundColor: text
                    ? 'rgba(5,6,9,0.92)'
                    : 'rgba(244,82,28,0.1)',
                duration: 0.45,
                ease: 'expo.out'
            })

            gsap.to(dot, { scale: text ? 0 : 0.4, duration: 0.3 })
            gsap.to(label, { autoAlpha: text ? 1 : 0, duration: 0.3 })
        }

        window.addEventListener('pointermove', onMove, { passive: true })
        window.addEventListener('pointerover', onOver, { passive: true })
        document.addEventListener('pointerleave', onLeave)

        return () => {
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerover', onOver)
            document.removeEventListener('pointerleave', onLeave)
        }
    }, [enabled])

    if (!enabled) return null

    return (
        <div
            aria-hidden='true'
            className='pointer-events-none fixed inset-0 z-[9999] hidden md:block'
        >
            <div
                ref={ringRef}
                className='absolute -left-5 -top-5 flex size-10 items-center justify-center rounded-full border border-[#4a4a4a] opacity-0 will-change-transform'
            >
                <span
                    ref={labelRef}
                    className='label-mono pointer-events-none whitespace-nowrap text-[3.2px] font-medium tracking-[0.06em] text-bone opacity-0'
                >
                    VIEW
                </span>
            </div>

            <div
                ref={dotRef}
                className='absolute -left-[3px] -top-[3px] size-[6px] rounded-full bg-acid opacity-0 will-change-transform'
            />
        </div>
    )
}
