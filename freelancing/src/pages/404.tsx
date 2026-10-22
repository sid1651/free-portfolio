import type { FC, ReactNode } from 'react'

import Head from 'next/head'

import { AcidButton } from '@/components/generals/acid-button'
import { Marquee } from '@/components/motion/marquee'
import { CharsIn, WordsIn, Reveal } from '@/components/motion/reveal'

import { siteConfig } from '@/constants/site'

const NotFoundPage: FC = (): ReactNode => {
    return (
        <>
            <Head>
                <title>{`Not found - ${siteConfig.name}`}</title>
                <meta name='robots' content='noindex' />
            </Head>

            <main
                id='not-found'
                className='relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-ink pb-10 pt-[22vh] text-bone'
            >
                <div
                    aria-hidden='true'
                    className='grain-layer pointer-events-none absolute inset-0 opacity-[0.05]'
                />

                <div className='relative edge-x'>
                    <CharsIn
                        as='h1'
                        text='404'
                        trigger='load'
                        delay={0.3}
                        stagger={0.08}
                        duration={1.4}
                        from={125}
                        className='display-tight text-[38vw] leading-[0.76] text-acid'
                    />

                    <WordsIn
                        text='The page bent out of shape and left.'
                        trigger='load'
                        delay={0.6}
                        className='mt-6 max-w-[24ch] text-[clamp(20px,2.6vw,34px)] font-bold uppercase leading-[1.1] tracking-[-0.05em]'
                    />

                    <Reveal y={24} trigger='load' delay={0.78} className='mt-9'>
                        <AcidButton label='Back to the start' href='/' />
                    </Reveal>
                </div>

                <div className='relative mt-[10vh] border-t border-hairline py-4'>
                    <Marquee speed={30} repeat={5}>
                        <span className='label-mono px-6 text-dust'>
                            LOST SIGNAL / NO ROUTE / TRY THE WORK INSTEAD
                        </span>
                    </Marquee>
                </div>
            </main>
        </>
    )
}

export default NotFoundPage
