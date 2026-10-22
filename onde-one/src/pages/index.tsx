import type { FC, ReactNode } from 'react'
import type { GetStaticProps } from 'next'

import { useRef } from 'react'
import { Seo } from '@/components/generals/seo'
import { Layout } from '@/components/generals/layout'
import { Hero } from '@/components/landing/hero'
import { Intro } from '@/components/landing/intro'
import { Design } from '@/components/landing/design'
import { Materials } from '@/components/landing/materials'
import { Comfort } from '@/components/landing/comfort'
import { Sound } from '@/components/landing/sound'
import { NoiseControl } from '@/components/landing/noise-control'
import { Battery } from '@/components/landing/battery'
import { Controls } from '@/components/landing/controls'
import { Lifestyle } from '@/components/landing/lifestyle'
import { Specs } from '@/components/landing/specs'
import { Reserve } from '@/components/landing/reserve'
import { useScrollEffects } from '@/components/landing/use-scroll-effects'
import { siteConfig } from '@/constants/site'

interface HomeProps {
    shareImage: string
}

const Home: FC<HomeProps> = ({ shareImage }): ReactNode => {
    const pageRef = useRef<HTMLDivElement>(null)

    useScrollEffects(pageRef)

    return (
        <Layout>
            <Seo ogImage={shareImage} />

            <div ref={pageRef}>
                <Hero />
                <Intro />
                <Design />
                <Materials />
                <Comfort />
                <Sound />
                <NoiseControl />
                <Battery />
                <Controls />
                <Lifestyle />
                <Specs />
                <Reserve />
            </div>
        </Layout>
    )
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    const cdn = process.env.CDN_URL?.replace(/\/+$/, '')

    return {
        props: {
            shareImage: cdn ? `${cdn}/share/onde-one-share.jpg` : siteConfig.ogImage ?? ''
        }
    }
}

export default Home
