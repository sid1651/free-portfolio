import type { FC, ReactNode } from 'react'

import Head from 'next/head'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/generals/logo'
import { siteConfig } from '@/constants/site'

const NotFound: FC = (): ReactNode => {
    return (
        <main className='flex min-h-screen flex-col bg-background px-5 py-6 md:px-10'>
            <Head>
                <title>
                    {`Page not found - ${siteConfig.name}`}
                </title>
            </Head>

            <Link href='/' aria-label='Arden, home' className='self-start rounded-full py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
                <Logo />
            </Link>

            <div className='flex flex-1 flex-col items-start justify-center gap-8'>
                <p className='font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground'>
                    Error 404
                </p>

                <h1 className='font-heading stretch-wide text-[clamp(3rem,11vw,10rem)] font-semibold uppercase leading-[0.86] tracking-[-0.05em]'>
                    Silence.
                </h1>

                <p className='max-w-md text-lg leading-relaxed text-muted-foreground'>
                    This page has gone quiet. The one you are looking for may have moved, or never existed at all.
                </p>

                <Link
                    href='/'
                    className='inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-[15px] font-medium text-background transition-colors hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                >
                    <ArrowLeft className='size-4' />
                    Back to Arden Halo
                </Link>
            </div>
        </main>
    )
}

export default NotFound
