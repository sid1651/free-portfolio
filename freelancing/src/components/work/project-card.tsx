import type { FC, ReactNode } from 'react'
import type { Project } from '@/types'

import Link from 'next/link'

import { cn } from '@/lib/utils'
import { CurtainMedia } from '@/components/motion/curtain-media'
import { Parallax } from '@/components/motion/media'
import {
    CharsIn,
    WordsIn,
    TrackIn,
    Reveal,
    DrawLine
} from '@/components/motion/reveal'

interface ProjectCardProps {
    project: Project
    index: number
}

/**
 * One full-bleed band per project. The band alternates between bone and acid,
 * and the title entrance alternates with it: bone bands rise per glyph, acid
 * bands expand out of wide tracking, so no two neighbours move the same way.
 */
export const ProjectCard: FC<ProjectCardProps> = ({
    project,
    index
}): ReactNode => {
    const acid = index === 2 || index === 4
    const surface = acid ? '#f4521c' : '#f2f2f2'

    /* Alternate which edge the plate takes, so the index reads as a zig-zag
       rather than five identical rows. The columns are 45/7/48, so flipping
       the order also swaps which side gets the wider measure. */
    const flip = index % 2 === 1

    return (
        <Link
            href={`/work/${project.slug}`}
            data-cursor='view'
            aria-label={`${project.title} — ${project.subtitle}`}
            className='group relative block w-full text-ink'
            style={{ backgroundColor: surface }}
        >
            <div className='grid min-h-[86vh] grid-cols-1 lg:min-h-screen lg:grid-cols-[minmax(0,45fr)_minmax(0,7fr)_minmax(0,48fr)]'>
                {/* Text column */}
                <div
                    className={cn(
                        'relative order-2 flex flex-col justify-start edge-x pb-14 pt-10 lg:pb-24 lg:pt-[13vh]',
                        flip ? 'lg:order-3' : 'lg:order-1'
                    )}
                >
                    <Parallax speed={5} className='w-full'>
                        <div>
                            <Reveal
                                y={16}
                                duration={0.9}
                                start='top 90%'
                                className='mb-5 md:mb-7'
                            >
                                <span className='label-cased text-dust'>
                                    (Project)
                                </span>
                            </Reveal>

                            {acid ? (
                                <h2 className='display-tight text-[clamp(44px,6.6vw,70px)]'>
                                    <TrackIn
                                        text={project.titleLines[0]}
                                        fromTracking={0.3}
                                        toTracking={-0.06}
                                        duration={1.5}
                                        start='top 86%'
                                    />

                                    <TrackIn
                                        text={project.titleLines[1]}
                                        fromTracking={0.3}
                                        toTracking={-0.06}
                                        duration={1.5}
                                        delay={0.1}
                                        start='top 86%'
                                    />
                                </h2>
                            ) : (
                                <h2 className='display-tight text-[clamp(44px,6.6vw,70px)]'>
                                    <CharsIn
                                        text={project.titleLines[0]}
                                        stagger={0.028}
                                        start='top 86%'
                                    />

                                    <CharsIn
                                        text={project.titleLines[1]}
                                        stagger={0.028}
                                        delay={0.12}
                                        start='top 86%'
                                    />
                                </h2>
                            )}

                            <WordsIn
                                text={project.subtitle}
                                delay={0.24}
                                start='top 86%'
                                className='mt-6 max-w-[34ch] text-[16px] font-bold uppercase leading-[1.25] tracking-[-0.04em] md:mt-8'
                            />

                            <div className='mt-10 flex gap-4 md:mt-16'>
                                <DrawLine
                                    orientation='vertical'
                                    color='#050609'
                                    thickness={2}
                                    delay={0.3}
                                    className='self-stretch'
                                />

                                <Reveal
                                    y={20}
                                    delay={0.36}
                                    start='top 90%'
                                    className='py-[2px]'
                                >
                                    <p className='whitespace-pre-line text-[16px] font-semibold leading-[1.15] tracking-[-0.04em]'>
                                        {project.clientName}
                                        {'\n'}
                                        {project.clientType}
                                    </p>

                                    <p className='mt-2 text-[12px] font-semibold tracking-[-0.03em] text-graphite'>
                                        {project.date}
                                    </p>
                                </Reveal>
                            </div>
                        </div>
                    </Parallax>
                </div>

                {/* Hatch */}
                <div
                    aria-hidden='true'
                    className='order-3 hidden lg:order-2 lg:block'
                    style={{
                        backgroundImage:
                            'url(/images/KQaQPBCQCv0Dk6IXosxWxpY7pFE.svg)',
                        backgroundRepeat: 'repeat',
                        backgroundSize: '11px auto',
                        backgroundPosition: 'left top'
                    }}
                />

                {/* Media */}
                <div
                    className={cn(
                        'relative order-1 h-[62vh] lg:h-auto',
                        flip ? 'lg:order-1' : 'lg:order-3'
                    )}
                >
                    <CurtainMedia
                        src={project.hero}
                        video={project.heroVideo}
                        alt={`${project.title} — ${project.subtitle}`}
                        mask={surface}
                        staticZoom={1.12}
                        caption={project.description}
                        sublabel={project.category}
                        priority={index === 0}
                        className={cn(
                            'size-full',
                            'transition-[filter] duration-700 ease-out'
                        )}
                        imageClassName='transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]'
                    />
                </div>
            </div>
        </Link>
    )
}
