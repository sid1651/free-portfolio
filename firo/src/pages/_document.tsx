import type { FC, ReactNode } from 'react'

import {
    Html,
    Head,
    Main,
    NextScript
} from 'next/document'

const enableMotionClass = "document.documentElement.classList.add('js')"

const Document: FC = (): ReactNode => {
    return (
        <Html lang='en'>
            <Head>
                <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
                <link rel='mask-icon' href='/favicon.svg' color='#ff6b2b' />
                <meta name='theme-color' content='#0b0b0a' />
                <meta name='color-scheme' content='dark' />
                <script dangerouslySetInnerHTML={{ __html: enableMotionClass }} />
            </Head>

            <body className='min-h-full flex flex-col bg-ink text-bone'>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

export default Document
