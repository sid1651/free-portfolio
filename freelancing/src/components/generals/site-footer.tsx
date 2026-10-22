import type { FC, ReactNode } from 'react'

import Link from 'next/link'
import { ArrowUp } from 'lucide-react'

import { gsap } from '@/lib/gsap'
import { useGsapContext } from '@/hooks/use-gsap'
import { getLenis } from '@/components/generals/smooth-scroll'
import { CopyButton } from '@/components/generals/copy-button'
import { Reveal, DrawLine } from '@/components/motion/reveal'

import { studio } from '@/constants/site'
import { footerNav, socialLinks } from '@/constants/navigation'

/* ── Link that pushes a lime-on-ink swap up from below ───────────────── */

interface FooterLinkProps {
    label: string
    href: string
    external?: boolean
}

const FooterLink: FC<FooterLinkProps> = ({
    label,
    href,
    external = false
}): ReactNode => {
    const content = (
        <>
            <span className='block transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full'>
                {label}
            </span>

            <span
                aria-hidden='true'
                className='absolute inset-0 flex translate-y-full items-center bg-ink px-[6px] text-acid transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0'
            >
                {label}
            </span>
        </>
    )

    const className =
        'group relative -mx-[6px] block overflow-hidden px-[6px] py-[3px] text-[15px] font-bold uppercase leading-[1.15] tracking-[-0.02em] text-ink'

    if (external) {
        return (
            <a
                href={href}
                target='_blank'
                rel='noreferrer'
                data-cursor='link'
                className={className}
            >
                {content}
            </a>
        )
    }

    return (
        <Link href={href} data-cursor='link' className={className}>
            {content}
        </Link>
    )
}

/* ── Footer ──────────────────────────────────────────────────────────── */

