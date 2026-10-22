import type { FC, ReactNode } from 'react'

import { useRouter } from 'next/router'

import {
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react'

import { gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { cn } from '@/lib/utils'
import { pad } from '@/lib/format'
import { Clock } from '@/components/generals/clock'
import { Logo } from '@/components/generals/logo'
import { MenuOverlay } from '@/components/generals/menu-overlay'
import { TransitionLink } from '@/components/generals/transition-link'
import { navigation } from '@/constants/site'

const isActive = (pathname: string, href: string): boolean => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * Fixed header rendered in "difference" blend mode so it stays legible over any image.
 * It tucks away while scrolling down and returns on the way up.
 */
export const Header: FC = (): ReactNode => {
    const router = useRouter()
    const headerRef = useRef<HTMLElement>(null)
    const [menuOpen, setMenuOpen] = useState(false)
    const closeMenu = useCallback(() => setMenuOpen(false), [])

    useEffect(() => {
        const header = headerRef.current
        if (!header) return

        const hide = gsap.quickTo(header, 'yPercent', { duration: 0.6, ease: 'expo.out' })

        const trigger = ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate: (self) => {
                const scrolled = self.scroll()

                if (scrolled < 120) {
                    hide(0)
                    return
                }

                hide(self.direction === 1 ? -130 : 0)
            }
        })

        return () => {
            trigger.kill()
            gsap.set(header, { yPercent: 0 })
        }
    }, [])

    const links = navigation.filter(item => item.href !== '/')

    return (
        <>
            <a
                href='#main'
                className='sr-only z-[210] rounded-full bg-bone px-4 py-2 text-sm text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4'
            >
                Skip to content
            </a>

            <header
                ref={headerRef}
                className='gutter pointer-events-none fixed inset-x-0 top-0 z-[80] text-white mix-blend-difference'
            >
                <div className='flex h-20 items-center justify-between gap-6 md:h-24'>
                    <TransitionLink
                        href='/'
                        className='pointer-events-auto text-[1.05rem] md:text-[1.2rem]'
                        aria-label='NOVAIR Studio, back to home'
                    >
                        <Logo />
                    </TransitionLink>

                    <nav aria-label='Main' className='pointer-events-auto hidden items-center gap-9 lg:flex'>
                        {links.map((item, index) => {
                            const active = isActive(router.pathname, item.href)

                            return (
                                <TransitionLink
                                    key={item.href}
                                    href={item.href}
                                    className='group flex items-baseline gap-1.5 text-sm'
                                    aria-current={active ? 'page' : undefined}
                                >
                                    <span className='eyebrow text-[0.625rem] opacity-60'>
                                        {pad(index + 1)}
                                    </span>

                                    <span className={cn('link-underline', active && 'bg-[length:100%_1px]')}>
                                        {item.label}
                                    </span>
                                </TransitionLink>
                            )
                        })}
                    </nav>

                    <div className='pointer-events-auto flex items-center gap-6'>
                        <Clock className='eyebrow hidden opacity-70 xl:inline' />

                        <TransitionLink
                            href='/contact'
                            className='hidden h-10 items-center rounded-full border border-white/60 px-5 text-sm transition-colors duration-300 hover:bg-white hover:text-black lg:inline-flex'
                        >
                            Start a project
                        </TransitionLink>

                        <button
                            type='button'
                            className='flex h-10 items-center gap-3 text-sm lg:hidden'
                            aria-expanded={menuOpen}
                            aria-controls='site-menu'
                            onClick={() => setMenuOpen(true)}
                        >
                            Menu
                            <span className='flex w-6 flex-col gap-1.5' aria-hidden='true'>
                                <span className='h-px w-full bg-current' />
                                <span className='h-px w-2/3 self-end bg-current' />
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            <MenuOverlay open={menuOpen} onClose={closeMenu} />
        </>
    )
}
