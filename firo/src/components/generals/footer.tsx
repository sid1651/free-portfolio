import type { FC, ReactNode } from 'react'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { useReveal } from '@/hooks/use-reveal'
import { Logo, LogoMark } from '@/components/generals/logo'
import { Magnetic } from '@/components/generals/magnetic'
import { Marquee } from '@/components/generals/marquee'
import { TransitionLink } from '@/components/generals/transition-link'
import { Eyebrow } from '@/components/generals/section-heading'
import { SplitWords } from '@/components/generals/split-words'
import { ctaContent } from '@/constants/content'
import { filmStrip } from '@/constants/media'
import { navigation, siteConfig } from '@/constants/site'

interface FooterProps {
    showCta?: boolean
}

export const Footer: FC<FooterProps> = ({ showCta = true }): ReactNode => {
    const scope = useRef<HTMLElement>(null)

    useReveal(scope)

    return (
        <footer ref={scope} id='contact-cta' className='relative overflow-hidden bg-ink text-bone'>
            {showCta && (
                <section aria-labelledby='footer-cta-title' className='relative border-t border-bone/10'>
                    <div className='nova-bloom pointer-events-none absolute left-1/2 top-[18%] size-[95vw] -translate-x-1/2 opacity-25 md:size-[60vw]' aria-hidden='true' />

                    <div className='gutter relative pb-16 pt-24 md:pb-24 md:pt-36'>
                        <div className='flex flex-wrap items-center justify-between gap-4'>
                            <Eyebrow index='05' className='text-stone'>
                                Contact
                            </Eyebrow>

                            <span className='eyebrow text-stone'>
                                {ctaContent.eyebrow} / {siteConfig.name} / Since {siteConfig.founded}
                            </span>
                        </div>

                        <h2
                            id='footer-cta-title'
                            className='mt-10 max-w-[16ch] font-wide text-big font-semibold uppercase tracking-[-0.04em] md:mt-14'
                            data-reveal='words'
                        >
                            <SplitWords text='Start your next project with our' />{' '}
                            <SplitWords text='AI creative studio.' wordClassName='font-serif font-normal normal-case italic tracking-[-0.01em] text-flare' />
                        </h2>

                        <div className='mt-14 grid gap-12 md:mt-20 md:grid-cols-12 md:items-end'>
                            <div className='md:col-span-5'>
                                <Magnetic strength={0.25}>
                                    <TransitionLink
                                        href='/contact'
                                        data-cursor='Write'
                                        className='group relative flex size-40 items-center justify-center rounded-full bg-flare text-ink transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-105 md:size-52'
                                    >
                                        <span className='flex flex-col items-center gap-2 text-center'>
                                            <ArrowUpRight className='size-6 transition-transform duration-500 group-hover:rotate-45' aria-hidden='true' />
                                            <span className='font-wide text-sm font-semibold uppercase tracking-[-0.01em]'>
                                                {ctaContent.action}
                                            </span>
                                        </span>
                                    </TransitionLink>
                                </Magnetic>
                            </div>

                            <div className='grid gap-8 sm:grid-cols-2 md:col-span-7' data-reveal='stagger'>
                                <div className='flex flex-col gap-2 border-t border-bone/15 pt-5'>
                                    <span className='eyebrow text-stone'>
                                        {ctaContent.kicker}
                                    </span>
                                    <a href={`mailto:${siteConfig.email}`} className='link-underline w-fit text-lead'>
                                        {siteConfig.email}
                                    </a>
                                </div>

                                <div className='flex flex-col gap-2 border-t border-bone/15 pt-5'>
                                    <span className='eyebrow text-stone'>
                                        {siteConfig.hours}
                                    </span>
                                    <a href={siteConfig.phoneHref} className='link-underline w-fit text-lead'>
                                        {siteConfig.phone}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Marquee duration={55} className='border-y border-bone/10 py-4' pauseOnHover={false}>
                        {filmStrip.map((frame, index) => (
                            <figure key={frame.src} className='group relative mx-2 h-28 w-44 shrink-0 overflow-hidden md:h-36 md:w-56'>
                                <Image
                                    src={frame.src}
                                    alt={frame.alt}
                                    fill
                                    sizes='224px'
                                    className='object-cover grayscale transition duration-700 group-hover:grayscale-0'
                                />
                                <figcaption className='eyebrow absolute bottom-2 left-2 text-[0.6rem] text-bone/80'>
                                    Fr {String(index + 1).padStart(3, '0')}
                                </figcaption>
                            </figure>
                        ))}
                    </Marquee>
                </section>
            )}

            <div className='gutter relative grid gap-12 pb-10 pt-16 md:grid-cols-12 md:pt-24'>
                <div className='flex flex-col gap-6 md:col-span-4'>
                    <span className='text-xl'>
                        <Logo />
                    </span>

                    <p className='max-w-xs text-sm leading-relaxed text-stone'>
                        Creative studio merging human art direction with generative imagery, video, and motion.
                    </p>
                </div>

                <nav aria-label='Footer' className='flex flex-col gap-3 text-sm md:col-span-2'>
                    <span className='eyebrow mb-1 text-stone'>
                        Navigation
                    </span>

                    {navigation.map(item => (
                        <TransitionLink key={item.href} href={item.href} className='link-underline w-fit'>
                            {item.label}
                        </TransitionLink>
                    ))}
                </nav>

                <div className='flex flex-col gap-3 text-sm md:col-span-3'>
                    <span className='eyebrow mb-1 text-stone'>
                        Studio
                    </span>

                    <address className='not-italic leading-relaxed'>
                        {siteConfig.address.street}
                        <br />
                        {siteConfig.address.city},
                        <br />
                        {siteConfig.address.country}
                    </address>

                    <a href={`mailto:${siteConfig.email}`} className='link-underline w-fit'>
                        {siteConfig.email}
                    </a>

                    <a href={siteConfig.phoneHref} className='link-underline w-fit'>
                        {siteConfig.phone}
                    </a>
                </div>

                <div className='flex flex-col gap-3 text-sm md:col-span-3'>
                    <span className='eyebrow mb-1 text-stone'>
                        Follow us
                    </span>

                    {siteConfig.socials.map(social => (
                        <a key={social.label} href={social.href} target='_blank' rel='noreferrer' className='link-underline w-fit'>
                            {social.label}
                        </a>
                    ))}
                </div>
            </div>

            <div className='gutter relative'>
                <div className='flex items-end justify-between gap-4 overflow-hidden border-t border-bone/10 pt-6' aria-hidden='true'>
                    <span className='block select-none font-wide text-[clamp(4.5rem,20.5vw,22rem)] font-bold uppercase leading-[0.78] tracking-[-0.06em] text-bone'>
                        Novair
                    </span>

                    <LogoMark className='mb-[2vw] size-[9vw] shrink-0 text-flare' />
                </div>

                <div className='flex flex-col gap-3 py-8 text-xs text-stone md:flex-row md:items-center md:justify-between'>
                    <p>
                        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {siteConfig.name}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
