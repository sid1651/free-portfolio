import type { FC, ReactNode } from 'react'

import { useEffect, useRef } from 'react'
import { gsap, isFinePointer, prefersReducedMotion } from '@/lib/motion/gsap'
import { cn } from '@/lib/utils'

interface MagneticProps {
    children: ReactNode
    className?: string
    strength?: number
}

/** Pulls its child gently toward the pointer, then springs back. Mouse only. */
export const Magnetic: FC<MagneticProps> = ({ children, className, strength = 0.32 }): ReactNode => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const element = ref.current
        if (!element || !isFinePointer() || prefersReducedMotion()) return

        const moveX = gsap.quickTo(element, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' })
        const moveY = gsap.quickTo(element, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' })

        const handleMove = (event: PointerEvent): void => {
            const rect = element.getBoundingClientRect()
            moveX((event.clientX - (rect.left + rect.width / 2)) * strength)
            moveY((event.clientY - (rect.top + rect.height / 2)) * strength)
        }

        const handleLeave = (): void => {
            moveX(0)
            moveY(0)
        }

        element.addEventListener('pointermove', handleMove)
        element.addEventListener('pointerleave', handleLeave)

        return () => {
            element.removeEventListener('pointermove', handleMove)
            element.removeEventListener('pointerleave', handleLeave)
        }
    }, [strength])

    return (
        <div ref={ref} className={cn('inline-block will-change-transform', className)}>
            {children}
        </div>
    )
}
