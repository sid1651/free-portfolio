import '@/styles/globals.css'

import type { FC, ReactNode } from 'react'
import type { AppProps } from 'next/app'

import Head from 'next/head'
import { Inter, IBM_Plex_Mono } from 'next/font/google'

import { SmoothScroll } from '@/components/generals/smooth-scroll'
import { PageTransition } from '@/components/generals/page-transition'
import { Cursor } from '@/components/generals/cursor'
import { SiteNav } from '@/components/generals/site-nav'
import { SiteFooter } from '@/components/generals/site-footer'

/* Inter is a variable face, so the whole 100–900 range ships as one file. */
const sans = Inter({
    subsets: ['latin'],
    display: 'swap',
    fallback: ['system-ui', 'Helvetica Neue', 'Arial', 'sans-serif']
})

const mono = IBM_Plex_Mono({
    subsets: ['latin'],
    weight: ['400', '500'],
    display: 'swap',
    fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
})

const fontVariables = `:root{--font-app-sans:${sans.style.fontFamily};--font-app-mono:${mono.style.fontFamily};--font-app-heading:${sans.style.fontFamily}}`

const App: FC<AppProps> = ({ Component, pageProps }): ReactNode => {
    return (
        <div className='font-sans'>
            <Head>
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1, viewport-fit=cover'
                />
                <style dangerouslySetInnerHTML={{ __html: fontVariables }} />
            </Head>

            <SmoothScroll>
                <PageTransition>
                    <Cursor />
                    <SiteNav />

                    <Component {...pageProps} />

                    <SiteFooter />
                </PageTransition>
            </SmoothScroll>
        </div>
    )
}

export default App
