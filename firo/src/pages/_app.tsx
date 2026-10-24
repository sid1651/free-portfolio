import '@/styles/globals.css'
import '@/styles/estate.css'

import type { FC, ReactNode } from 'react'
import type { AppProps } from 'next/app'

import Head from 'next/head'
const App: FC<AppProps> = ({ Component, pageProps }): ReactNode => {
    return (
        <>
            <Head>
                <meta name='viewport' content='width=device-width, initial-scale=1, viewport-fit=cover' />
            </Head>
            <Component {...pageProps} />
        </>
    )
}

export default App
