import type { FC, ReactNode } from 'react'

import Head from 'next/head'

import { AcidButton } from '@/components/generals/acid-button'
import { CharsIn, WordsIn, Reveal } from '@/components/motion/reveal'

import { siteConfig } from '@/constants/site'

const ServerErrorPage: FC = (): ReactNode => {
    return (
        <>
            <Head>
                <title>{`Something broke - ${siteConfig.name}`}</title>
                <meta name='robots' content='noindex' />
            </Head>

            <main
                id='server-error'
                className='relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink edge-x text-bone'
            >
                <div
                    aria-hidden='true'
                    className='grain-layer pointer-events-none absolute inset-0 opacity-[0.05]'
                />

                <div className='relative'>
                    <CharsIn
                        as='h1'
                        text='500'
                        trigger='load'
                        delay={0.3}
                        stagger={0.08}
                        duration={1.4}
                        from={125}
                        className='display-tight text-[30vw] leading-[0.78] text-acid'
                    />

                    <WordsIn
                        text='Something broke on this end. Give it a moment and try again.'
                        trigger='load'
                        delay={0.6}
                        className='mt-6 max-w-[26ch] text-[clamp(18px,2.2vw,30px)] font-bold uppercase leading-[1.12] tracking-[-0.05em]'
                    />

                    <Reveal y={24} trigger='load' delay={0.78} className='mt-9'>
                        <AcidButton label='Back to the start' href='/' />
                    </Reveal>
                </div>
            </main>
        </>
    )
}

export default ServerErrorPage
