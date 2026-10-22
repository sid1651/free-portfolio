import type { CSSProperties, FC, ReactNode } from 'react'

import { useEffect, useState } from 'react'

import { gsap, ScrollTrigger } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import { useGsapContext } from '@/hooks/use-gsap'

interface MarqueeProps {
    children: ReactNode
    className?: string
    trackClassName?: string
    style?: CSSProperties
    /** Seconds for one full pass of a single copy. */
    speed?: number
    direction?: 'left' | 'right'
    /** Minimum copies rendered. More are added if the strip can't cover its box. */
    repeat?: number
    /** Scroll velocity nudges the marquee faster and can flip its direction. */
    reactive?: boolean
    pauseOnHover?: boolean
}

/**
 * Continuous horizontal motion built on a seamless `xPercent` loop.
 *
 * The track always rests one copy to the LEFT of its travel, whichever way it
 * runs, so the strip is full from the very first frame instead of opening with
 * a hole that closes and snaps back. Copies are measured after mount and topped
 * up until they overflow the box, so a short label fills a wide band. With
 * `reactive`, scrolling injects velocity so the strip surges and eases back.
 */
export const Marquee: FC<MarqueeProps> = ({
    children,
    className,
    trackClassName,
    style,
    speed = 26,
    direction = 'left',
    repeat = 4,
    reactive = true,
    pauseOnHover = false
}): ReactNode => {
    const [copies, setCopies] = useState(repeat)

    const scope = useGsapContext<HTMLDivElement>(() => {
        const root = scope.current

        if (!root) return

        const track = root.querySelector<HTMLElement>('[data-marquee-track]')

        if (!track) return

        /* One copy expressed as a share of the whole track. Both directions
           travel across that same span; only the endpoints swap, so the strip
           is never short of content on either edge. */
        const span = 100 / copies

        const tween = gsap.fromTo(
            track,
            { xPercent: direction === 'left' ? 0 : -span },
            {
                xPercent: direction === 'left' ? -span : 0,
                duration: speed,
                ease: 'none',
                repeat: -1
            }
        )

        if (pauseOnHover) {
            root.addEventListener('mouseenter', () => tween.timeScale(0.15))
            root.addEventListener('mouseleave', () => tween.timeScale(1))
        }

        if (!reactive) return

        /* Scroll velocity sets a target time scale; the ticker eases it back
           to rest. One cheap function per frame, no tween churn. */
        let scale = 1

        const trigger = ScrollTrigger.create({
            trigger: root,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => {
                const velocity = Math.abs(self.getVelocity())
                const boost = gsap.utils.clamp(1, 4, 1 + velocity / 1400)

                scale = self.getVelocity() < 0 ? -boost : boost
            }
        })

        const settle = () => {
            scale += (1 - scale) * 0.05
            tween.timeScale(scale)
        }

        gsap.ticker.add(settle)

        return () => {
            gsap.ticker.remove(settle)
            trigger.kill()
        }
    }, [speed, direction, copies])

    /* A fixed copy count only fills the band when the content happens to be
       wide enough. Measure one copy and top the strip up until it overflows,
       so a short mono label loops as densely as a display headline. */
    useEffect(() => {
        const root = scope.current

        if (!root) return

        const measure = () => {
            const copy = root.querySelector<HTMLElement>('[data-marquee-copy]')

            if (!copy) return

            const width = copy.getBoundingClientRect().width

            if (!width) return

            const needed = Math.max(
                repeat,
                Math.ceil(root.clientWidth / width) + 2
            )

            setCopies((current) => (current === needed ? current : needed))
        }

        measure()

        const observer = new ResizeObserver(measure)

        observer.observe(root)

        /* Web fonts land after first paint and change the copy width. */
        document.fonts?.ready.then(measure).catch(() => undefined)

        return () => observer.disconnect()
    }, [repeat, scope])

    return (
        <div
            ref={scope}
            aria-hidden='true'
            style={style}
            className={cn('w-full overflow-hidden', className)}
        >
            <div
                data-marquee-track
                className={cn('marquee-track', trackClassName)}
            >
                {Array.from({ length: copies }).map((_, index) => (
                    <div
                        key={index}
                        data-marquee-copy
                        className='flex shrink-0 items-center'
                    >
                        {children}
                    </div>
                ))}
            </div>
        </div>
    )
}
