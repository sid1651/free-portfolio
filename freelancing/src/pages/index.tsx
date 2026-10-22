import type { FC, ReactNode } from 'react'

import { Seo } from '@/components/generals/seo'
import { Hero } from '@/components/home/hero'
import { Intro } from '@/components/home/intro'
import { Gallery } from '@/components/home/gallery'
import { Concept } from '@/components/home/concept'
import { Process } from '@/components/home/process'
import { Featured } from '@/components/home/featured'
import { WorkTypes } from '@/components/home/work-types'
import { Statement } from '@/components/home/statement'
import { Philosophy } from '@/components/home/philosophy'
import { Showcase } from '@/components/home/showcase'
import { Exhibition } from '@/components/home/exhibition'
import { About } from '@/components/home/about'

const HomePage: FC = (): ReactNode => {
    return (
        <>
            <Seo ogImage='/images/portfolio/hero-art.jpg' />

            <main>
                <Hero />
                <Intro />
                <Gallery />
                <Concept />
                <Process />
                <Featured />
                <WorkTypes />
                <Statement />
                <Philosophy />
                <Showcase />
                <Exhibition />
                <About />
            </main>
        </>
    )
}

export default HomePage
