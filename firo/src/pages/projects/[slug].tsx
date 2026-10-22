import type { FC, ReactNode } from 'react'
import type { GetStaticPaths, GetStaticProps } from 'next'
import type { Project } from '@/types'

import Image from 'next/image'
import { ArrowLeft, ArrowUpRight, Quote } from 'lucide-react'
import { useRef } from 'react'
import { getProjects, getProjectSlugs } from '@/lib/data'
import { cms } from '@/lib/cms'
import { formatDate, pad } from '@/lib/format'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { cn } from '@/lib/utils'
import { useIntro } from '@/hooks/use-intro'
import { useReveal } from '@/hooks/use-reveal'
import { Layout } from '@/components/generals/layout'
import { Media } from '@/components/generals/media'
import { Eyebrow } from '@/components/generals/section-heading'
import { Seo } from '@/components/generals/seo'
import { TransitionLink } from '@/components/generals/transition-link'
import { RecLabel, Viewfinder } from '@/components/generals/viewfinder'

interface ProjectPageProps {
    project: Project
    next: Project | null
    position: number
    total: number
}

type GalleryItem =
    | { kind: 'image', field: string, src: string, alt: string }
    | { kind: 'video', src: string }

const galleryLayouts = [
    { column: 'md:col-span-7', aspect: 'aspect-[4/5]', offset: '', sizes: '(min-width: 768px) 56vw, 92vw' },
    { column: 'md:col-span-4 md:col-start-9', aspect: 'aspect-[3/4]', offset: 'md:mt-[30vh]', sizes: '(min-width: 768px) 32vw, 92vw' },
    { column: 'md:col-span-10 md:col-start-2', aspect: 'aspect-[4/5] md:aspect-[16/9]', offset: 'md:mt-20', sizes: '(min-width: 768px) 82vw, 92vw' },
    { column: 'md:col-span-5 md:col-start-2', aspect: 'aspect-[3/4]', offset: 'md:mt-20', sizes: '(min-width: 768px) 40vw, 92vw' }
]

const buildGallery = (project: Project): GalleryItem[] => {
    const images: GalleryItem[] = [
        { kind: 'image', field: 'detail_image_1', src: project.detail_image_1 ?? '', alt: project.detail_image_1_alt ?? '' },
        { kind: 'image', field: 'detail_image_2', src: project.detail_image_2 ?? '', alt: project.detail_image_2_alt ?? '' },
        { kind: 'image', field: 'detail_image_3', src: project.detail_image_3 ?? '', alt: project.detail_image_3_alt ?? '' }
    ]

    const items = images.filter(item => item.kind === 'image' && item.src)

    if (project.video) items.splice(Math.min(1, items.length), 0, { kind: 'video', src: project.video })

    return items
}

