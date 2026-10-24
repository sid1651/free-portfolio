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
                <link rel='mask-icon' href='/favicon.svg' color='#203d34' />
                <meta name='theme-color' content='#203d34' />
                <meta name='color-scheme' content='light' />
            </Head>

            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

export default Document
