import type { FC, ReactNode } from 'react'

import { useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'

import { gsap } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect'
import { getLenis } from '@/components/generals/smooth-scroll'

import { gallery } from '@/constants/home'

interface GalleryLightboxProps {
    index: number | null
    onClose: () => void
    onStep: (direction: 1 | -1) => void
}

/**
 * Full-screen viewer for a gallery tile — no navigation away from the page,
 * just the picture held large with its caption and a way to step to its
 * neighbours.
 */
export const GalleryLightbox: FC<GalleryLightboxProps> = ({
    index,
    onClose,
    onStep
}): ReactNode => {
    const overlayRef = useRef<HTMLDivElement | null>(null)
    const open = index !== null
    const item = index !== null ? gallery[index] : null

    useIsomorphicLayoutEffect(() => {
        const overlay = overlayRef.current

        if (!overlay) return

        const context = gsap.context(() => {
            if (open) {
                gsap.set(overlay, { pointerEvents: 'auto' })
                gsap
                    .timeline()
                    .set(overlay, { autoAlpha: 1 })
                    .fromTo(
                        overlay,
                        { clipPath: 'inset(0% 0% 100% 0%)' },
                        {
                            clipPath: 'inset(0% 0% 0% 0%)',
                            duration: 0.7,
                            ease: 'power4.inOut'
                        }
                    )
                    .fromTo(
                        '[data-lightbox-figure]',
                        { opacity: 0, y: 24 },
                        { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' },
                        '-=0.25'
                    )

                return
            }

            gsap
                .timeline({
                    onComplete: () => gsap.set(overlay, { pointerEvents: 'none' })
                })
                .to('[data-lightbox-figure]', {
                    opacity: 0,
                    duration: 0.25,
                    ease: 'power2.in'
                })
                .to(
                    overlay,
                    {
                        clipPath: 'inset(0% 0% 100% 0%)',
                        duration: 0.55,
                        ease: 'power4.inOut'
                    },
                    '-=0.1'
                )
                .set(overlay, { autoAlpha: 0 })
        }, overlay)

        return () => context.revert()
    }, [open])

    useEffect(() => {
        const lenis = getLenis()

        if (open) {
            lenis?.stop()
            document.body.style.overflow = 'hidden'
        } else {
            lenis?.start()
            document.body.style.overflow = ''
        }

        return () => {
            document.body.style.overflow = ''
        }
    }, [open])

    useEffect(() => {
        if (!open) return

        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
            if (event.key === 'ArrowRight') onStep(1)
            if (event.key === 'ArrowLeft') onStep(-1)
        }

        window.addEventListener('keydown', onKey)

        return () => window.removeEventListener('keydown', onKey)
    }, [open, onClose, onStep])

    return (
        <div
            ref={overlayRef}
            role='dialog'
            aria-modal='true'
            aria-label='Image viewer'
            className='invisible fixed inset-0 z-[600] bg-ink/97 opacity-0'
        >
            <button
                type='button'
                onClick={onClose}
                aria-label='Close image viewer'
                data-cursor='link'
                className='absolute right-5 top-5 z-10 flex size-11 items-center justify-center rounded-full border border-hairline text-bone transition-colors duration-300 hover:border-acid hover:text-acid md:right-8 md:top-8'
            >
                <X className='size-5' />
            </button>

            <button
                type='button'
                onClick={() => onStep(-1)}
                aria-label='Previous image'
                data-cursor='link'
                className='absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-hairline text-bone transition-colors duration-300 hover:border-acid hover:text-acid md:left-8'
            >
                <ArrowLeft className='size-5' />
            </button>

            <button
                type='button'
                onClick={() => onStep(1)}
                aria-label='Next image'
                data-cursor='link'
                className='absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-hairline text-bone transition-colors duration-300 hover:border-acid hover:text-acid md:right-8'
            >
                <ArrowRight className='size-5' />
            </button>

            {item && (
                <figure
                    data-lightbox-figure
                    className='flex size-full flex-col items-center justify-center gap-6 px-6 py-20 md:px-24'
                >
                    <div className='relative max-h-[70vh] w-full max-w-4xl overflow-hidden'>
                        <img
                            src={item.src}
                            alt={item.caption}
                            className='mx-auto max-h-[70vh] w-auto object-contain'
                        />
                    </div>

                    <figcaption className='flex flex-col items-center gap-1 text-center'>
                        <p className='text-[16px] font-bold uppercase leading-[1.2] tracking-[-0.03em] text-bone md:text-[19px]'>
                            {item.caption}
                        </p>

                        <p className='label-mono text-dust'>
                            {item.label} — {item.place}
                        </p>
                    </figcaption>
                </figure>
            )}

            <p
                className={cn(
                    'label-mono absolute bottom-6 left-1/2 -translate-x-1/2 text-dust',
                    'hidden md:block'
                )}
            >
                {index !== null ? index + 1 : 0} / {gallery.length}
            </p>
        </div>
    )
}
