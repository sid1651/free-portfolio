import type { FC, ReactNode } from 'react'

import Head from 'next/head'
import { useRef } from 'react'
import { useIntro } from '@/hooks/use-intro'
import { PillLink } from '@/components/generals/arrow-link'
import { Layout } from '@/components/generals/layout'
import { SplitWords } from '@/components/generals/split-words'
import { RecLabel, Viewfinder } from '@/components/generals/viewfinder'
import { Timecode } from '@/components/generals/timecode'
import { siteConfig } from '@/constants/site'

const NotFound: FC = (): ReactNode => {
    const scope = useRef<HTMLElement>(null)

    useIntro(scope, (timeline, root) => {
        timeline
            .from(root.querySelectorAll('[data-word]'), { yPercent: 120, duration: 1.3, stagger: 0.08 }, 0)
            .from(root.querySelectorAll('[data-fade]'), { autoAlpha: 0, y: 20, duration: 1, stagger: 0.08 }, 0.4)
    })

    return (
        <Layout>
            <Head>
                <title>
                    {`Page not found - ${siteConfig.name}`}
                </title>
                <meta name='robots' content='noindex' />
            </Head>

            <section ref={scope} id='not-found' aria-labelledby='not-found-title' className='relative flex min-h-[100svh] items-center overflow-hidden bg-ink pb-20 pt-32 text-bone'>
                <div className='nova-bloom pointer-events-none absolute left-1/2 top-1/2 size-[90vw] -translate-x-1/2 -translate-y-1/2 opacity-20 md:size-[55vw]' aria-hidden='true' />

                <div className='gutter relative w-full'>
                    <div className='relative mx-auto flex max-w-5xl flex-col items-center gap-10 border border-bone/10 px-6 py-16 text-center md:py-24' data-intro=''>
                        <Viewfinder />

                        <div className='flex w-full justify-between px-2' data-fade=''>
                            <RecLabel label='Signal lost' />
                            <Timecode className='eyebrow text-stone' />
                        </div>

                        <h1 id='not-found-title' className='font-wide text-[clamp(6rem,26vw,22rem)] font-bold leading-[0.8] tracking-[-0.07em]'>
                            <SplitWords text='404' />
                        </h1>

                        <p className='max-w-md font-serif text-[clamp(1.6rem,3vw,2.6rem)] italic leading-tight' data-fade=''>
                            This frame never made the final cut.
                        </p>

                        <p className='max-w-sm text-sm leading-relaxed text-stone' data-fade=''>
                            The page you are looking for has moved or no longer exists. Head back to the studio or explore the work.
                        </p>

                        <div className='flex flex-wrap items-center justify-center gap-3' data-fade=''>
                            <PillLink href='/' variant='flare'>
                                Back to home
                            </PillLink>
                            <PillLink href='/projects'>
                                View projects
                            </PillLink>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default NotFound
