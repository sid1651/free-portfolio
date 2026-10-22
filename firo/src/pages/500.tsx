import type { FC, ReactNode } from 'react'

import Head from 'next/head'
import { PillLink } from '@/components/generals/arrow-link'
import { Layout } from '@/components/generals/layout'
import { RecLabel, Viewfinder } from '@/components/generals/viewfinder'
import { siteConfig } from '@/constants/site'

const ServerError: FC = (): ReactNode => {
    return (
        <Layout>
            <Head>
                <title>
                    {`Something went wrong - ${siteConfig.name}`}
                </title>
                <meta name='robots' content='noindex' />
            </Head>

            <section id='server-error' aria-labelledby='server-error-title' className='relative flex min-h-[100svh] items-center overflow-hidden bg-ink pb-20 pt-32 text-bone'>
                <div className='gutter relative w-full'>
                    <div className='relative mx-auto flex max-w-4xl flex-col items-center gap-8 border border-bone/10 px-6 py-16 text-center md:py-24'>
                        <Viewfinder />

                        <RecLabel label='Render paused' />

                        <h1 id='server-error-title' className='font-wide text-[clamp(2.6rem,8vw,7rem)] font-semibold uppercase leading-[0.88] tracking-[-0.05em]'>
                            Something went
                            <br />
                            <span className='font-serif font-normal normal-case italic tracking-[-0.02em] text-flare'>
                                off script.
                            </span>
                        </h1>

                        <p className='max-w-sm text-sm leading-relaxed text-stone'>
                            The page could not load right now. Please try again in a moment, or write to us at {siteConfig.email}.
                        </p>

                        <PillLink href='/' variant='flare'>
                            Back to home
                        </PillLink>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default ServerError
