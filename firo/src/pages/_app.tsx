import '@/styles/globals.css'

import type { FC, ReactNode } from 'react'
import type { AppProps } from 'next/app'

import Head from 'next/head'
import { Archivo, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import { Cursor } from '@/components/generals/cursor'
import { PageTransitionProvider } from '@/components/generals/page-transition'
import { PersonBlur } from '@/components/generals/person-blur'
import { SmoothScroll } from '@/components/generals/smooth-scroll'

const sans = Archivo({
    subsets: ['latin'],
    axes: ['wdth'],
    display: 'swap'
})

const serif = Instrument_Serif({
    subsets: ['latin'],
    weight: '400',
    style: ['normal', 'italic'],
    display: 'swap'
})

const mono = JetBrains_Mono({
    subsets: ['latin'],
    display: 'swap'
})

const fontVariables = `:root{--font-app-sans:${sans.style.fontFamily};--font-app-mono:${mono.style.fontFamily};--font-app-heading:${sans.style.fontFamily};--font-app-serif:${serif.style.fontFamily}}`

const App: FC<AppProps> = ({ Component, pageProps }): ReactNode => {
    return (
        <div className='h-full font-sans'>
            <Head>
                <style dangerouslySetInnerHTML={{ __html: fontVariables }} />
                <meta name='viewport' content='width=device-width, initial-scale=1, viewport-fit=cover' />
            </Head>

            <SmoothScroll>
                <PageTransitionProvider>
                    <Component {...pageProps} />
                    <Cursor />
                    <PersonBlur />
                    <div className='grain' aria-hidden='true' />
                </PageTransitionProvider>
            </SmoothScroll>
        </div>
    )
}

export default App
