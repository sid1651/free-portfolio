import type { FC, ReactNode } from 'react'
import type { Project } from '@/types'

import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { gsap } from '@/lib/motion/gsap'
import { cms } from '@/lib/cms'
import { formatDate, pad } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Media } from '@/components/generals/media'
import { TransitionLink } from '@/components/generals/transition-link'
import { Viewfinder } from '@/components/generals/viewfinder'

interface ProjectCardProps {
    project: Project
    index: number
    aspect: string
    sizes: string
    className?: string
    titleSize?: 'lg' | 'xl'
}

/** One project in the editorial portfolio: framed image, oversized title and project metadata. */
export const ProjectCard: FC<ProjectCardProps> = ({ project, index, aspect, sizes, className, titleSize = 'lg' }): ReactNode => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const href = `/projects/${project.slug}`

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
        <article className={cn('group flex flex-col gap-5', className)} data-project-card=''>
            <div className='flex items-center justify-between gap-4'>
                <span className='eyebrow text-stone'>
                    ({pad(index + 1)})
                </span>

                {project.category && (
                    <span className='eyebrow rounded-full border border-bone/15 px-3 py-1.5 text-bone/80' data-mdlfy-cms={cms('projects', project.id, 'category')}>
                        {project.category}
                    </span>
                )}
            </div>

            <TransitionLink
                href={href}
                className='relative block'
                data-cursor={project.video ? 'Play' : 'View'}
                onMouseEnter={play}
                onMouseLeave={stop}
                aria-label={`View project ${project.title}`}
            >
                <Media
                    src={project.cover ?? ''}
                    alt={project.cover_alt ?? project.title}
                    sizes={sizes}
                    className={aspect}
                    imageClassName='transition-transform duration-[1.6s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.06]'
                    reveal
                >
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

                    <span className='absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100' aria-hidden='true' />

                    <Viewfinder className='opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

                    <span className='absolute bottom-5 right-5 z-10 flex size-12 translate-y-3 items-center justify-center rounded-full bg-bone text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100' aria-hidden='true'>
                        <ArrowUpRight className='size-5' />
                    </span>
                </Media>
            </TransitionLink>

            <div className='flex flex-col gap-4'>
                <div className='flex items-start justify-between gap-6'>
                    <h3
                        className={cn(
                            'font-wide font-semibold uppercase leading-[0.9] tracking-[-0.045em]',
                            titleSize === 'xl' ? 'text-[clamp(2.2rem,5vw,5.25rem)]' : 'text-[clamp(1.9rem,3.4vw,3.6rem)]'
                        )}
                    >
                        <TransitionLink href={href} className='transition-colors duration-500 hover:text-flare'>
                            <span data-mdlfy-cms={cms('projects', project.id, 'title')}>{project.title}</span>
                        </TransitionLink>
                    </h3>

                    {project.logo && (
                        <img src={project.logo} alt={project.logo_alt ?? ''} className='mt-1 h-8 w-auto shrink-0 opacity-80' loading='lazy' />
                    )}
                </div>

                {project.tagline && (
                    <p className='max-w-xl text-sm leading-relaxed text-stone md:text-base' data-mdlfy-cms={cms('projects', project.id, 'tagline')}>
                        {project.tagline}
                    </p>
                )}

                <dl className='grid grid-cols-3 gap-4 border-t border-bone/12 pt-4 text-sm'>
                    <div className='flex flex-col gap-1'>
                        <dt className='eyebrow text-stone'>Date</dt>
                        <dd>{formatDate(project.project_date)}</dd>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <dt className='eyebrow text-stone'>Client</dt>
                        <dd data-mdlfy-cms={cms('projects', project.id, 'client')}>{project.client}</dd>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <dt className='eyebrow text-stone'>Service</dt>
                        <dd data-mdlfy-cms={cms('projects', project.id, 'services')}>{project.services}</dd>
                    </div>
                </dl>
            </div>
        </article>
    )
}
