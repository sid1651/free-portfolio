import type { CSSProperties, FC, ReactNode } from 'react'

import { gsap, ScrollTrigger } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import { useGsapContext } from '@/hooks/use-gsap'
import { useSiteReady } from '@/components/generals/ready-provider'

type Direction = 'up' | 'down' | 'left' | 'right'

const clipFor = (direction: Direction, open: boolean): string => {
    if (open) return 'inset(0% 0% 0% 0%)'

    switch (direction) {
        case 'down':
            return 'inset(0% 0% 100% 0%)'
        case 'left':
            return 'inset(0% 100% 0% 0%)'
        case 'right':
            return 'inset(0% 0% 0% 100%)'
        default:
            return 'inset(100% 0% 0% 0%)'
    }
}

interface ClipMediaProps {
    src: string
    alt: string
    className?: string
    imageClassName?: string
    style?: CSSProperties
    /** Direction the mask opens from. */
    direction?: Direction
    delay?: number
    duration?: number
    ease?: string
    start?: string
    trigger?: 'scroll' | 'load'
    /** Starting scale of the image inside the mask. */
    zoom?: number
    priority?: boolean
    children?: ReactNode
}

/**
 * The signature image entrance: a clip-path curtain opens while the picture
 * itself settles back from an over-scaled crop, so the frame and its contents
 * move at different speeds.
 */
export const ClipMedia: FC<ClipMediaProps> = ({
    src,
    alt,
    className,
    imageClassName,
    style,
    direction = 'up',
    delay = 0,
    duration = 1.5,
    ease = 'expo.out',
    start = 'top 85%',
    trigger = 'scroll',
    zoom = 1.35,
    priority = false,
    children
}): ReactNode => {
    const ready = useSiteReady()

    const scope = useGsapContext<HTMLDivElement>(() => {
        const root = scope.current

        if (!root) return

        const image = root.querySelector('[data-clip-image]')

        if (!image) return

        gsap.set(root, { clipPath: clipFor(direction, false) })
        gsap.set(image, { scale: zoom })

        const animate = () => {
            const timeline = gsap.timeline({ delay })

            timeline
                .to(root, {
                    clipPath: clipFor(direction, true),
                    duration,
                    ease
                })
                .to(
                    image,
                    {
                        scale: 1,
                        duration: duration * 1.25,
                        ease
                    },
                    0
                )
        }

        if (trigger === 'load') {
            if (ready) animate()
            return
        }

        ScrollTrigger.create({
            trigger: root,
            start,
            once: true,
            onEnter: animate
        })
    }, [src, ready, trigger])

    return (
        <div
            ref={scope}
            style={style}
            className={cn('media-clip relative', className)}
        >
            <img
                src={src}
                alt={alt}
                data-clip-image
                decoding='async'
                loading={priority ? 'eager' : 'lazy'}
                className={cn(
                    'size-full object-cover will-change-transform',
                    imageClassName
                )}
            />

            {children}
        </div>
    )
}

/* ── Scroll-scrubbed parallax ────────────────────────────────────────── */

interface ParallaxProps {
    children: ReactNode
    className?: string
    style?: CSSProperties
    /**
     * Travel distance across the whole scroll pass, as a percentage of the
     * element height. Positive lags behind the scroll, negative leads it.
     */
    speed?: number
    /** Horizontal travel in percent. */
    speedX?: number
    scaleFrom?: number
    scaleTo?: number
    rotateTo?: number
    start?: string
    end?: string
    scrub?: number | boolean
}

export const Parallax: FC<ParallaxProps> = ({
    children,
    className,
    style,
    speed = 12,
    speedX = 0,
    scaleFrom,
    scaleTo,
    rotateTo,
    start = 'top bottom',
    end = 'bottom top',
    scrub = 1
}): ReactNode => {
    const scope = useGsapContext<HTMLDivElement>(() => {
        const root = scope.current

        if (!root) return

        const target = root.firstElementChild ?? root

        const fromVars: gsap.TweenVars = {
            yPercent: -speed,
            xPercent: -speedX
        }

        const toVars: gsap.TweenVars = {
            yPercent: speed,
            xPercent: speedX,
            ease: 'none',
            scrollTrigger: {
                trigger: root,
                start,
                end,
                scrub,
                invalidateOnRefresh: true
            }
        }

        if (scaleFrom !== undefined) fromVars.scale = scaleFrom
        if (scaleTo !== undefined) toVars.scale = scaleTo
        if (rotateTo !== undefined) {
            fromVars.rotate = 0
            toVars.rotate = rotateTo
        }

        gsap.fromTo(target, fromVars, toVars)
    }, [speed, speedX])

    return (
        <div
            ref={scope}
            style={style}
            className={cn('will-change-transform', className)}
        >
            {children}
        </div>
    )
}

/* ── Scrubbed crop: the frame grows while the photo drifts ───────────── */

interface ScrubCropProps {
    src: string
    alt: string
    className?: string
    imageClassName?: string
    style?: CSSProperties
    /** Image drift inside the frame, in percent of its own height. */
    drift?: number
    /** Frame width at the start of the pass, as a percentage. */
    fromWidth?: number
    toWidth?: number
    priority?: boolean
}

export const ScrubCrop: FC<ScrubCropProps> = ({
    src,
    alt,
    className,
    imageClassName,
    style,
    drift = 16,
    fromWidth,
    toWidth,
    priority = false
}): ReactNode => {
    const scope = useGsapContext<HTMLDivElement>(() => {
        const root = scope.current

        if (!root) return

        const image = root.querySelector('[data-scrub-image]')

        if (!image) return

        gsap.fromTo(
            image,
            { yPercent: -drift },
            {
                yPercent: drift,
                ease: 'none',
                scrollTrigger: {
                    trigger: root,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            }
        )

        if (fromWidth !== undefined && toWidth !== undefined) {
            gsap.fromTo(
                root,
                { width: `${fromWidth}%` },
                {
                    width: `${toWidth}%`,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: root,
                        start: 'top 90%',
                        end: 'bottom 40%',
                        scrub: 1,
                        invalidateOnRefresh: true
                    }
                }
            )
        }
    }, [src, drift])

    return (
        <div
            ref={scope}
            style={style}
            className={cn('relative overflow-hidden', className)}
        >
            <img
                src={src}
                alt={alt}
                data-scrub-image
                decoding='async'
                loading={priority ? 'eager' : 'lazy'}
                className={cn(
                    'absolute inset-0 size-full scale-125 object-cover will-change-transform',
                    imageClassName
                )}
            />
        </div>
    )
}
