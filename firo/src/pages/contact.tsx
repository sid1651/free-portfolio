import type { FC, ReactNode } from 'react'

import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { useRef } from 'react'
import { useIntro } from '@/hooks/use-intro'
import { useReveal } from '@/hooks/use-reveal'
import { Layout } from '@/components/generals/layout'
import { Media } from '@/components/generals/media'
import { Eyebrow } from '@/components/generals/section-heading'
import { Seo } from '@/components/generals/seo'
import { SplitWords } from '@/components/generals/split-words'
import { RecLabel, Viewfinder } from '@/components/generals/viewfinder'
import { Clock } from '@/components/generals/clock'
import { InquiryForm } from '@/components/contact/inquiry-form'
import { contactPageContent } from '@/constants/content'
import { media } from '@/constants/media'
import { siteConfig } from '@/constants/site'

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.country}`)}`

const channels = [
    {
        label: contactPageContent.channels[0].label,
        description: contactPageContent.channels[0].description,
        value: siteConfig.phone,
        href: siteConfig.phoneHref,
        icon: Phone,
        external: false
    },
    {
        label: contactPageContent.channels[1].label,
        description: contactPageContent.channels[1].description,
        value: siteConfig.email,
        href: `mailto:${siteConfig.email}`,
        icon: Mail,
        external: false
    },
    {
        label: contactPageContent.channels[2].label,
        description: `${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.country}`,
        value: 'Open in Maps',
        href: mapsUrl,
        icon: MapPin,
        external: true
    }
]

