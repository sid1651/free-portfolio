import type { FC, ReactNode } from 'react'
import type { Project } from '@/types'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { cms } from '@/lib/cms'
import { formatDate, pad } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useReveal } from '@/hooks/use-reveal'
import { PillLink } from '@/components/generals/arrow-link'
import { Eyebrow } from '@/components/generals/section-heading'
import { SplitWords } from '@/components/generals/split-words'
import { TransitionLink } from '@/components/generals/transition-link'
import { Viewfinder } from '@/components/generals/viewfinder'
import { selectedWorkContent } from '@/constants/content'

const panelLayouts = [
    { frame: 'aspect-[4/5] lg:h-[60vh]', wrapper: 'lg:self-start' },
    { frame: 'aspect-[3/4] lg:h-[48vh]', wrapper: 'lg:self-end lg:pb-[8vh]' },
    { frame: 'aspect-[4/5] lg:aspect-[5/4] lg:h-[52vh]', wrapper: 'lg:self-center' },
    { frame: 'aspect-[3/4] lg:h-[60vh]', wrapper: 'lg:self-start' }
]

interface ProjectPanelProps {
    project: Project
    index: number
    total: number
}

const ProjectPanel: FC<ProjectPanelProps> = ({ project, index, total }): ReactNode => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const layout = panelLayouts[index % panelLayouts.length]

    const play = (): void => {
        const video = videoRef.current
        if (!video) return

        video.play().catch(() => undefined)
        gsap.to(video, { autoAlpha: 1, duration: 0.6 })
    }

    const stop = (): void => {
        const video = videoRef.current
        if (!video) return

        gsap.to(video, { autoAlpha: 0, duration: 0.4, onComplete: () => video.pause() })
    }

    return (
        <article className={cn('flex w-[78vw] shrink-0 snap-start flex-col gap-5 sm:w-[58vw] lg:w-min', layout.wrapper)}>
            <TransitionLink
                href={`/projects/${project.slug}`}
                className='group relative block'
                data-cursor={project.video ? 'Play' : 'View'}
                onMouseEnter={play}
                onMouseLeave={stop}
                onFocus={play}
                onBlur={stop}
                aria-label={`View project ${project.title}`}
            >
                <div className={cn('relative overflow-hidden bg-ink-raised', layout.frame)}>
                    {project.cover && (
                        <Image
                            src={project.cover}
                            alt={project.cover_alt ?? project.title}
                            fill
                            sizes='(min-width: 1024px) 45vw, 78vw'
                            className='object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.06]'
                        />
                    )}

                    {project.video && (
                        <video
                            ref={videoRef}
                            className='invisible absolute inset-0 size-full object-cover opacity-0'
                            src={project.video}
                            muted
                            loop
                            playsInline
                            preload='none'
                            aria-hidden='true'
                        />
                    )}

                    <Viewfinder size='sm' className='opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

                    <span className='eyebrow absolute left-4 top-4 z-10 rounded-full bg-ink/60 px-3 py-1.5 text-bone backdrop-blur-sm'>
                        {pad(index + 1)} / {pad(total)}
                    </span>
                </div>
            </TransitionLink>

            <div className='flex items-start justify-between gap-6'>
                <div className='flex flex-col gap-3'>
                    <h3 className='font-wide text-[clamp(1.5rem,2.4vw,2.6rem)] font-semibold uppercase leading-[0.95] tracking-[-0.035em]'>
                        <TransitionLink href={`/projects/${project.slug}`} className='transition-colors hover:text-flare'>
                            <span data-mdlfy-cms={cms('projects', project.id, 'title')}>{project.title}</span>
                        </TransitionLink>
                    </h3>

                    <dl className='flex flex-wrap gap-x-6 gap-y-2 text-xs text-stone'>
                        {project.project_date && (
                            <div className='flex gap-2'>
                                <dt className='eyebrow text-bone/50'>Date</dt>
                                <dd>{formatDate(project.project_date)}</dd>
                            </div>
                        )}

                        {project.client && (
                            <div className='flex gap-2'>
                                <dt className='eyebrow text-bone/50'>Client</dt>
                                <dd data-mdlfy-cms={cms('projects', project.id, 'client')}>{project.client}</dd>
                            </div>
                        )}

                        {project.format && (
                            <div className='flex gap-2'>
                                <dt className='eyebrow text-bone/50'>Format</dt>
                                <dd data-mdlfy-cms={cms('projects', project.id, 'format')}>{project.format}</dd>
                            </div>
                        )}
                    </dl>
                </div>

                {project.logo && (
                    <img src={project.logo} alt={project.logo_alt ?? ''} className='mt-1 h-7 w-auto shrink-0 opacity-80' loading='lazy' />
                )}
            </div>
        </article>
    )
}

