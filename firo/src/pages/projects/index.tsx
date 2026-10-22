import type { FC, ReactNode } from 'react'
import type { GetStaticProps } from 'next'
import type { Project } from '@/types'

import { useRef } from 'react'
import { getProjects } from '@/lib/data'
import { pad } from '@/lib/format'
import { useIntro } from '@/hooks/use-intro'
import { useReveal } from '@/hooks/use-reveal'
import { PillLink } from '@/components/generals/arrow-link'
import { Layout } from '@/components/generals/layout'
import { Media } from '@/components/generals/media'
import { Eyebrow } from '@/components/generals/section-heading'
import { Seo } from '@/components/generals/seo'
import { SplitWords } from '@/components/generals/split-words'
import { RecLabel, Viewfinder } from '@/components/generals/viewfinder'
import { ProjectGrid } from '@/components/projects/project-grid'
import { projectsPageContent } from '@/constants/content'
import { media } from '@/constants/media'

interface ProjectsPageProps {
    projects: Project[]
}

const ProjectsPage: FC<ProjectsPageProps> = ({ projects = [] }): ReactNode => {
    const scope = useRef<HTMLElement>(null)

    useReveal(scope)

    useIntro(scope, (timeline, root) => {
        timeline
            .from(root.querySelectorAll('[data-intro-title] [data-word]'), { yPercent: 120, duration: 1.4, stagger: 0.1 }, 0)
            .fromTo(root.querySelector('[data-intro-frame]'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' }, 0.15)
            .from(root.querySelectorAll('[data-intro-fade]'), { autoAlpha: 0, y: 30, duration: 1.2, stagger: 0.08 }, 0.6)
    })

    return (
        <Layout>
            <Seo
                title='Projects'
                description='Selected AI visual projects by NOVAIR Studio: campaign imagery, product visuals, social content and AI video for fashion, food, beauty and ecommerce brands.'
                ogImage={media.projectsHero.src}
            />

            <div>
                <section ref={scope} id='projects-hero' aria-labelledby='projects-title' className='relative overflow-hidden bg-ink pb-20 pt-32 text-bone md:pb-28 md:pt-40'>
                    <div className='gutter relative'>
                        <div className='flex items-center justify-between gap-6' data-intro=''>
                            <span data-intro-fade=''>
                                <RecLabel label={projectsPageContent.eyebrow} />
                            </span>

                            <span className='eyebrow text-stone' data-intro-fade=''>
                                ({pad(projects.length)}) Case studies
                            </span>
                        </div>

                        <div className='relative mt-12 md:mt-16'>
                            <h1
                                id='projects-title'
                                className='relative z-10 text-white mix-blend-difference'
                                data-intro=''
                                data-intro-title=''
                            >
                                <span className='block font-wide text-[clamp(3.2rem,15vw,17rem)] font-semibold uppercase leading-[0.8] tracking-[-0.06em]'>
                                    <SplitWords text='Creative' />
                                </span>
                                <span className='block pl-[12vw] font-serif text-[clamp(3.4rem,15.5vw,18rem)] italic leading-[0.86] tracking-[-0.03em]'>
                                    <SplitWords text='Portfolio' />
                                </span>
                            </h1>

                            <div
                                className='mt-10 w-full md:absolute md:right-0 md:top-[-6%] md:mt-0 md:w-[30vw] lg:w-[26vw]'
                                data-intro=''
                                data-intro-frame=''
                            >
                                <Media
                                    src={media.projectsHero.src}
                                    alt={media.projectsHero.alt}
                                    sizes='(min-width: 768px) 30vw, 92vw'
                                    className='aspect-[4/5]'
                                    parallax={10}
                                    preload
                                >
                                    <Viewfinder />
                                    <span className='eyebrow absolute bottom-5 left-5 z-10 text-bone'>
                                        Fr 001 / Night drive
                                    </span>
                                </Media>
                            </div>
                        </div>

                        <div className='mt-16 grid gap-10 md:mt-24 md:grid-cols-12' data-intro=''>
                            <div className='flex flex-col gap-4 md:col-span-4' data-intro-fade=''>
                                <span className='eyebrow text-flare'>
                                    {projectsPageContent.ideasLabel}
                                </span>
                                <p className='text-lead text-bone/85'>
                                    {projectsPageContent.ideasText}
                                </p>
                                <PillLink href='/contact' className='mt-2 self-start'>
                                    {projectsPageContent.ideasAction}
                                </PillLink>
                            </div>

                            <div className='flex flex-col gap-4 md:col-span-5 md:col-start-8' data-intro-fade=''>
                                <Eyebrow index='03' className='text-stone'>
                                    Projects
                                </Eyebrow>
                                <h2 className='font-wide text-title font-semibold uppercase tracking-[-0.04em]'>
                                    {projectsPageContent.collectionTitle}
                                </h2>
                                <p className='max-w-md text-sm leading-relaxed text-stone'>
                                    {projectsPageContent.collectionDescription}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id='portfolio' aria-label='Portfolio' className='bg-ink pb-32 text-bone md:pb-44'>
                    <div className='gutter'>
                        {projects.length > 0
                            ? <ProjectGrid projects={projects} />
                            : (
                                <p className='border-t border-bone/12 py-24 text-center text-stone'>
                                    New case studies are on their way. Check back soon.
                                </p>
                            )}
                    </div>
                </section>
            </div>
        </Layout>
    )
}

export const getStaticProps: GetStaticProps<ProjectsPageProps> = async () => {
    try {
        const projects = await getProjects()
        return { props: { projects }, revalidate: 60 }
    }
    catch (error) {
        console.error('Projects failed to load:', error instanceof Error ? error.message : error)
        return { props: { projects: [] }, revalidate: 30 }
    }
}

export default ProjectsPage
