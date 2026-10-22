import type { FC, ReactNode } from 'react'
import type { GetStaticPaths, GetStaticProps } from 'next'
import type { Project } from '@/types'

import Link from 'next/link'

import { gsap } from '@/lib/gsap'
import { useGsapContext } from '@/hooks/use-gsap'
import { Seo } from '@/components/generals/seo'
import { AcidButton } from '@/components/generals/acid-button'
import { CurtainMedia } from '@/components/motion/curtain-media'
import { Parallax } from '@/components/motion/media'
import { Marquee } from '@/components/motion/marquee'
import {
    CharsIn,
    WordsIn,
    LinesIn,
    ScrubChars,
    Reveal,
    DrawLine
} from '@/components/motion/reveal'

import { projects, getProject, getOtherProjects } from '@/constants/projects'
import { socialLinks } from '@/constants/navigation'

interface ProjectPageProps {
    project: Project
    others: Project[]
}

/* ── S1 Hero ─────────────────────────────────────────────────────────── */

const Hero: FC<{ project: Project }> = ({ project }): ReactNode => {
    const scope = useGsapContext<HTMLElement>(() => {
        const media = scope.current?.querySelector('[data-hero-media]')

        if (!media) return

        gsap.to(media, {
            yPercent: 14,
            ease: 'none',
            scrollTrigger: {
                trigger: scope.current,
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        })
    }, [project.slug])

    return (
        <section
            id='project-hero'
            ref={scope}
            className='relative isolate flex min-h-[92vh] flex-col justify-between overflow-hidden bg-ink edge-x pb-10 pt-[18vh] text-bone md:min-h-screen'
        >
            <div data-hero-media className='absolute inset-0 -z-10 scale-110'>
                <CurtainMedia
                    src={project.hero}
                    video={project.heroVideo}
                    alt={project.title}
                    mask='#050609'
                    curtain='wipe-left'
                    zoom={1.25}
                    priority
                    className='size-full'
                    imageClassName='opacity-70'
                />

                <div className='absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/25 to-ink' />
            </div>

            <div className='flex items-start justify-between gap-8'>
                <div>
                    <Reveal y={18} trigger='load' delay={0.5}>
                        <p className='label-mono text-acid'>INDX</p>
                    </Reveal>

                    <WordsIn
                        text={project.subtitle}
                        trigger='load'
                        delay={0.6}
                        className='mt-2 max-w-[24ch] text-[16px] font-semibold uppercase leading-[1.25] tracking-[-0.04em]'
                    />
                </div>

                <Reveal y={18} trigger='load' delay={0.55}>
                    <p className='display-tight text-[clamp(38px,5vw,64px)] text-bone'>
                        {project.released.slice(-4)}
                    </p>
                </Reveal>
            </div>

            <h1 className='display-tight my-auto py-[6vh] text-[clamp(56px,11.5vw,168px)]'>
                <CharsIn
                    text={project.titleLines[0]}
                    trigger='load'
                    delay={0.35}
                    stagger={0.035}
                    className='text-bone'
                />

                <CharsIn
                    text={project.titleLines[1]}
                    trigger='load'
                    delay={0.5}
                    stagger={0.035}
                    className='text-acid'
                />
            </h1>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-end'>
                <div>
                    <Reveal y={14} trigger='load' delay={0.75}>
                        <p className='label-mono text-bone/70'>Inspiration</p>
                    </Reveal>

                    <WordsIn
                        text={project.description}
                        trigger='load'
                        delay={0.82}
                        stagger={0.02}
                        className='mt-3 max-w-[52ch] text-[clamp(16px,1.5vw,20px)] font-semibold leading-[1.15] tracking-[-0.06em] text-acid'
                    />
                </div>

                <Reveal y={14} trigger='load' delay={0.9}>
                    <p className='label-mono text-bone/70'>Released</p>
                </Reveal>
            </div>
        </section>
    )
}

/* ── S2 Project info ─────────────────────────────────────────────────── */

const ProjectInfo: FC<{ project: Project }> = ({ project }): ReactNode => {
    const meta = [
        { label: 'TYPE OF WORK', value: project.tags.join('\n') },
        { label: 'CLIENT', value: `${project.clientName}\n${project.clientType}` },
        { label: 'TIMEFRAME', value: project.timeframe },
        { label: 'RELEASED', value: project.released }
    ]

    return (
        <section
            id='project-info'
            className='relative bg-bone edge-x py-[12vh] text-ink'
        >
            <div className='grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8'>
                <div className='lg:col-span-3'>
                    <Reveal y={14} className='mb-5'>
                        <span className='label-cased text-dust'>
                            (Project)
                        </span>
                    </Reveal>

                    <h2 className='display-tight text-[clamp(42px,6.4vw,70px)]'>
                        <CharsIn text={project.titleLines[0]} stagger={0.026} />
                        <CharsIn
                            text={project.titleLines[1]}
                            stagger={0.026}
                            delay={0.1}
                        />
                    </h2>

                    <WordsIn
                        text={project.subtitle}
                        delay={0.2}
                        className='mt-5 max-w-[32ch] text-[16px] font-bold uppercase leading-[1.25] tracking-[-0.04em]'
                    />
                </div>

                <div className='lg:col-span-8 lg:col-start-5'>
                    <WordsIn
                        text={project.summary}
                        stagger={0.035}
                        className='text-[clamp(26px,3.4vw,40px)] font-bold uppercase leading-[1.02] tracking-[-0.04em]'
                    />

                    <Reveal y={20} delay={0.24} className='mt-9 inline-block'>
                        <a
                            href={project.liveUrl}
                            target='_blank'
                            rel='noreferrer'
                            data-cursor='link'
                            className='group inline-flex flex-col'
                        >
                            <span className='flex items-center gap-3 text-[20px] font-semibold uppercase leading-[1.2] tracking-[-0.06em]'>
                                Explore live site
                                <span className='block h-[2px] w-8 bg-ink transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-14' />
                            </span>

                            <span className='label-mono mt-2 text-dust'>
                                ORIGINAL EXPERIENCE
                            </span>
                        </a>
                    </Reveal>
                </div>
            </div>

            <div
                aria-hidden='true'
                className='my-[8vh] h-[54px] w-full'
                style={{
                    backgroundImage:
                        'url(/images/j7IGyKYlQnwysfHEQ9SwlpNuWG4.svg)',
                    backgroundRepeat: 'repeat',
                    backgroundSize: '11px auto'
                }}
            />

            <Reveal
                y={100}
                duration={1.3}
                start='top 88%'
                className='grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4'
            >
                {meta.map((item) => (
                    <div key={item.label}>
                        <p className='whitespace-pre-line text-[16px] font-semibold leading-[1.15] tracking-[-0.04em]'>
                            {item.value}
                        </p>

                        <div className='my-3 h-px w-full bg-smoke' />

                        <p className='label-mono text-smoke'>{item.label}</p>
                    </div>
                ))}
            </Reveal>
        </section>
    )
}

/* ── S3 Introduction ─────────────────────────────────────────────────── */

const Introduction: FC<{ project: Project }> = ({ project }): ReactNode => (
    <section
        id='project-introduction'
        className='relative overflow-hidden bg-ink edge-x py-[16vh] text-bone'
    >
        <Parallax
            speed={9}
            className='pointer-events-none absolute inset-0 -z-0 opacity-[0.08]'
        >
            <div
                className='grain-layer size-full scale-150'
                aria-hidden='true'
            />
        </Parallax>

        <div className='relative'>
            <Reveal y={14} className='mb-8'>
                <span className='label-cased text-dust'>
                    (Introduction)
                </span>
            </Reveal>

            <ScrubChars
                as='h3'
                text={project.introduction}
                className='max-w-[26ch] text-[clamp(28px,4.4vw,56px)] font-semibold leading-[1.06] tracking-[-0.04em] text-bone'
            />
        </div>
    </section>
)

/* ── S4 Approach ─────────────────────────────────────────────────────── */

const Approach: FC<{ project: Project }> = ({ project }): ReactNode => (
    <section
        id='project-approach'
        className='bg-bone edge-x py-[12vh] text-ink'
    >
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8'>
            <div className='lg:col-span-6'>
                <Reveal y={14} className='mb-5'>
                    <span className='label-cased text-dust'>
                        (Approach)
                    </span>
                </Reveal>

                <WordsIn
                    as='h3'
                    text={project.approach[0]}
                    stagger={0.04}
                    className='text-[clamp(24px,3vw,32px)] font-bold uppercase leading-[1.02] tracking-[-0.06em]'
                />

                <WordsIn
                    text={project.approach[1]}
                    delay={0.16}
                    stagger={0.028}
                    className='mt-7 max-w-[44ch] text-[16px] font-bold uppercase leading-[1.25] tracking-[-0.04em]'
                />

                <WordsIn
                    text={project.approach[2]}
                    delay={0.26}
                    stagger={0.016}
                    className='mt-7 max-w-[52ch] text-[16px] font-semibold leading-[1.3] tracking-[-0.04em] text-dust'
                />
            </div>

            <div className='lg:col-span-5 lg:col-start-8'>
                <CurtainMedia
                    src={project.approachImage.src}
                    alt={project.approachImage.alt}
                    caption={project.approachImage.caption}
                    sublabel={project.title}
                    mask='#f2f2f2'
                    className='aspect-[5/7] w-full'
                />

                <DrawLine color='#4a4a4a' className='mt-5' />

                <WordsIn
                    text={project.approachNote}
                    delay={0.1}
                    stagger={0.02}
                    className='mt-3 max-w-[44ch] text-[12px] font-semibold leading-[1.35] tracking-[-0.03em] text-graphite'
                />
            </div>
        </div>
    </section>
)

/* ── S5 Challenge ────────────────────────────────────────────────────── */

const Challenge: FC<{ project: Project }> = ({ project }): ReactNode => (
    <section
        id='project-challenge'
        className='bg-bone edge-x pb-[12vh] text-ink'
    >
        <Reveal y={14} className='mb-5'>
            <span className='label-cased text-dust'>
                (Challenge)
            </span>
        </Reveal>

        <CharsIn
            as='h2'
            text={project.challengeHeadline}
            stagger={0.012}
            duration={1}
            className='display-tight max-w-[18ch] text-[clamp(38px,6.4vw,70px)]'
        />

        <WordsIn
            text={project.challengeBody}
            delay={0.2}
            stagger={0.024}
            className='mt-8 max-w-[58ch] text-[16px] font-bold uppercase leading-[1.25] tracking-[-0.04em]'
        />

        <div className='mt-[8vh] grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5'>
            {project.challengeImages.map((image, index) => (
                <Parallax
                    key={image.src}
                    speed={index === 1 ? -9 : 7}
                    className={index === 1 ? 'md:pt-[12%]' : undefined}
                >
                    <CurtainMedia
                        src={image.src}
                        alt={image.alt}
                        caption={image.caption}
                        sublabel={project.title}
                        mask='#f2f2f2'
                        curtain={index === 1 ? 'inverted' : 'split'}
                        className='aspect-[3/4] w-full'
                    />
                </Parallax>
            ))}
        </div>
    </section>
)

/* ── S6 Solution ─────────────────────────────────────────────────────── */

const Solution: FC<{ project: Project }> = ({ project }): ReactNode => (
    <section
        id='project-solution'
        className='bg-bone edge-x pb-[14vh] text-ink'
    >
        <div className='grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-6'>
            <div className='lg:col-span-3'>
                <Reveal y={14} className='mb-5'>
                    <span className='label-cased text-dust'>
                        (Solution)
                    </span>
                </Reveal>

                <WordsIn
                    as='h3'
                    text={project.solution[0]}
                    stagger={0.032}
                    className='text-[clamp(22px,2.4vw,32px)] font-bold uppercase leading-[1.03] tracking-[-0.06em]'
                />

                <WordsIn
                    text={project.solution[1]}
                    delay={0.18}
                    stagger={0.02}
                    className='mt-6 text-[16px] font-bold uppercase leading-[1.25] tracking-[-0.04em]'
                />

                <p className='mt-7 whitespace-pre-line text-[16px] font-semibold leading-[1.15] tracking-[-0.04em] text-dust'>
                    {project.tags.join('\n')}
                </p>
            </div>

            <Parallax speed={10} className='lg:col-span-3'>
                <CurtainMedia
                    src={project.solutionImages[0].src}
                    alt={project.solutionImages[0].alt}
                    caption={project.solutionImages[0].caption}
                    sublabel={project.title}
                    mask='#f2f2f2'
                    curtain='wipe-down'
                    className='aspect-[3/4] w-full'
                />
            </Parallax>

            <Parallax speed={-6} className='lg:col-span-3 lg:pt-[18%]'>
                <CurtainMedia
                    src={project.solutionImages[1].src}
                    alt={project.solutionImages[1].alt}
                    caption={project.solutionImages[1].caption}
                    sublabel={project.title}
                    mask='#f2f2f2'
                    curtain='wipe-down'
                    className='aspect-[4/3] w-full'
                />
            </Parallax>

            <div className='lg:col-span-3'>
                <WordsIn
                    as='h4'
                    text={project.solutionClose}
                    stagger={0.03}
                    className='text-[clamp(24px,2.8vw,40px)] font-bold uppercase leading-[1.02] tracking-[-0.04em]'
                />

                <WordsIn
                    text={project.description}
                    delay={0.18}
                    stagger={0.016}
                    className='mt-6 text-[18px] font-semibold leading-[1.2] tracking-[-0.04em] text-dust'
                />
            </div>
        </div>
    </section>
)

/* ── S7 Achievements ─────────────────────────────────────────────────── */

const Achievements: FC<{ project: Project }> = ({ project }): ReactNode => (
    <section
        id='project-achievements'
        className='bg-bone edge-x pb-[14vh] text-ink'
    >
        <div className='grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8'>
            <div className='lg:col-span-6'>
                <Reveal y={14} className='mb-5'>
                    <span className='label-cased text-dust'>
                        (Achievements)
                    </span>
                </Reveal>

                <WordsIn
                    as='h3'
                    text={project.achievements}
                    stagger={0.038}
                    className='text-[clamp(24px,3vw,32px)] font-bold uppercase leading-[1.02] tracking-[-0.06em]'
                />

                <DrawLine color='#050609' className='my-6' />

                <WordsIn
                    text={project.achievementsBody}
                    delay={0.14}
                    stagger={0.022}
                    className='max-w-[52ch] text-[16px] font-bold uppercase leading-[1.25] tracking-[-0.04em]'
                />
            </div>

            <Parallax speed={8} className='lg:col-span-5 lg:col-start-8'>
                <CurtainMedia
                    src={project.challengeImages[0].src}
                    alt={project.challengeImages[0].alt}
                    mask='#f2f2f2'
                    className='aspect-[4/3] w-full'
                />
            </Parallax>
        </div>

        <div className='mt-[10vh] grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8'>
            <div className='relative isolate overflow-hidden lg:col-span-4'>
                <CurtainMedia
                    src={project.testimonial.photo}
                    alt={`${project.title} project detail`}
                    mask='#f2f2f2'
                    className='absolute inset-0 -z-10 size-full'
                    imageClassName='opacity-35'
                />

                <div className='relative bg-bone/55 p-7 backdrop-blur-[2px]'>
                    <WordsIn
                        as='h5'
                        text='In Her Words'
                        stagger={0.05}
                        className='text-[20px] font-semibold uppercase leading-[1.2] tracking-[-0.06em] text-hairline'
                    />

                    <DrawLine color='#050609' className='my-5' />

                    <Reveal y={50} duration={1.2}>
                        <p className='text-[14px] font-semibold leading-[1.45] tracking-[-0.04em]'>
                            {project.testimonial.quote}
                        </p>
                    </Reveal>

                    <div className='mt-6'>
                        <WordsIn
                            text={project.testimonial.name}
                            delay={0.1}
                            className='text-[14px] font-semibold tracking-[-0.04em] text-graphite'
                        />

                        <WordsIn
                            text={project.testimonial.company}
                            delay={0.16}
                            className='label-mono mt-1 text-dust'
                        />
                    </div>
                </div>
            </div>

            <Reveal
                y={100}
                duration={1.3}
                className='flex flex-col gap-8 lg:col-span-7 lg:col-start-6'
            >
                {project.highlights.map((highlight) => (
                    <div key={highlight.title}>
                        <h5 className='text-[20px] font-semibold uppercase leading-[1.2] tracking-[-0.06em]'>
                            {highlight.title}
                        </h5>

                        <div className='my-3 h-px w-full bg-smoke' />

                        <p className='max-w-[56ch] text-[16px] font-bold uppercase leading-[1.25] tracking-[-0.04em] text-dust'>
                            {highlight.body}
                        </p>
                    </div>
                ))}
            </Reveal>
        </div>
    </section>
)

/* ── S8 Final product ────────────────────────────────────────────────── */

const FinalProduct: FC<{ project: Project }> = ({ project }): ReactNode => {
    const scope = useGsapContext<HTMLElement>(() => {
        const headline = scope.current?.querySelector('[data-final-headline]')

        if (!headline) return

        gsap.fromTo(
            headline,
            { y: 280 },
            {
                y: -40,
                ease: 'none',
                scrollTrigger: {
                    trigger: scope.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            }
        )
    }, [project.slug])

    return (
        <section
            id='project-final'
            ref={scope}
            className='relative isolate flex min-h-[92vh] flex-col justify-end overflow-hidden bg-ink edge-x py-[12vh] text-bone'
        >
            <CurtainMedia
                src={project.hero}
                video={project.heroVideo}
                alt={project.title}
                mask='#050609'
                zoom={1.4}
                className='absolute inset-0 -z-10 size-full'
                imageClassName='opacity-55'
            />

            <div className='absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/40 to-transparent' />

            <div
                data-final-headline
                className='will-change-transform'
            >
                <h2 className='display-tight text-[clamp(52px,11vw,160px)]'>
                    <span className='block'>{project.titleLines[0]}</span>
                    <span className='block'>{project.titleLines[1]}</span>
                </h2>
            </div>

            <div className='mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12'>
                <WordsIn
                    as='h4'
                    text={project.description}
                    stagger={0.026}
                    className='text-[clamp(22px,2.8vw,40px)] font-bold uppercase leading-[1.03] tracking-[-0.04em] lg:col-span-8'
                />

                <div className='lg:col-span-3 lg:col-start-10 lg:justify-self-end'>
                    <Reveal y={22} delay={0.14}>
                        <AcidButton label='Live project' href='/contact' />
                    </Reveal>
                </div>
            </div>
        </section>
    )
}

/* ── S9 Share ────────────────────────────────────────────────────────── */

const Share: FC<{ project: Project }> = ({ project }): ReactNode => (
    <section
        id='project-share'
        className='bg-ink edge-x py-14 text-bone'
    >
        <div className='flex flex-col gap-6 border-y border-hairline py-7 sm:flex-row sm:items-center sm:justify-between'>
            <WordsIn
                as='h6'
                text='FOLLOW THE WORK'
                stagger={0.04}
                className='text-[18px] font-semibold tracking-[-0.04em]'
            />

            <div className='flex flex-wrap gap-x-6 gap-y-2'>
                {socialLinks.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        target='_blank'
                        rel='noreferrer'
                        data-cursor='link'
                        aria-label={`Share ${project.title} on ${link.label}`}
                        className='label-mono text-dust transition-colors duration-300 hover:text-acid'
                    >
                        {link.label}
                    </a>
                ))}
            </div>
        </div>
    </section>
)

