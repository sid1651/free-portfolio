import type { CSSProperties, FC, PointerEvent, ReactNode } from 'react'

import { useRef } from 'react'

import { gsap } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import { useGsapContext } from '@/hooks/use-gsap'

type Curtain = 'split' | 'inverted' | 'wipe-left' | 'wipe-down'

interface CurtainMediaProps {
    src: string
    alt: string
    video?: string
    className?: string
    imageClassName?: string
    style?: CSSProperties
    /** Panel colour — must match the section background. */
    mask?: string
    curtain?: Curtain
    /** Over-scaled crop that scrubs back to 1 as the block passes. */
    zoom?: number
    /** Constant crop with no scrub, for the index cards. */
    staticZoom?: number
    caption?: string
    sublabel?: string
    priority?: boolean
    grayscale?: boolean
    children?: ReactNode
}

/**
 * The reference's image primitive: two mask panels retract in opposite
 * directions while the picture eases out of an over-scaled crop, and a caption
 * chip tracks the pointer across the frame.
 */
export const CurtainMedia: FC<CurtainMediaProps> = ({
    src,
    alt,
    video,
    className,
    imageClassName,
    style,
    mask = '#050609',
    curtain = 'split',
    zoom = 1.4,
    staticZoom,
    caption,
    sublabel,
    priority = false,
    grayscale = false,
    children
}): ReactNode => {
    const chip = useRef<HTMLDivElement | null>(null)

    const scope = useGsapContext<HTMLDivElement>(() => {
        const root = scope.current

        if (!root) return

        const panels = root.querySelectorAll('[data-panel]')
        const inner = root.querySelector('[data-media-inner]')

        if (panels.length) {
            const axis = curtain === 'wipe-left' ? 'width' : 'height'

            gsap.set(panels, { [axis]: '100%' })

            gsap.to(panels, {
                [axis]: '0%',
                duration: 1.25,
                ease: 'power4.inOut',
                stagger: 0.08,
                scrollTrigger: {
                    trigger: root,
                    start: 'top 88%',
                    once: true
                }
            })
        }

        if (inner && staticZoom === undefined) {
            gsap.fromTo(
                inner,
                { scale: zoom },
                {
                    scale: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: root,
                        start: 'top bottom',
                        end: 'bottom 30%',
                        scrub: 0.9,
                        invalidateOnRefresh: true
                    }
                }
            )
        }
    }, [src, curtain])

    const onMove = (event: PointerEvent<HTMLDivElement>) => {
        if (!caption || !chip.current) return

        const bounds = event.currentTarget.getBoundingClientRect()

        gsap.to(chip.current, {
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top,
            duration: 0.55,
            ease: 'power3.out'
        })
    }

    const onEnter = () => {
        if (!caption || !chip.current) return

        gsap.to(chip.current, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.45,
            ease: 'expo.out'
        })
    }

    const onLeave = () => {
        if (!caption || !chip.current) return

        gsap.to(chip.current, {
            autoAlpha: 0,
            scale: 0.4,
            duration: 0.3,
            ease: 'power2.in'
        })
    }

    const panelStyles: CSSProperties[] =
        curtain === 'wipe-left'
            ? [{ top: 0, right: 0, width: '100%', height: '100%' }]
            : curtain === 'wipe-down'
              ? [{ top: 0, left: 0, width: '100%', height: '100%' }]
              : curtain === 'inverted'
                ? [
                      { top: 0, left: 0, width: '50%', height: '100%' },
                      {
                          bottom: 0,
                          right: 0,
                          width: 'calc(50% + 1px)',
                          height: '100%'
                      }
                  ]
                : [
                      { bottom: 0, left: 0, width: '50%', height: '100%' },
                      {
                          top: 0,
                          right: 0,
                          width: 'calc(50% + 1px)',
                          height: '100%'
                      }
                  ]

    return (
        <div
            ref={scope}
            style={style}
            onPointerMove={onMove}
            onPointerEnter={onEnter}
            onPointerLeave={onLeave}
            data-cursor={caption ? 'hide' : undefined}
            className={cn('relative overflow-hidden', className)}
        >
            <div
                data-media-inner
                className='absolute inset-0 will-change-transform'
                style={{
                    transform: `scale(${staticZoom ?? zoom})`
                }}
            >
                {video ? (
                    <video
                        muted
                        loop
                        playsInline
                        autoPlay
                        poster={src}
                        aria-label={alt}
                        className={cn(
                            'size-full object-cover',
                            grayscale && 'grayscale',
                            imageClassName
                        )}
                    >
                        <source src={video} type='video/mp4' />
                    </video>
                ) : (
                    <img
                        src={src}
                        alt={alt}
                        decoding='async'
                        loading={priority ? 'eager' : 'lazy'}
                        className={cn(
                            'size-full object-cover',
                            grayscale && 'grayscale',
                            imageClassName
                        )}
                    />
                )}
            </div>

            {panelStyles.map((panel, index) => (
                <div
                    key={index}
                    data-panel
                    aria-hidden='true'
                    className='pointer-events-none absolute'
                    style={{ ...panel, backgroundColor: mask }}
                />
            ))}

            {caption && (
                <div
                    ref={chip}
                    aria-hidden='true'
                    className='pointer-events-none invisible absolute left-0 top-0 z-10 flex max-w-[300px] scale-[0.4] flex-col gap-2 p-3 will-change-transform'
                >
                    <p className='w-max max-w-[300px] text-[20px] font-bold leading-[1.1] tracking-[-0.04em] text-bone drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]'>
                        {caption}
                    </p>

                    {sublabel && (
                        <p className='label-mono max-w-[250px] text-acid'>
                            {sublabel}
                        </p>
                    )}
                </div>
            )}

            {caption && (
                <span className='sr-only'>
                    Caption: {caption}. {sublabel}
                </span>
            )}

            {children}
        </div>
    )
}
