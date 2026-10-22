import type { FC, ReactNode } from 'react'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import { gsap, ScrollTrigger } from '@/lib/gsap'
import { getLenis } from '@/components/generals/smooth-scroll'
import { ReadyProvider } from '@/components/generals/ready-provider'

const COLUMNS = 6

interface PageTransitionProps {
    children: ReactNode
}

/**
 * Entry and route-change curtain. Six ink columns sweep up to cover, the
 * wordmark flashes, then the columns drop away in a reversed stagger so the
 * incoming page is uncovered from left to right.
 */
export const PageTransition: FC<PageTransitionProps> = ({
    children
}): ReactNode => {
    const router = useRouter()
    const [ready, setReady] = useState(false)
    const overlayRef = useRef<HTMLDivElement | null>(null)
    const covering = useRef<Promise<void> | null>(null)

    const cover = useCallback((): Promise<void> => {
        const overlay = overlayRef.current

        if (!overlay) return Promise.resolve()

        const columns = overlay.querySelectorAll('[data-curtain-column]')
        const mark = overlay.querySelector('[data-curtain-mark]')

        return new Promise((resolve) => {
            gsap.set(overlay, { pointerEvents: 'auto', autoAlpha: 1 })

            const timeline = gsap.timeline({ onComplete: () => resolve() })

            timeline
                .set(columns, { yPercent: 100 })
                .set(mark, { autoAlpha: 0, y: 12 })
                .to(columns, {
                    yPercent: 0,
                    duration: 0.62,
                    ease: 'power4.inOut',
                    stagger: 0.035
                })
                .to(
                    mark,
                    { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' },
                    '-=0.22'
                )
        })
    }, [])

    const reveal = useCallback((): void => {
        const overlay = overlayRef.current

        if (!overlay) return

        const columns = overlay.querySelectorAll('[data-curtain-column]')
        const mark = overlay.querySelector('[data-curtain-mark]')

        const timeline = gsap.timeline({
            onComplete: () => {
                gsap.set(overlay, { pointerEvents: 'none', autoAlpha: 0 })
                ScrollTrigger.refresh()
            }
        })

        timeline
            .to(mark, { autoAlpha: 0, y: -10, duration: 0.3, ease: 'power2.in' })
            .to(
                columns,
                {
                    yPercent: -100,
                    duration: 0.82,
                    ease: 'power4.inOut',
                    stagger: { each: 0.045, from: 'start' }
                },
                '-=0.12'
            )
            .add(() => setReady(true), 0.24)
    }, [])

    /* First paint: the curtain is already down, so just lift it. */
    useEffect(() => {
        const overlay = overlayRef.current

        if (!overlay) return

        const columns = overlay.querySelectorAll('[data-curtain-column]')
        const mark = overlay.querySelector('[data-curtain-mark]')

        gsap.set(columns, { yPercent: 0 })
        gsap.set(mark, { autoAlpha: 1, y: 0 })

        const timer = window.setTimeout(reveal, 420)

        return () => window.clearTimeout(timer)
    }, [reveal])

    useEffect(() => {
        const onStart = (url: string) => {
            if (url === router.asPath) return

            setReady(false)
            covering.current = cover()
            getLenis()?.stop()
        }

        const onComplete = async () => {
            await covering.current

            window.scrollTo(0, 0)
            getLenis()?.scrollTo(0, { immediate: true })
            getLenis()?.start()

            ScrollTrigger.refresh()
            reveal()
        }

        const onError = () => {
            getLenis()?.start()
            reveal()
        }

        router.events.on('routeChangeStart', onStart)
        router.events.on('routeChangeComplete', onComplete)
        router.events.on('routeChangeError', onError)

        return () => {
            router.events.off('routeChangeStart', onStart)
            router.events.off('routeChangeComplete', onComplete)
            router.events.off('routeChangeError', onError)
        }
    }, [router, cover, reveal])

    return (
        <ReadyProvider ready={ready}>
            {children}

            <div
                ref={overlayRef}
                aria-hidden='true'
                className='fixed inset-0 z-[10000] flex'
            >
                {Array.from({ length: COLUMNS }).map((_, index) => (
                    <div
                        key={index}
                        data-curtain-column
                        className='h-full flex-1 bg-ink will-change-transform'
                    />
                ))}

                <div
                    data-curtain-mark
                    className='pointer-events-none absolute inset-0 flex items-center justify-center'
                >
                    <span className='display-tight text-[13vw] leading-none text-acid md:text-[7vw]'>
                        Alchemy
                    </span>
                </div>
            </div>
        </ReadyProvider>
    )
}
