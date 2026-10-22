import type { FC, ReactNode } from 'react'

import { X } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '@/lib/motion/gsap'
import { startScroll, stopScroll } from '@/lib/motion/lenis'
import { pad } from '@/lib/format'
import { Logo } from '@/components/generals/logo'
import { TransitionLink } from '@/components/generals/transition-link'
import { navigation, siteConfig } from '@/constants/site'

interface MenuOverlayProps {
    open: boolean
    onClose: () => void
}

/** Full-screen navigation for phones and tablets. */
export const MenuOverlay: FC<MenuOverlayProps> = ({ open, onClose }): ReactNode => {
    const router = useRouter()
    const panelRef = useRef<HTMLDivElement>(null)
    const closeRef = useRef<HTMLButtonElement>(null)
    const firstRender = useRef(true)

    useEffect(() => {
        const panel = panelRef.current
        if (!panel) return

        const items = panel.querySelectorAll('[data-menu-item]')
        const reduced = prefersReducedMotion()

        if (firstRender.current) {
            firstRender.current = false
            gsap.set(panel, { autoAlpha: 0, clipPath: 'inset(0% 0% 100% 0%)' })
            return
        }

        if (open) {
            stopScroll()
            gsap.set(panel, { autoAlpha: 1 })

            gsap.timeline()
                .to(panel, { clipPath: 'inset(0% 0% 0% 0%)', duration: reduced ? 0 : 0.9, ease: 'expo.inOut' })
                .fromTo(items, { yPercent: 120 }, { yPercent: 0, duration: reduced ? 0 : 1.1, stagger: 0.06, ease: 'expo.out' }, reduced ? 0 : 0.35)

            closeRef.current?.focus()
        }
        else {
            gsap.timeline({ onComplete: () => { gsap.set(panel, { autoAlpha: 0 }) } })
                .to(panel, { clipPath: 'inset(0% 0% 100% 0%)', duration: reduced ? 0 : 0.7, ease: 'expo.inOut' })

            startScroll()
        }
    }, [open])

    useEffect(() => {
        if (!open) return

        const handleKey = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') onClose()
        }

        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [open, onClose])

    useEffect(() => {
        const handleRoute = (): void => onClose()

        router.events.on('routeChangeStart', handleRoute)
        return () => router.events.off('routeChangeStart', handleRoute)
    }, [router.events, onClose])

    return (
        <div
            ref={panelRef}
            id='site-menu'
            role='dialog'
            aria-modal='true'
            aria-label='Site menu'
            aria-hidden={!open}
            className='invisible fixed inset-0 z-[120] flex flex-col bg-ink text-bone lg:hidden'
        >
            <div className='nova-bloom pointer-events-none absolute -right-1/3 top-1/3 size-[120vw] opacity-30' aria-hidden='true' />

            <div className='gutter relative flex h-20 items-center justify-between md:h-24'>
                <span className='text-[1.05rem] md:text-[1.2rem]'>
                    <Logo />
                </span>

                <button
                    ref={closeRef}
                    type='button'
                    onClick={onClose}
                    className='flex h-10 items-center gap-2 text-sm'
                    tabIndex={open ? 0 : -1}
                >
                    Close
                    <X className='size-5' aria-hidden='true' />
                </button>
            </div>

            <nav aria-label='Mobile' className='gutter relative flex flex-1 flex-col justify-center gap-1'>
                {navigation.map((item, index) => (
                    <div key={item.href} className='overflow-hidden border-b border-bone/10 py-2'>
                        <TransitionLink
                            href={item.href}
                            data-menu-item=''
                            onClick={onClose}
                            tabIndex={open ? 0 : -1}
                            className='flex items-baseline justify-between gap-4'
                            aria-current={router.pathname === item.href ? 'page' : undefined}
                        >
                            <span className='font-wide text-[clamp(2.4rem,11vw,5.5rem)] font-semibold uppercase leading-[0.95] tracking-[-0.04em]'>
                                {item.label}
                            </span>

                            <span className='eyebrow text-stone'>
                                {pad(index + 1)}
                            </span>
                        </TransitionLink>
                    </div>
                ))}
            </nav>

            <div className='gutter relative grid grid-cols-2 gap-6 pb-10 pt-8 text-sm'>
                <div className='flex flex-col gap-1'>
                    <span className='eyebrow mb-2 text-stone'>
                        Studio
                    </span>
                    <a href={`mailto:${siteConfig.email}`} tabIndex={open ? 0 : -1} className='link-underline w-fit'>
                        {siteConfig.email}
                    </a>
                    <a href={siteConfig.phoneHref} tabIndex={open ? 0 : -1} className='link-underline w-fit'>
                        {siteConfig.phone}
                    </a>
                </div>

                <div className='flex flex-col gap-1'>
                    <span className='eyebrow mb-2 text-stone'>
                        Follow
                    </span>
                    {siteConfig.socials.slice(0, 3).map(social => (
                        <a
                            key={social.label}
                            href={social.href}
                            target='_blank'
                            rel='noreferrer'
                            tabIndex={open ? 0 : -1}
                            className='link-underline w-fit'
                        >
                            {social.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}