const ProjectPage: FC<ProjectPageProps> = ({ project, next, position, total }): ReactNode => {
    const heroRef = useRef<HTMLElement>(null)
    const bodyRef = useRef<HTMLDivElement>(null)
    const gallery = buildGallery(project)

    useIntro(heroRef, (timeline, root) => {
        timeline
            .from(root.querySelector('[data-hero-media]'), { scale: 1.3, duration: 2.4 }, 0)
            .from(root.querySelectorAll('[data-hero-rise]'), { yPercent: 110, duration: 1.4, stagger: 0.08 }, 0.25)
            .from(root.querySelectorAll('[data-hero-fade]'), { autoAlpha: 0, y: 24, duration: 1.1, stagger: 0.08 }, 0.6)
    }, [project.id])

    useGSAP(() => {
        const root = heroRef.current
        if (!root) return

        const mm = gsap.matchMedia()

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            gsap.to(root.querySelector('[data-hero-parallax]'), {
                yPercent: 18,
                ease: 'none',
                scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true }
            })
        })

        return () => mm.revert()
    }, { scope: heroRef, dependencies: [project.id], revertOnUpdate: true })

    useReveal(bodyRef, [project.id])

    const details = [
        { label: 'Client', column: 'client', value: project.client },
        { label: 'Industry', column: 'industry', value: project.industry },
        { label: 'Services', column: 'services', value: project.services },
        { label: 'Format', column: 'format', value: project.format },
        { label: 'Budget', column: 'budget', value: project.budget },
        { label: 'AI Tech', column: 'ai_tech', value: project.ai_tech }
    ].filter(item => Boolean(item.value))

    return (
        <Layout>
            <Seo
                title={project.title}
                description={project.tagline ?? project.overview ?? `${project.title}, a project by NOVAIR Studio.`}
                ogImage={project.cover ?? undefined}
                type='article'
            />

            <article>
                <section ref={heroRef} id='project-hero' aria-labelledby='project-title' className='relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-ink text-bone'>
                    <div className='absolute inset-0' data-hero-parallax=''>
                        <div className='absolute inset-0' data-hero-media=''>
                            {project.cover && (
                                <Image
                                    src={project.cover}
                                    alt={project.cover_alt ?? project.title}
                                    fill
                                    preload
                                    sizes='100vw'
                                    className='object-cover'
                                />
                            )}
                        </div>
                    </div>

                    <div className='absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/10 to-ink/85' aria-hidden='true' />

                    <div className='gutter relative z-10 flex items-center justify-between gap-6 pt-28 md:pt-32' data-intro=''>
                        <span data-hero-fade=''>
                            <TransitionLink href='/projects' className='group inline-flex items-center gap-3 text-sm'>
                                <span className='flex size-10 items-center justify-center rounded-full border border-bone/30 transition-colors duration-300 group-hover:border-bone group-hover:bg-bone group-hover:text-ink'>
                                    <ArrowLeft className='size-4' aria-hidden='true' />
                                </span>
                                All projects
                            </TransitionLink>
                        </span>

                        <span className='eyebrow text-bone/80' data-hero-fade=''>
                            Project {pad(position)} / {pad(total)}
                        </span>
                    </div>

                    <div className='gutter relative z-10 pb-12 md:pb-16' data-intro=''>
                        <div className='flex flex-wrap items-center gap-4' data-hero-fade=''>
                            <RecLabel label='Case study' />
                            {project.category && (
                                <span className='eyebrow rounded-full border border-bone/25 px-3 py-1.5' data-mdlfy-cms={cms('projects', project.id, 'category')}>
                                    {project.category}
                                </span>
                            )}
                            {project.project_date && (
                                <time className='eyebrow text-bone/70' dateTime={project.project_date}>
                                    {formatDate(project.project_date)}
                                </time>
                            )}
                        </div>

                        <h1 id='project-title' className='mt-6 overflow-hidden pb-[0.06em]'>
                            <span className='block font-wide text-[clamp(3rem,11vw,12rem)] font-semibold uppercase leading-[0.84] tracking-[-0.055em]' data-hero-rise=''>
                                <span data-mdlfy-cms={cms('projects', project.id, 'title')}>{project.title}</span>
                            </span>
                        </h1>

                        <div className='mt-8 grid gap-6 md:grid-cols-12 md:items-end'>
                            {project.tagline && (
                                <p className='text-lead text-bone/90 md:col-span-6' data-hero-fade='' data-mdlfy-cms={cms('projects', project.id, 'tagline')}>
                                    {project.tagline}
                                </p>
                            )}

                            {project.logo && (
                                <div className='flex items-center gap-3 md:col-span-3 md:col-start-10 md:justify-end' data-hero-fade=''>
                                    <img src={project.logo} alt={project.logo_alt ?? ''} className='h-10 w-auto' />
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <div ref={bodyRef}>
                    <section id='project-details' aria-label='Project details' className='bg-ink text-bone'>
                        <dl className='gutter grid grid-cols-2 border-b border-bone/12 md:grid-cols-3 lg:grid-cols-6'>
                            {details.map(item => (
                                <div key={item.column} className='flex flex-col gap-2 border-t border-bone/12 py-6 pr-4'>
                                    <dt className='eyebrow text-stone'>
                                        {item.label}
                                    </dt>
                                    <dd className='text-base font-medium' data-mdlfy-cms={cms('projects', project.id, item.column)}>
                                        {item.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </section>

                    <section id='project-overview' aria-labelledby='overview-title' className='bg-bone py-24 text-ink md:py-36'>
                        <div className='gutter grid gap-10 md:grid-cols-12'>
                            <div className='md:col-span-3'>
                                <Eyebrow index='01' className='text-stone-deep'>
                                    <span id='overview-title'>Overview</span>
                                </Eyebrow>
                            </div>

                            <div className='flex flex-col gap-16 md:col-span-9'>
                                {project.overview && (
                                    <p
                                        className='text-[clamp(1.75rem,3.6vw,3.75rem)] font-medium leading-[1.06] tracking-[-0.035em]'
                                        data-reveal='fade'
                                        data-mdlfy-cms={cms('projects', project.id, 'overview')}
                                    >
                                        {project.overview}
                                    </p>
                                )}

                                <div className='grid gap-10 border-t border-ink/15 pt-10 md:grid-cols-2'>
                                    {project.challenge && (
                                        <div className='flex flex-col gap-4' data-reveal='fade'>
                                            <h2 className='eyebrow text-stone-deep'>
                                                (02) The brief
                                            </h2>
                                            <p className='text-base leading-relaxed text-ink/80 md:text-lg' data-mdlfy-cms={cms('projects', project.id, 'challenge')}>
                                                {project.challenge}
                                            </p>
                                        </div>
                                    )}

                                    {project.process && (
                                        <div className='flex flex-col gap-4' data-reveal='fade'>
                                            <h2 className='eyebrow text-stone-deep'>
                                                (03) Our approach
                                            </h2>
                                            <p className='text-base leading-relaxed text-ink/80 md:text-lg' data-mdlfy-cms={cms('projects', project.id, 'process')}>
                                                {project.process}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {gallery.length > 0 && (
                        <section id='project-gallery' aria-label={`${project.title} gallery`} className='bg-ink py-24 text-bone md:py-36'>
                            <div className='gutter'>
                                <div className='flex items-center justify-between border-b border-bone/12 pb-5'>
                                    <Eyebrow index='04' className='text-stone'>
                                        Selected frames
                                    </Eyebrow>
                                    <span className='eyebrow text-stone'>
                                        {pad(gallery.length)} Frames
                                    </span>
                                </div>

                                <div className='mt-14 grid grid-cols-1 gap-x-10 gap-y-14 md:mt-20 md:grid-cols-12 md:gap-y-10'>
                                    {gallery.map((item, index) => {
                                        const layout = galleryLayouts[index % galleryLayouts.length]

                                        if (item.kind === 'video') {
                                            return (
                                                <figure key='video' className={cn('flex flex-col gap-3', layout.column, layout.offset)}>
                                                    <div className='relative mx-auto aspect-[9/16] w-full max-w-md overflow-hidden bg-ink-raised' data-reveal='image'>
                                                        <div className='absolute inset-0' data-reveal-inner=''>
                                                            <video
                                                                className='absolute inset-0 size-full object-cover'
                                                                src={item.src}
                                                                poster={project.cover ?? undefined}
                                                                autoPlay
                                                                muted
                                                                loop
                                                                playsInline
                                                                preload='metadata'
                                                                aria-label={`${project.title} motion piece`}
                                                            />
                                                        </div>
                                                        <Viewfinder />
                                                        <span className='absolute left-6 top-6 z-10'>
                                                            <RecLabel label='Motion' className='text-bone' />
                                                        </span>
                                                    </div>
                                                    <figcaption className='eyebrow mx-auto flex w-full max-w-md justify-between text-stone'>
                                                        <span>Fr {pad(index + 1, 3)}</span>
                                                        <span>Short form / 9:16</span>
                                                    </figcaption>
                                                </figure>
                                            )
                                        }

                                        return (
                                            <figure key={item.field} className={cn('flex flex-col gap-3', layout.column, layout.offset)}>
                                                <Media
                                                    src={item.src}
                                                    alt={item.alt}
                                                    sizes={layout.sizes}
                                                    className={layout.aspect}
                                                    reveal
                                                    parallax={8}
                                                />
                                                <figcaption className='eyebrow flex justify-between text-stone'>
                                                    <span>Fr {pad(index + 1, 3)}</span>
                                                    <span>
                                                        Novair / <span data-mdlfy-cms={cms('projects', project.id, 'title')}>{project.title}</span>
                                                    </span>
                                                </figcaption>
                                            </figure>
                                        )
                                    })}
                                </div>
                            </div>
                        </section>
                    )}

                    <section id='project-results' aria-labelledby='results-title' className='bg-ink pb-24 text-bone md:pb-36'>
                        <div className='gutter grid gap-12 border-t border-bone/12 pt-16 md:grid-cols-12 md:pt-24'>
                            <div className='flex flex-col gap-6 md:col-span-5'>
                                <Eyebrow index='05' className='text-stone'>
                                    <span id='results-title'>Results</span>
                                </Eyebrow>

                                {project.result_metric && (
                                    <p className='font-wide text-[clamp(5rem,14vw,13rem)] font-semibold leading-[0.8] tracking-[-0.065em] text-flare' data-reveal='fade'>
                                        <span data-mdlfy-cms={cms('projects', project.id, 'result_metric')}>{project.result_metric}</span>
                                    </p>
                                )}

                                {project.result_label && (
                                    <p className='eyebrow text-bone' data-mdlfy-cms={cms('projects', project.id, 'result_label')}>
                                        {project.result_label}
                                    </p>
                                )}

                                {project.result_summary && (
                                    <p className='max-w-sm text-lead text-bone/85' data-reveal='fade' data-mdlfy-cms={cms('projects', project.id, 'result_summary')}>
                                        {project.result_summary}
                                    </p>
                                )}
                            </div>

                            <div className='flex flex-col gap-12 md:col-span-6 md:col-start-7'>
                                {project.achievement && (
                                    <div className='flex flex-col gap-4 border-b border-bone/12 pb-10' data-reveal='fade'>
                                        <span className='eyebrow text-stone'>
                                            Achievement
                                        </span>
                                        <p className='text-xl leading-snug md:text-2xl' data-mdlfy-cms={cms('projects', project.id, 'achievement')}>
                                            {project.achievement}
                                        </p>
                                        <p className='text-sm text-stone'>
                                            Recognized for creative excellence, innovation, and standout visual work.
                                        </p>
                                    </div>
                                )}

                                {project.review_quote && (
                                    <blockquote className='flex flex-col gap-8' data-reveal='fade'>
                                        <Quote className='size-7 text-flare' aria-hidden='true' />

                                        <p className='font-serif text-[clamp(2rem,4vw,3.75rem)] italic leading-[1.04] tracking-[-0.01em]' data-mdlfy-cms={cms('projects', project.id, 'review_quote')}>
                                            {project.review_quote}
                                        </p>

                                        <footer className='flex flex-col gap-1'>
                                            {project.reviewer_name && (
                                                <cite className='text-base font-semibold not-italic' data-mdlfy-cms={cms('projects', project.id, 'reviewer_name')}>
                                                    {project.reviewer_name}
                                                </cite>
                                            )}
                                            {project.reviewer_role && (
                                                <span className='eyebrow text-stone' data-mdlfy-cms={cms('projects', project.id, 'reviewer_role')}>
                                                    {project.reviewer_role}
                                                </span>
                                            )}
                                        </footer>
                                    </blockquote>
                                )}
                            </div>
                        </div>
                    </section>

                    {next && (
                        <section id='next-project' aria-label='Next project' className='relative overflow-hidden bg-ink text-bone'>
                            <TransitionLink href={`/projects/${next.slug}`} className='group relative block' data-cursor='Next' aria-label={`Next project: ${next.title}`}>
                                <div className='relative h-[70svh] min-h-[28rem] overflow-hidden md:h-[90svh]'>
                                    {next.cover && (
                                        <Image
                                            src={next.cover}
                                            alt={next.cover_alt ?? next.title}
                                            fill
                                            sizes='100vw'
                                            className='scale-110 object-cover opacity-50 grayscale transition-[transform,translate,scale,rotate,opacity,filter] duration-[1.6s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-100 group-hover:opacity-80 group-hover:grayscale-0'
                                        />
                                    )}

                                    <div className='absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/50' aria-hidden='true' />

                                    <div className='gutter absolute inset-x-0 bottom-0 flex flex-col gap-6 pb-12 md:pb-16'>
                                        <span className='eyebrow text-bone/80'>
                                            Next project
                                        </span>

                                        <div className='flex items-end justify-between gap-6'>
                                            <span className='font-wide text-[clamp(2.8rem,10vw,11rem)] font-semibold uppercase leading-[0.84] tracking-[-0.055em]'>
                                                <span data-mdlfy-cms={cms('projects', next.id, 'title')}>{next.title}</span>
                                            </span>

                                            <span className='mb-2 flex size-14 shrink-0 items-center justify-center rounded-full bg-bone text-ink transition-transform duration-700 group-hover:rotate-45 md:size-20'>
                                                <ArrowUpRight className='size-6' aria-hidden='true' />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </TransitionLink>
                        </section>
                    )}
                </div>
            </article>
        </Layout>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        const slugs = await getProjectSlugs()
        return { paths: slugs.map(slug => ({ params: { slug } })), fallback: 'blocking' }
    }
    catch (error) {
        console.error('Project paths failed to load:', error instanceof Error ? error.message : error)
        return { paths: [], fallback: 'blocking' }
    }
}

export const getStaticProps: GetStaticProps<ProjectPageProps, { slug: string }> = async ({ params }) => {
    const slug = params?.slug

    if (!slug) return { notFound: true }

    try {
        const projects = await getProjects()
        const index = projects.findIndex(project => project.slug === slug)

        if (index === -1) return { notFound: true, revalidate: 30 }

        const next = projects.length > 1 ? projects[(index + 1) % projects.length] : null

        return {
            props: {
                project: projects[index],
                next,
                position: index + 1,
                total: projects.length
            },
            revalidate: 60
        }
    }
    catch (error) {
        console.error(`Project "${slug}" failed to load:`, error instanceof Error ? error.message : error)
        return { notFound: true, revalidate: 30 }
    }
}

export default ProjectPage
