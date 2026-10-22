import type { FC, ReactNode } from 'react'
import type { Project } from '@/types'

import { useRouter } from 'next/router'

import {
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react'

import { gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { slugify, pad } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useReveal } from '@/hooks/use-reveal'
import { ProjectCard } from '@/components/projects/project-card'
import { categories } from '@/constants/site'

const layouts = [
    { column: 'md:col-span-7', aspect: 'aspect-[4/5]', offset: '', sizes: '(min-width: 768px) 56vw, 92vw', title: 'xl' as const },
    { column: 'md:col-span-4 md:col-start-9', aspect: 'aspect-[3/4]', offset: 'md:mt-[26vh]', sizes: '(min-width: 768px) 32vw, 92vw', title: 'lg' as const },
    { column: 'md:col-span-6 md:col-start-4', aspect: 'aspect-[4/3]', offset: 'md:mt-24', sizes: '(min-width: 768px) 48vw, 92vw', title: 'lg' as const },
    { column: 'md:col-span-5', aspect: 'aspect-[3/4]', offset: 'md:mt-24', sizes: '(min-width: 768px) 40vw, 92vw', title: 'lg' as const },
    { column: 'md:col-span-6 md:col-start-7', aspect: 'aspect-[4/5]', offset: 'md:mt-[34vh]', sizes: '(min-width: 768px) 48vw, 92vw', title: 'xl' as const },
    { column: 'md:col-span-10 md:col-start-2', aspect: 'aspect-[4/5] md:aspect-[16/9]', offset: 'md:mt-24', sizes: '(min-width: 768px) 82vw, 92vw', title: 'xl' as const }
]

interface ProjectGridProps {
    projects: Project[]
}

/** Filterable, asymmetric portfolio. Each project gets its own frame size and offset. */
export const ProjectGrid: FC<ProjectGridProps> = ({ projects }): ReactNode => {
    const router = useRouter()
    const scope = useRef<HTMLDivElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)
    const [filter, setFilter] = useState('all')

    const filters = useMemo(() => {
        return [
            { slug: 'all', label: 'All', count: projects.length },
            ...categories.map(category => ({
                slug: slugify(category),
                label: category,
                count: projects.filter(project => project.category === category).length
            }))
        ]
    }, [projects])

    const visible = useMemo(() => {
        if (filter === 'all') return projects
        return projects.filter(project => slugify(project.category ?? '') === filter)
    }, [filter, projects])

    useReveal(scope, [filter])

    useEffect(() => {
        if (!router.isReady) return

        const requested = typeof router.query.filter === 'string' ? router.query.filter : 'all'
        if (filters.some(item => item.slug === requested)) setFilter(requested)
    }, [router.isReady, router.query.filter, filters])

    useEffect(() => {
        const grid = gridRef.current
        if (!grid) return

        gsap.to(grid, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'expo.out' })
        requestAnimationFrame(() => ScrollTrigger.refresh())
    }, [filter])

    const selectFilter = (slug: string): void => {
        if (slug === filter) return

        const grid = gridRef.current

        const apply = (): void => {
            setFilter(slug)

            const query = slug === 'all' ? {} : { filter: slug }
            router.replace({ pathname: router.pathname, query }, undefined, { shallow: true, scroll: false }).catch(() => undefined)
        }

        if (!grid) {
            apply()
            return
        }

        gsap.to(grid, { autoAlpha: 0, y: 24, duration: 0.35, ease: 'power2.in', onComplete: apply })
    }

    return (
        <div ref={scope}>
            <div className='flex flex-col gap-6 border-y border-bone/12 py-5 md:flex-row md:items-center md:justify-between'>
                <span className='eyebrow text-stone'>
                    Filter / {pad(visible.length)} of {pad(projects.length)}
                </span>

                <div className='no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1' role='group' aria-label='Filter projects by category'>
                    {filters.map(item => (
                        <button
                            key={item.slug}
                            type='button'
                            onClick={() => selectFilter(item.slug)}
                            aria-pressed={filter === item.slug}
                            disabled={item.count === 0}
                            className={cn(
                                'flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-35',
                                filter === item.slug
                                    ? 'border-bone bg-bone text-ink'
                                    : 'border-bone/20 text-bone hover:border-bone/60'
                            )}
                        >
                            {item.label}
                            <sup className='text-[0.65em] opacity-60'>
                                {item.count}
                            </sup>
                        </button>
                    ))}
                </div>
            </div>

            <div ref={gridRef} className='mt-14 grid grid-cols-1 gap-x-10 gap-y-20 md:mt-20 md:grid-cols-12 md:gap-y-12'>
                {visible.map((project, index) => {
                    const layout = layouts[index % layouts.length]

                    return (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            index={projects.indexOf(project)}
                            aspect={layout.aspect}
                            sizes={layout.sizes}
                            titleSize={layout.title}
                            className={cn(layout.column, layout.offset)}
                        />
                    )
                })}

                {visible.length === 0 && (
                    <p className='col-span-full py-24 text-center text-stone'>
                        No projects in this category yet.
                    </p>
                )}
            </div>
        </div>
    )
}
