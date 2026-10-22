import type { FC, ReactNode } from 'react'

import {
    Html,
    Head,
    Main,
    NextScript
} from 'next/document'

const Document: FC = (): ReactNode => {
    return (
        <Html lang='en'>
            <Head>
                <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
                <meta name='theme-color' content='#050609' />

                <noscript>
                    <style>
                        {`.split-char,.split-word,[data-line-inner]{opacity:1!important;transform:none!important}
                          .media-clip{clip-path:none!important}`}
                    </style>
                </noscript>
            </Head>

            <body className='min-h-full bg-ink'>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

export default Document
