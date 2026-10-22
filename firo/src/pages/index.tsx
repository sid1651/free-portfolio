import type { FC, ReactNode } from 'react'
import type { GetStaticProps } from 'next'
import type { PostSummary, Project } from '@/types'

import { Seo } from '@/components/generals/seo'
import { Layout } from '@/components/generals/layout'
import { Hero } from '@/components/landing/hero'
import { Insights } from '@/components/landing/insights'
import { Manifesto } from '@/components/landing/manifesto'
import { Process } from '@/components/landing/process'
import { Reviews } from '@/components/landing/reviews'
import { SelectedWork } from '@/components/landing/selected-work'
import { Services } from '@/components/landing/services'
import { Showcase } from '@/components/landing/showcase'
import { Studio } from '@/components/landing/studio'
import { getPosts, getProjects } from '@/lib/data'

interface HomeProps {
    featured: Project[]
    partners: Pick<Project, 'id' | 'title' | 'logo' | 'logo_alt'>[]
    posts: PostSummary[]
}

const Home: FC<HomeProps> = ({ featured = [], partners = [], posts = [] }): ReactNode => {
    return (
        <Layout>
            <Seo description='NOVAIR Studio is a premium AI visual production studio. Human art direction meets generative imagery, product visuals, social content and AI video for modern brands.' />

            <Hero />
            <Manifesto />
            <SelectedWork projects={featured} />
            <Services />
            <Showcase />
            <Reviews />
            <Process />
            <Studio partners={partners} />
            <Insights posts={posts} />
        </Layout>
    )
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    try {
        const [projects, posts] = await Promise.all([getProjects(), getPosts(3)])
        const featured = projects.filter(project => project.featured === 1).slice(0, 4)

        return {
            props: {
                featured: featured.length > 0 ? featured : projects.slice(0, 4),
                partners: projects.map(project => ({
                    id: project.id,
                    title: project.title,
                    logo: project.logo,
                    logo_alt: project.logo_alt
                })),
                posts
            },
            revalidate: 60
        }
    }
    catch (error) {
        console.error('Home page data failed to load:', error instanceof Error ? error.message : error)

        return {
            props: { featured: [], partners: [], posts: [] },
            revalidate: 30
        }
    }
}

export default Home
