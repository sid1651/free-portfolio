import type { FC, ReactNode } from 'react'

import { Seo } from '@/components/generals/seo'
import { CopyButton } from '@/components/generals/copy-button'
import { ContactForm } from '@/components/contact/contact-form'
import { CurtainMedia } from '@/components/motion/curtain-media'
import { Marquee } from '@/components/motion/marquee'
import { Parallax } from '@/components/motion/media'
import {
    CharsIn,
    WordsIn,
    LinesIn,
    TrackIn,
    Reveal,
    DrawLine
} from '@/components/motion/reveal'

import { studio } from '@/constants/site'
import { socialLinks } from '@/constants/navigation'

const ContactPage: FC = (): ReactNode => {
    return (
        <>
            <Seo
                title='Contact'
                description='Contact Siddharth about a portfolio, website, product experience or full stack application.'
                ogImage='/images/portfolio/hero-art.jpg'
            />

            <main id='contact'>
                {/* Section 01 — the ask */}
                <section
                    id='contact-hero'
                    className='relative isolate overflow-hidden bg-ink edge-x pb-[10vh] pt-[16vh] text-bone'
                >
                    <Parallax
                        speed={10}
                        className='absolute inset-0 -z-10 size-full'
                    >
                        <CurtainMedia
                            src='/images/portfolio/hero-art.jpg'
                            alt='Abstract black glass sculpture with warm light'
                            mask='#050609'
                            curtain='wipe-left'
                            zoom={1.2}
                            priority
                            className='size-full scale-110'
                            imageClassName='opacity-70'
                        />
                    </Parallax>

                    <div className='pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/70 to-ink/20' />

                    <div className='grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8'>
                        {/* Left */}
                        <div className='lg:col-span-6'>
                            <CharsIn
                                as='h1'
                                text='Contact me'
                                trigger='load'
                                delay={0.3}
                                stagger={0.04}
                                duration={1.25}
                                className='text-[clamp(52px,9.4vw,124px)] font-bold uppercase leading-[0.85] tracking-[-0.09em] text-acid'
                            />

                            <LinesIn
                                as='h2'
                                lines={[
                                    'websites, products,',
                                    'applications and ideas.',
                                    'let’s build something.'
                                ]}
                                trigger='load'
                                delay={0.52}
                                stagger={0.1}
                                className='mt-6 text-[clamp(26px,4.2vw,58px)] font-bold uppercase leading-[1.02] tracking-[-0.04em] text-ash'
                            />

                            <DrawLine
                                color='#4a4a4a'
                                trigger='load'
                                delay={0.85}
                                className='my-8 max-w-[560px]'
                            />

                            <TrackIn
                                text='Socials'
                                trigger='load'
                                delay={0.9}
                                fromTracking={0.5}
                                toTracking={0.06}
                                duration={1.4}
                                className='text-[16px] font-bold uppercase text-[#cccccc]'
                            />

                            <Reveal
                                y={18}
                                trigger='load'
                                delay={1}
                                staggerChildren
                                stagger={0.06}
                                className='mt-4 flex flex-wrap gap-x-7 gap-y-3'
                            >
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        target='_blank'
                                        rel='noreferrer'
                                        data-cursor='link'
                                        className='group relative block overflow-hidden text-[14px] font-bold uppercase tracking-[-0.04em] text-ash'
                                    >
                                        <span className='block transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full'>
                                            {link.label}
                                        </span>

                                        <span
                                            aria-hidden='true'
                                            className='absolute inset-0 block translate-y-full text-acid transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0'
                                        >
                                            {link.label}
                                        </span>
                                    </a>
                                ))}
                            </Reveal>
                        </div>

                        {/* Right */}
                        <div className='lg:col-span-5 lg:col-start-8'>
                            <Reveal y={22} trigger='load' delay={0.6}>
                                <p className='text-[clamp(22px,2.4vw,28px)] font-semibold leading-[1.2] tracking-[-0.06em]'>
                                    <span className='text-acid'>
                                        {studio.artist}
                                    </span>{' '}
                                    <span className='text-bone'>
                                        / {studio.brand}
                                    </span>
                                </p>

                                <p className='mt-1 text-[14px] font-semibold tracking-[-0.04em] text-bone'>
                                    {studio.role}
                                </p>
                            </Reveal>

                            <WordsIn
                                as='h3'
                                text='Available for portfolio sites, product experiences and full stack builds. Send the brief, the timeline and what you want the experience to do.'
                                trigger='load'
                                delay={0.72}
                                stagger={0.024}
                                className='mt-6 max-w-[46ch] text-[18px] font-semibold leading-[1.35] tracking-[-0.04em] text-ash'
                            />

                            <Reveal y={26} trigger='load' delay={0.88} className='mt-10'>
                                <ContactForm />
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* Section 02 — the direct line */}
                <section
                    id='contact-direct'
                    className='bg-bone edge-x py-[12vh] text-ink'
                >
                    <div className='grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8'>
                        <div className='lg:col-span-4'>
                            <Reveal y={14} className='mb-5'>
                                <span className='label-cased text-dust'>
                                    (Direct)
                                </span>
                            </Reveal>

                            <WordsIn
                                as='h2'
                                text='Skip the form entirely.'
                                stagger={0.05}
                                className='max-w-[12ch] text-[clamp(30px,4vw,48px)] font-bold uppercase leading-[1.01] tracking-[-0.055em]'
                            />
                        </div>

                        <div className='lg:col-span-4'>
                            <DrawLine color='#292929' className='mb-6' />

                            <Reveal y={22} delay={0.08}>
                                <CopyButton
                                    value={studio.handle}
                                    label={studio.handle}
                                    copiedLabel='Handle copied!'
                                    className='text-[clamp(24px,2.6vw,30px)] font-semibold leading-[1.15] tracking-[-0.06em]'
                                />

                                <CopyButton
                                    value={studio.email}
                                    label={studio.email}
                                    copiedLabel='Email copied!'
                                    className='mt-2 text-[17px] font-semibold leading-[1.3] tracking-[-0.04em]'
                                />

                                <p className='label-mono mt-6 text-dust'>
                                    PROJECT ENQUIRIES / INDIA STANDARD TIME
                                </p>
                            </Reveal>
                        </div>

                        <div className='lg:col-span-4'>
                            <DrawLine color='#292929' className='mb-6' />

                            <Reveal y={22} delay={0.16}>
                                <p className='text-[18px] font-semibold tracking-[-0.04em]'>
                                    {studio.address[0]}
                                </p>

                                <address className='mt-3 not-italic font-mono text-[14px] uppercase leading-[1.5] tracking-[-0.04em]'>
                                    {studio.address.slice(1).map((line) => (
                                        <span key={line} className='block'>
                                            {line}
                                        </span>
                                    ))}
                                </address>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* Section 03 — the sign-off */}
                <section
                    id='contact-signoff'
                    className='relative overflow-hidden bg-acid py-[7vh] text-ink'
                >
                    <Marquee speed={34} repeat={5} direction='left'>
                        <span className='display-tight px-6 text-[clamp(40px,7vw,96px)]'>
                            Let’s talk
                        </span>

                        <span
                            aria-hidden='true'
                            className='display-tight px-6 text-[clamp(40px,7vw,96px)] text-transparent'
                            style={{ WebkitTextStroke: '1px #050609' }}
                        >
                            Let’s talk
                        </span>
                    </Marquee>
                </section>
            </main>
        </>
    )
}

export default ContactPage
