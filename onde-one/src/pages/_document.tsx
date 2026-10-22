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
                <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
                <meta name='theme-color' content='#f2f4f8' />
            </Head>

            <body className='min-h-full flex flex-col'>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

export default Document
