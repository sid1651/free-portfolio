import type { FC, ReactNode } from 'react'

import { gsap } from '@/lib/gsap'
import { useGsapContext } from '@/hooks/use-gsap'
import { AcidButton } from '@/components/generals/acid-button'
import { CurtainMedia } from '@/components/motion/curtain-media'
import {
    CharsIn,
    WordsIn,
    LinesIn,
    Reveal,
    DrawLine
} from '@/components/motion/reveal'

import { about } from '@/constants/home'
import { studio } from '@/constants/site'
import { socialLinks } from '@/constants/navigation'

/**
 * Section 11 — About.
 *
 * The close. The portrait carries an RGB split that pulls apart on a loop and
 * snaps back, the skill list deals in from the right one row at a time, and
 * the quote rises as a single block against everything else moving per word.
 */
export const About: FC = (): ReactNode => {
    const scope = useGsapContext<HTMLElement>(() => {
        const root = scope.current

        if (!root) return

        const red = root.querySelector('[data-glitch="red"]')
        const cyan = root.querySelector('[data-glitch="cyan"]')

        if (!red || !cyan) return

        const timeline = gsap.timeline({ repeat: -1, repeatDelay: 2.4 })

        timeline
            .to(red, { x: -7, y: 2, duration: 0.09, ease: 'none' })
            .to(cyan, { x: 7, y: -2, duration: 0.09, ease: 'none' }, 0)
            .to([red, cyan], { x: 0, y: 0, duration: 0.14, ease: 'none' })
            .to(red, { x: 4, duration: 0.07, ease: 'none' })
            .to(cyan, { x: -4, duration: 0.07, ease: 'none' }, '<')
            .to([red, cyan], { x: 0, duration: 0.22, ease: 'power2.out' })
    }, [])

    return (
        <section
            id='about-me'
            ref={scope}
            className='bg-ink edge-x pb-[16vh] pt-[13vh] text-bone'
        >
            {/* Block 1 */}
            <div className='grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8'>
                <div className='lg:col-span-8'>
                    <Reveal y={14} className='mb-6'>
                        <span className='label-mono text-acid'>
                            {about.index}
                        </span>
                    </Reveal>

                    <h2 className='display-tight text-[clamp(38px,7vw,100px)]'>
                        <span className='block text-dust'>{about.intro}</span>

                        <CharsIn
                            text={about.name}
                            stagger={0.03}
                            className='text-bone'
                        />
                    </h2>

                    <WordsIn
                        text={about.subtitle}
                        delay={0.2}
                        stagger={0.03}
                        className='mt-6 max-w-[34ch] text-[clamp(16px,1.9vw,24px)] font-semibold leading-[1.25] tracking-[-0.04em] text-smoke'
                    />

                    <Reveal y={20} delay={0.28} className='mt-4'>
                        <span className='label-mono text-acid'>
                            {about.role}
                        </span>
                    </Reveal>
                </div>

                <div className='flex flex-col justify-end lg:col-span-3 lg:col-start-10'>
                    <DrawLine color='#292929' className='mb-6' />

                    <Reveal y={46} duration={1.3}>
                        <blockquote className='text-[16px] font-semibold leading-[1.4] tracking-[-0.03em] text-ash'>
                            {about.quote}
                        </blockquote>

                        <p className='label-mono mt-4 text-dust'>
                            {about.quoteAuthor}
                        </p>
                    </Reveal>
                </div>
            </div>

            <LinesIn
                as='p'
                lines={[about.summary, about.summaryNote]}
                stagger={0.1}
                start='top 86%'
                className='mt-[10vh] max-w-[22ch] text-[clamp(22px,3.4vw,46px)] font-black uppercase leading-[1.06] tracking-[-0.05em]'
            />

            {/* Block 2 */}
            <div className='mt-[12vh] grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8'>
                <div className='relative lg:col-span-6'>
                    <CurtainMedia
                        src={about.image}
                        alt='Abstract study of black glass and warm light'
                        mask='#050609'
                        zoom={1.25}
                        className='aspect-[4/5] w-full'
                    />

                    <img
                        data-glitch='red'
                        src={about.image}
                        alt=''
                        aria-hidden='true'
                        loading='lazy'
                        decoding='async'
                        className='pointer-events-none absolute inset-0 size-full object-cover opacity-45 mix-blend-screen will-change-transform'
                    />

                    <img
                        data-glitch='cyan'
                        src={about.image}
                        alt=''
                        aria-hidden='true'
                        loading='lazy'
                        decoding='async'
                        className='pointer-events-none absolute inset-0 size-full object-cover opacity-35 mix-blend-difference will-change-transform'
                    />
                </div>

                <div className='lg:col-span-6'>
                    <WordsIn
                        as='h3'
                        text={about.profile}
                        stagger={0.04}
                        className='text-[clamp(22px,2.8vw,36px)] font-black uppercase leading-[1.06] tracking-[-0.05em]'
                    />

                    <WordsIn
                        text={about.profileNote}
                        delay={0.14}
                        stagger={0.018}
                        className='mt-5 max-w-[48ch] text-[15px] font-semibold leading-[1.45] tracking-[-0.03em] text-dust'
                    />

                    <DrawLine color='#292929' className='my-8' />

                    <Reveal y={16} className='mb-4'>
                        <span className='label-mono text-dust'>SOCIALS</span>
                    </Reveal>

                    <Reveal
                        y={18}
                        delay={0.08}
                        staggerChildren
                        stagger={0.05}
                        className='flex flex-wrap gap-x-6 gap-y-2'
                    >
                        {socialLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                target='_blank'
                                rel='noreferrer'
                                data-cursor='link'
                                className='group relative block overflow-hidden text-[14px] font-bold uppercase tracking-[-0.04em] text-smoke'
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

                    <div className='mt-10'>
                        <Reveal y={16} className='mb-4'>
                            <span className='label-mono text-acid'>
                                {about.skillsLabel}
                            </span>
                        </Reveal>

                        <ul>
                            {about.skills.map((skill, index) => (
                                <li key={skill}>
                                    <DrawLine
                                        color='#292929'
                                        delay={index * 0.04}
                                    />

                                    <Reveal
                                        x={40}
                                        y={0}
                                        delay={index * 0.05}
                                        start='top 94%'
                                        className='py-[10px]'
                                    >
                                        <span className='flex items-baseline gap-4'>
                                            <span className='label-mono text-graphite'>
                                                {String(index + 1).padStart(
                                                    2,
                                                    '0'
                                                )}
                                            </span>

                                            <span className='text-[16px] font-bold uppercase tracking-[-0.04em]'>
                                                {skill}
                                            </span>
                                        </span>
                                    </Reveal>
                                </li>
                            ))}
                        </ul>

                        <DrawLine color='#292929' />
                    </div>

                    <Reveal y={24} delay={0.12} className='mt-10'>
                        <AcidButton label={about.cta} href='/work' />
                    </Reveal>
                </div>
            </div>

            <div className='mt-[10vh] flex flex-wrap items-baseline justify-between gap-4 border-t border-hairline pt-5'>
                <span className='label-mono text-dust'>
                    IDX/{studio.initials} — {studio.yearFrom}—{studio.yearTo}
                </span>

                <span className='label-mono text-acid'>
                    {studio.brand.toUpperCase()} / {about.index}
                </span>
            </div>
        </section>
    )
}
