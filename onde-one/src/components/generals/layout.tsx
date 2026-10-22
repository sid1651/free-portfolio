import type { FC, ReactNode } from 'react'
import type { LayoutProps } from '@/types'

import { SiteNav } from '@/components/generals/site-nav'
import { SiteFooter } from '@/components/generals/site-footer'

export const Layout: FC<LayoutProps> = ({ children }): ReactNode => {
    return (
        <div className='flex min-h-screen flex-col'>
            <a
                href='#main'
                className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background'
            >
                Skip to content
            </a>

            <SiteNav />

            <main id='main' tabIndex={-1} className='flex-1 outline-none'>
                {children}
            </main>

            <SiteFooter />
        </div>
    )
}
