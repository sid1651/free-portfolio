import type { FC, ReactNode } from 'react'

import { Seo } from '@/components/generals/seo'
import { ProjectCard } from '@/components/work/project-card'

import { projects } from '@/constants/projects'

const WorkPage: FC = (): ReactNode => {
    return (
        <>
            <Seo
                title='Work'
                description='Selected websites and digital experiences by Siddharth: Hitha, Arden Halo, Kuro Coffee and NOVAIR Studio.'
                ogImage={projects[0].hero}
            />

            <main id='work' className='bg-ink'>
                <h1 className='sr-only'>Selected work</h1>

                {projects.map((project, index) => (
                    <ProjectCard
                        key={project.slug}
                        project={project}
                        index={index}
                    />
                ))}
            </main>
        </>
    )
}

export default WorkPage