interface SelectedWorkProps {
    projects: Project[]
}

export const SelectedWork: FC<SelectedWorkProps> = ({ projects = [] }): ReactNode => {
    const scope = useRef<HTMLElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)

    useReveal(scope)

    useGSAP(() => {
        const section = scope.current
        const track = trackRef.current
        if (!section || !track) return

        const mm = gsap.matchMedia()

        mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
            const distance = (): number => Math.max(0, track.scrollWidth - window.innerWidth)

            const tween = gsap.to(track, {
                x: () => -distance(),
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: () => `+=${distance()}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    anticipatePin: 1
                }
            })

            const progress = section.querySelector('[data-progress]')

            if (progress) {
                gsap.fromTo(progress, { scaleX: 0 }, {
                    scaleX: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top top',
                        end: () => `+=${distance()}`,
                        scrub: true,
                        invalidateOnRefresh: true
                    }
                })
            }

            return () => tween.scrollTrigger?.kill()
        })

        return () => mm.revert()
    }, { scope, dependencies: [projects.length] })

    if (projects.length === 0) return null

    return (
        <section ref={scope} id='selected-work' aria-labelledby='selected-work-title' className='relative overflow-hidden bg-ink text-bone lg:h-screen'>
            <div className='flex h-full flex-col py-24 lg:py-0'>
                <div className='gutter flex items-center justify-between gap-6 lg:absolute lg:inset-x-0 lg:top-24 lg:z-10'>
                    <Eyebrow index='03' className='text-stone'>
                        Projects
                    </Eyebrow>

                    <div className='hidden h-px w-56 overflow-hidden bg-bone/15 lg:block' aria-hidden='true'>
                        <div className='h-full w-full origin-left bg-flare' data-progress='' />
                    </div>
                </div>

                <div
                    ref={trackRef}
                    className='no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[clamp(1.25rem,3.2vw,2.75rem)] pb-4 lg:mt-0 lg:h-full lg:snap-none lg:items-stretch lg:gap-[5vw] lg:overflow-visible lg:pb-0 lg:pt-36'
                    data-lenis-prevent-horizontal=''
                >
                    <div className='flex w-[82vw] shrink-0 snap-start flex-col justify-between gap-10 sm:w-[60vw] lg:w-[34vw] lg:pb-[10vh]'>
                        <div className='flex flex-col gap-8'>
                            <h2
                                id='selected-work-title'
                                className='font-wide text-[clamp(2.4rem,5vw,5.5rem)] font-semibold uppercase leading-[0.88] tracking-[-0.045em]'
                                data-reveal='words'
                            >
                                <SplitWords text='Featured' />
                                <br />
                                <SplitWords text='Portfolio' wordClassName='font-serif font-normal normal-case italic tracking-[-0.02em] text-flare' />
                                <br />
                                <SplitWords text='Collection' />
                            </h2>

                            <p className='max-w-sm text-base leading-relaxed text-bone/75' data-reveal='fade'>
                                {selectedWorkContent.description}
                            </p>
                        </div>

                        <div className='flex flex-col items-start gap-6' data-reveal='fade'>
                            <span className='eyebrow text-stone'>
                                {selectedWorkContent.kicker} / {pad(projects.length)}
                            </span>

                            <PillLink href='/projects'>
                                View all projects
                            </PillLink>
                        </div>
                    </div>

                    {projects.map((project, index) => (
                        <ProjectPanel key={project.id} project={project} index={index} total={projects.length} />
                    ))}

                    <div className='flex w-[70vw] shrink-0 snap-start items-center sm:w-[44vw] lg:w-[30vw] lg:pb-[10vh]'>
                        <TransitionLink
                            href='/projects'
                            className='group flex flex-col gap-6'
                            data-cursor='Open'
                        >
                            <span className='flex size-24 items-center justify-center rounded-full border border-bone/25 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110 group-hover:border-flare group-hover:bg-flare group-hover:text-ink md:size-32'>
                                <ArrowUpRight className='size-8 transition-transform duration-700 group-hover:rotate-45' aria-hidden='true' />
                            </span>

                            <span className='font-wide text-[clamp(1.8rem,3vw,3.4rem)] font-semibold uppercase leading-[0.92] tracking-[-0.04em]'>
                                Explore every
                                <br />
                                <span className='font-serif font-normal normal-case italic tracking-[-0.02em]'>case study</span>
                            </span>
                        </TransitionLink>
                    </div>
                </div>
            </div>
        </section>
    )
}
