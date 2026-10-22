import type { FC, ReactNode } from 'react'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/generals/logo'
import { useSmoothScroll } from '@/components/generals/smooth-scroll'
import { NAV_LINKS } from '@/constants/site'

export const SiteNav: FC = (): ReactNode => {
    const [scrolled, setScrolled] = useState(false)
    const [hidden, setHidden] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [active, setActive] = useState<string | null>(null)
    const lenis = useSmoothScroll()
    const menuButtonRef = useRef<HTMLButtonElement>(null)
    const firstLinkRef = useRef<HTMLAnchorElement>(null)
    const wasOpen = useRef(false)

    useEffect(() => {
        let lastY = window.scrollY
        let frame = 0

        const update = (): void => {
            frame = 0

            const y = window.scrollY

            setScrolled(y > 24)

            if (Math.abs(y - lastY) > 6) {
                setHidden(y > lastY && y > window.innerHeight * 0.9)
                lastY = y
            }
        }

        const onScroll = (): void => {
            if (!frame) frame = requestAnimationFrame(update)
        }

        update()
        window.addEventListener('scroll', onScroll, { passive: true })

        return () => {
            window.removeEventListener('scroll', onScroll)
            cancelAnimationFrame(frame)
        }
    }, [])

    useEffect(() => {
        const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-nav]'))
        const visible = new Map<Element, string>()

        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                const id = entry.target.getAttribute('data-nav') ?? ''

                if (entry.isIntersecting) visible.set(entry.target, id)
                else visible.delete(entry.target)
            }

            const ids = Array.from(visible.values())

            setActive(ids.length > 0 ? ids[ids.length - 1] : null)
        }, { rootMargin: '-45% 0px -54% 0px' })

        sections.forEach((section) => observer.observe(section))

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (menuOpen) {
            lenis?.stop()
            firstLinkRef.current?.focus()
            wasOpen.current = true
        } else {
            lenis?.start()

            if (wasOpen.current) {
                menuButtonRef.current?.focus()
                wasOpen.current = false
            }
        }
    }, [menuOpen, lenis])

    useEffect(() => {
        if (!menuOpen) return

        const onKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') setMenuOpen(false)
        }

        window.addEventListener('keydown', onKeyDown)

        return () => window.removeEventListener('keydown', onKeyDown)
    }, [menuOpen])

    const closeMenu = (): void => setMenuOpen(false)

    return (
        <header
            className={cn(
                'fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]',
                hidden && !menuOpen && '-translate-y-full'
            )}
        >
            <div
                aria-hidden
                className={cn(
                    'absolute inset-0 -z-10 border-b transition-[background-color,border-color,backdrop-filter] duration-500',
                    scrolled ? 'border-border/70 bg-background/75 backdrop-blur-xl' : 'border-transparent bg-transparent'
                )}
            />

            <nav aria-label='Main' className='mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:h-20 md:px-10'>
                <a href='#hero' aria-label='Arden, back to the top' className='rounded-full py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
                    <Logo />
                </a>

                <ul className='hidden items-center gap-1 lg:flex'>
                    {NAV_LINKS.map((link) => (
                        <li key={link.id}>
                            <a
                                href={link.href}
                                aria-current={active === link.id ? 'true' : undefined}
                                className='group relative inline-flex rounded-full px-4 py-2 text-sm text-foreground/65 transition-colors duration-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[current=true]:text-foreground'
                            >
                                {link.label}

                                <span
                                    aria-hidden
                                    className='absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-x-100 group-aria-[current=true]:scale-x-100'
                                />
                            </a>
                        </li>
                    ))}
                </ul>

                <div className='flex items-center gap-2'>
                    <a
                        href='#reserve'
                        className='group hidden h-10 items-center gap-2 rounded-full bg-foreground pl-5 pr-4 text-sm font-medium text-background transition-colors duration-300 hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:inline-flex'
                    >
                        Reserve
                        <ArrowRight className='size-4 transition-transform duration-300 group-hover:translate-x-0.5' />
                    </a>

                    <button
                        ref={menuButtonRef}
                        type='button'
                        onClick={() => setMenuOpen(true)}
                        aria-expanded={menuOpen}
                        aria-controls='mobile-menu'
                        className='grid size-10 place-items-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden'
                    >
                        <Menu className='size-5' />
                        <span className='sr-only'>
                            Open menu
                        </span>
                    </button>
                </div>
            </nav>

            <div
                id='mobile-menu'
                role='dialog'
                aria-modal='true'
                aria-label='Menu'
                inert={!menuOpen}
                className={cn(
                    'fixed inset-0 z-[60] flex h-[100dvh] flex-col bg-background transition-[opacity,visibility] duration-500 lg:hidden',
                    menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
                )}
            >
                <div className='flex h-16 items-center justify-between px-5'>
                    <Logo />

                    <button
                        type='button'
                        onClick={closeMenu}
                        className='grid size-10 place-items-center rounded-full border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                    >
                        <X className='size-5' />
                        <span className='sr-only'>
                            Close menu
                        </span>
                    </button>
                </div>

                <ul className='flex flex-1 flex-col justify-center gap-2 px-5'>
                    {NAV_LINKS.map((link, index) => (
                        <li
                            key={link.id}
                            className={cn(
                                'transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]',
                                menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                            )}
                            style={{ transitionDelay: menuOpen ? `${120 + index * 60}ms` : '0ms' }}
                        >
                            <a
                                ref={index === 0 ? firstLinkRef : undefined}
                                href={link.href}
                                onClick={closeMenu}
                                className='flex items-baseline gap-4 py-2 font-heading stretch-semi text-[2.6rem] font-medium leading-none tracking-[-0.04em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                            >
                                <span className='font-mono text-xs tracking-[0.2em] text-muted-foreground'>
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className='px-5 pb-8'>
                    <a
                        href='#reserve'
                        onClick={closeMenu}
                        className='flex h-14 w-full items-center justify-center gap-2 rounded-full bg-foreground text-base font-medium text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                    >
                        Reserve Arden Halo
                        <ArrowRight className='size-4' />
                    </a>
                </div>
            </div>
        </header>
    )
}