export const SiteFooter: FC = (): ReactNode => {
    const scope = useGsapContext<HTMLElement>(() => {
        const root = scope.current

        if (!root) return

        const letters = gsap.utils.toArray<HTMLElement>('[data-footer-letter]')
        const ticks = root.querySelector('[data-footer-ticks]')

        if (letters.length) {
            gsap.set(letters, { yPercent: 118 })

            gsap.to(letters, {
                yPercent: 0,
                ease: 'none',
                stagger: 0.06,
                scrollTrigger: {
                    trigger: root,
                    start: 'top 70%',
                    end: 'bottom bottom',
                    scrub: 0.8,
                    invalidateOnRefresh: true
                }
            })
        }

        if (ticks) {
            gsap.fromTo(
                ticks,
                { scaleY: 0.25, opacity: 0.35 },
                {
                    scaleY: 1,
                    opacity: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: root,
                        start: 'top bottom',
                        end: 'top 55%',
                        scrub: true
                    }
                }
            )
        }
    }, [])

    const toTop = () => {
        const lenis = getLenis()

        if (lenis) {
            lenis.scrollTo(0, { duration: 1.4 })
            return
        }

        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <footer
            id='site-footer'
            ref={scope}
            className='relative isolate overflow-hidden bg-acid text-ink'
        >
            <div
                data-footer-ticks
                aria-hidden='true'
                className='h-[46px] w-full origin-top'
                style={{
                    backgroundImage:
                        'repeating-linear-gradient(to right, #050609 0px, #050609 1px, transparent 1px, transparent 17px)'
                }}
            />

            <div className='edge-x pb-4 pt-12 md:pt-16'>
                <div className='grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8'>
                    {/* Name */}
                    <div className='md:col-span-4'>
                        <Reveal y={26} duration={1.2} start='top 92%'>
                            <p className='label-mono mb-3 text-ink/55'>
                                IDX/{studio.initials} — {studio.yearTo}
                            </p>

                            <p className='text-[clamp(34px,5.4vw,62px)] font-black leading-[0.92] tracking-[-0.05em]'>
                                {studio.artist}
                            </p>

                            <p className='mt-3 max-w-[30ch] text-[14px] font-semibold leading-[1.3] tracking-[-0.02em] text-ink/70'>
                                Independent full stack developer building
                                distinctive websites and useful applications.
                            </p>
                        </Reveal>
                    </div>

                    {/* Contact */}
                    <div className='md:col-span-4'>
                        <DrawLine color='#050609' className='mb-5 opacity-70' />

                        <Reveal y={24} delay={0.06} start='top 92%'>
                            <CopyButton
                                value={studio.handle}
                                label={studio.handle}
                                copiedLabel='Handle copied!'
                                className='text-[clamp(22px,2.4vw,28px)] font-semibold leading-[1.2] tracking-[-0.06em]'
                            />

                            <CopyButton
                                value={studio.email}
                                label={studio.email}
                                copiedLabel='Email copied!'
                                className='mt-1 text-[16px] font-semibold leading-[1.3] tracking-[-0.04em]'
                            />

                            <div className='mt-7'>
                                <p className='label-mono mb-2 text-ink/55'>
                                    {studio.address[0]}
                                </p>

                                <address className='not-italic text-[14px] font-semibold leading-[1.45] tracking-[-0.02em]'>
                                    {studio.address.slice(1).map((line) => (
                                        <span key={line} className='block'>
                                            {line}
                                        </span>
                                    ))}
                                </address>
                            </div>
                        </Reveal>
                    </div>

                    {/* Navigation */}
                    <div className='md:col-span-4'>
                        <DrawLine color='#050609' className='mb-5 opacity-70' />

                        <Reveal
                            y={24}
                            delay={0.12}
                            start='top 92%'
                            className='grid grid-cols-2 gap-x-6 gap-y-8'
                        >
                            <nav aria-label='Footer'>
                                <p className='label-mono mb-3 text-ink/55'>
                                    MENU
                                </p>

                                <div className='flex flex-col items-start gap-[2px]'>
                                    {footerNav.map((link) => (
                                        <FooterLink
                                            key={link.href}
                                            label={link.label}
                                            href={link.href}
                                        />
                                    ))}
                                </div>
                            </nav>

                            <nav aria-label='Social'>
                                <p className='label-mono mb-3 text-ink/55'>
                                    SOCIAL
                                </p>

                                <div className='flex flex-col items-start gap-[2px]'>
                                    {socialLinks.map((link) => (
                                        <FooterLink
                                            key={link.label}
                                            label={link.label}
                                            href={link.href}
                                            external
                                        />
                                    ))}
                                </div>
                            </nav>
                        </Reveal>
                    </div>
                </div>

                {/* Wordmark */}
                <div className='mt-14 md:mt-20'>
                    <h2
                        aria-label={studio.brand}
                        className='flex w-full justify-between overflow-hidden text-[25.4vw] font-black uppercase leading-[0.76] tracking-[-0.055em]'
                    >
                        {Array.from(studio.brand).map((letter, index) => (
                            <span
                                key={index}
                                aria-hidden='true'
                                className='inline-block overflow-hidden'
                            >
                                <span
                                    data-footer-letter
                                    className='inline-block will-change-transform'
                                >
                                    {letter}
                                </span>
                            </span>
                        ))}
                    </h2>
                </div>

                <div className='mt-2 flex flex-col gap-3 border-t border-ink/25 pt-3 sm:flex-row sm:items-center sm:justify-between'>
                    <p className='text-[12px] font-semibold tracking-[-0.03em]'>
                        {studio.copyright}
                    </p>

                    <button
                        type='button'
                        onClick={toTop}
                        data-cursor='link'
                        data-cursor-label='TOP'
                        aria-label='Back to top'
                        className='group flex items-center gap-2 self-start sm:self-auto'
                    >
                        <ArrowUp className='size-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1' />

                        <span className='label-mono'>BACK TO TOP</span>
                    </button>

                    <p className='label-mono text-ink/60'>
                        {studio.brand.toUpperCase()} / {studio.yearFrom}—
                        {studio.yearTo}
                    </p>
                </div>
            </div>
        </footer>
    )
}
