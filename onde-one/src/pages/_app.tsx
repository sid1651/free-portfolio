import '@/styles/globals.css'

import type { FC, ReactNode } from 'react'
import type { AppProps } from 'next/app'

import Head from 'next/head'
import { Archivo, DM_Mono } from 'next/font/google'
import { SmoothScroll } from '@/components/generals/smooth-scroll'

const sans = Archivo({
    subsets: ['latin'],
    axes: ['wdth']
})

const mono = DM_Mono({
    subsets: ['latin'],
    weight: ['400', '500']
})

const fontVariables = `:root{--font-app-sans:${sans.style.fontFamily};--font-app-mono:${mono.style.fontFamily};--font-app-heading:${sans.style.fontFamily}}`

const App: FC<AppProps> = ({ Component, pageProps }): ReactNode => {
    return (
        <div className='h-full font-sans'>
            <Head>
                <style dangerouslySetInnerHTML={{ __html: fontVariables }} />
            </Head>

            <SmoothScroll>
                <Component {...pageProps} />
            </SmoothScroll>
        </div>
    )
}

export default App