const ContactPage: FC = (): ReactNode => {
    const heroRef = useRef<HTMLElement>(null)
    const bodyRef = useRef<HTMLDivElement>(null)

    useIntro(heroRef, (timeline, root) => {
        timeline
            .from(root.querySelectorAll('[data-contact-title] [data-word]'), { yPercent: 120, duration: 1.5, stagger: 0.12 }, 0)
            .fromTo(root.querySelector('[data-contact-frame]'), { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 0 0)' }, { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0 0)', duration: 1.8, ease: 'expo.inOut' }, 0.15)
            .from(root.querySelectorAll('[data-contact-fade]'), { autoAlpha: 0, y: 26, duration: 1.2, stagger: 0.08 }, 0.6)
    })

    useReveal(heroRef)
    useReveal(bodyRef)

    return (
        <Layout showCta={false}>
            <Seo
                title='Contact'
                description='Start your next project with NOVAIR Studio. Tell us about your brand, campaign or vision and the studio will reply within 48 hours.'
                ogImage={media.contactHero.src}
            />

            <section ref={heroRef} id='contact-hero' aria-labelledby='contact-title' className='relative overflow-hidden bg-ink pb-24 pt-32 text-bone md:pb-32 md:pt-40'>
                <div className='nova-bloom pointer-events-none absolute -left-[25vw] top-[30%] size-[80vw] opacity-20' aria-hidden='true' />

                <div className='gutter relative'>
                    <div className='flex items-center justify-between gap-6' data-intro=''>
                        <span data-contact-fade=''>
                            <RecLabel label={contactPageContent.eyebrow} />
                        </span>

                        <Clock className='eyebrow text-stone' />
                    </div>

                    <div className='relative mt-12 md:mt-16'>
                        <h1 id='contact-title' className='relative z-10 text-white mix-blend-difference' data-intro='' data-contact-title=''>
                            <span className='block font-wide text-[clamp(3.4rem,17vw,20rem)] font-bold uppercase leading-[0.78] tracking-[-0.065em]'>
                                <SplitWords text={contactPageContent.lines[0]} />
                            </span>
                            <span className='mt-[1vw] block text-right font-serif text-[clamp(2.6rem,11.5vw,14rem)] italic leading-[0.9] tracking-[-0.03em]'>
                                <SplitWords text={contactPageContent.lines[1]} />
                            </span>
                        </h1>

                        <div
                            className='relative mx-auto mt-10 w-[70%] max-w-sm md:absolute md:left-[38%] md:top-[4%] md:mt-0 md:w-[19vw]'
                            data-intro=''
                            data-contact-frame=''
                        >
                            <Media
                                src={media.contactHero.src}
                                alt={media.contactHero.alt}
                                sizes='(min-width: 768px) 20vw, 70vw'
                                className='aspect-[3/4] rounded-t-full'
                                parallax={8}
                                position='50% 30%'
                                preload
                            />
                        </div>
                    </div>

                    <div className='mt-16 grid gap-10 md:mt-24 md:grid-cols-12' data-intro=''>
                        <div className='flex flex-col gap-4 md:col-span-5' data-contact-fade=''>
                            <span className='eyebrow text-flare'>
                                {contactPageContent.ideasLabel}
                            </span>
                            <p className='text-lead text-bone/90'>
                                {contactPageContent.ideasText}
                            </p>
                        </div>

                        <div className='flex items-end md:col-span-4 md:col-start-9 md:justify-end' data-contact-fade=''>
                            <a
                                href='#inquiry'
                                className='group inline-flex h-12 items-center gap-3 rounded-full bg-flare px-6 text-sm font-medium text-ink transition-colors duration-500 hover:bg-bone'
                            >
                                {contactPageContent.ideasAction}
                                <ArrowUpRight className='size-4 transition-transform duration-500 group-hover:rotate-45' aria-hidden='true' />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <div ref={bodyRef}>
                <section id='inquiry' aria-labelledby='inquiry-title' className='scroll-mt-24 bg-bone py-24 text-ink md:py-36'>
                    <div className='gutter grid gap-16 lg:grid-cols-12'>
                        <div className='flex flex-col gap-8 lg:col-span-4'>
                            <Eyebrow index='01' className='text-stone-deep'>
                                {contactPageContent.whyLabel}
                            </Eyebrow>

                            <h2 id='inquiry-title' className='font-wide text-[clamp(2.2rem,4.4vw,4.75rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]' data-reveal='words'>
                                <SplitWords text='Every great campaign starts with a' />{' '}
                                <SplitWords text='conversation.' wordClassName='font-serif font-normal normal-case italic tracking-[-0.02em]' />
                            </h2>

                            <p className='text-lead text-ink/85' data-reveal='fade'>
                                {contactPageContent.whySubtitle}
                            </p>

                            <p className='max-w-sm text-sm leading-relaxed text-ink/65' data-reveal='fade'>
                                {contactPageContent.whyDescription}
                            </p>

                            <div className='mt-4 hidden lg:block'>
                                <Media
                                    src={media.redLips.src}
                                    alt={media.redLips.alt}
                                    sizes='30vw'
                                    className='aspect-[4/5] max-w-xs'
                                    reveal
                                >
                                    <Viewfinder size='sm' />
                                </Media>
                            </div>
                        </div>

                        <div className='lg:col-span-7 lg:col-start-6'>
                            <InquiryForm />
                        </div>
                    </div>
                </section>

                <section id='channels' aria-labelledby='channels-title' className='bg-ink py-24 text-bone md:py-36'>
                    <div className='gutter'>
                        <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
                            <div className='flex flex-col gap-6'>
                                <Eyebrow index='02' className='text-stone'>
                                    Get in touch
                                </Eyebrow>
                                <h2 id='channels-title' className='font-wide text-big font-semibold uppercase tracking-[-0.05em]' data-reveal='words'>
                                    <SplitWords text='Talk to' />{' '}
                                    <SplitWords text='the studio.' wordClassName='font-serif font-normal normal-case italic tracking-[-0.02em] text-flare' />
                                </h2>
                            </div>

                            <p className='eyebrow text-stone' data-reveal='fade'>
                                {siteConfig.hours}
                            </p>
                        </div>

                        <ul className='mt-16 grid gap-px bg-bone/12 md:mt-24 md:grid-cols-3' data-reveal='stagger'>
                            {channels.map(channel => {
                                const Icon = channel.icon

                                return (
                                    <li key={channel.label} className='bg-ink'>
                                        <a
                                            href={channel.href}
                                            target={channel.external ? '_blank' : undefined}
                                            rel={channel.external ? 'noreferrer' : undefined}
                                            className='group flex h-full min-h-[18rem] flex-col justify-between gap-10 p-6 transition-colors duration-500 hover:bg-ink-soft md:p-8'
                                        >
                                            <div className='flex items-center justify-between'>
                                                <span className='flex size-12 items-center justify-center rounded-full border border-bone/20 transition-colors duration-500 group-hover:border-flare group-hover:bg-flare group-hover:text-ink'>
                                                    <Icon className='size-5' aria-hidden='true' />
                                                </span>
                                                <ArrowUpRight className='size-5 text-stone transition-transform duration-500 group-hover:rotate-45 group-hover:text-bone' aria-hidden='true' />
                                            </div>

                                            <div className='flex flex-col gap-3'>
                                                <span className='font-wide text-3xl font-semibold uppercase tracking-[-0.04em]'>
                                                    {channel.label}
                                                </span>
                                                <span className='text-sm leading-relaxed text-stone'>
                                                    {channel.description}
                                                </span>
                                                <span className='link-underline w-fit text-base text-bone'>
                                                    {channel.value}
                                                </span>
                                            </div>
                                        </a>
                                    </li>
                                )
                            })}
                        </ul>

                        <div className='mt-24 border-t border-bone/12 pt-10 md:mt-36'>
                            <span className='eyebrow text-stone'>
                                Or simply write to
                            </span>
                            <a
                                href={`mailto:${siteConfig.email}`}
                                className='group mt-6 block break-all font-wide text-[clamp(2rem,7.4vw,8.5rem)] font-semibold lowercase leading-[0.95] tracking-[-0.05em] transition-colors duration-500 hover:text-flare'
                                data-cursor='Write'
                            >
                                {siteConfig.email}
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    )
}

export default ContactPage