/* ── S10 More projects ───────────────────────────────────────────────── */

const MoreProjects: FC<{ others: Project[] }> = ({ others }): ReactNode => (
    <section id='more-projects' className='bg-ink pb-[10vh] text-bone'>
        <div className='overflow-hidden py-6'>
            <Marquee speed={30} repeat={4}>
                <span className='display-tight px-8 text-[clamp(44px,8vw,120px)] text-acid'>
                    More projects
                </span>

                <span
                    aria-hidden='true'
                    className='display-tight px-8 text-[clamp(44px,8vw,120px)] text-hairline'
                >
                    More projects
                </span>
            </Marquee>
        </div>

        <div
            aria-hidden='true'
            className='mx-auto h-[40px] w-full'
            style={{
                backgroundImage:
                    'url(/images/j7IGyKYlQnwysfHEQ9SwlpNuWG4.svg)',
                backgroundRepeat: 'repeat',
                backgroundSize: '11px auto',
                opacity: 0.35
            }}
        />

        <div className='mt-[6vh] grid grid-cols-1 gap-px bg-hairline sm:grid-cols-2'>
            {others.map((other, index) => (
                <Link
                    key={other.slug}
                    href={`/work/${other.slug}`}
                    data-cursor='view'
                    className='group flex flex-col gap-5 bg-ink p-5 transition-colors duration-500 hover:bg-ink-soft md:p-7'
                >
                    <CurtainMedia
                        src={other.hero}
                        video={other.heroVideo}
                        alt={other.title}
                        mask='#050609'
                        staticZoom={1.05}
                        className='aspect-[16/10] w-full'
                        imageClassName='transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]'
                    />

                    <div>
                        <LinesIn
                            as='h3'
                            lines={other.titleLines}
                            stagger={0.07}
                            className='display-tight text-[clamp(26px,3vw,32px)]'
                        />

                        <WordsIn
                            text={other.subtitle}
                            delay={0.12}
                            stagger={0.02}
                            className='mt-3 max-w-[36ch] text-[16px] font-bold uppercase leading-[1.25] tracking-[-0.04em] text-smoke'
                        />
                    </div>

                    <div className='mt-auto'>
                        <p className='whitespace-pre-line text-[14px] font-semibold leading-[1.3] tracking-[-0.04em] text-dust'>
                            {other.tags.join('\n')}
                        </p>

                        <div className='my-3 h-px w-full bg-hairline transition-colors duration-500 group-hover:bg-acid' />

                        <p className='label-mono text-dust'>
                            {other.date} — {String(index + 1).padStart(2, '0')}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    </section>
)

/* ── Page ────────────────────────────────────────────────────────────── */

const ProjectPage: FC<ProjectPageProps> = ({ project, others }): ReactNode => {
    return (
        <>
            <Seo
                title={project.title}
                description={project.description}
                ogImage={project.hero}
            />

            <main>
                <Hero project={project} />
                <ProjectInfo project={project} />
                <Introduction project={project} />
                <Approach project={project} />
                <Challenge project={project} />
                <Solution project={project} />
                <Achievements project={project} />
                <FinalProduct project={project} />
                <Share project={project} />
                <MoreProjects others={others} />
            </main>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => ({
    paths: projects.map((project) => ({ params: { slug: project.slug } })),
    fallback: false
})

export const getStaticProps: GetStaticProps<ProjectPageProps> = async ({
    params
}) => {
    const slug = params?.slug as string
    const project = getProject(slug)

    if (!project) return { notFound: true }

    return {
        props: {
            project,
            others: [...getOtherProjects(slug)]
        }
    }
}

export default ProjectPage
