import type { FC, ReactNode } from 'react'
import type { LayoutProps } from '@/types'

import { Footer } from '@/components/generals/footer'
import { Header } from '@/components/generals/header'

export const Layout: FC<LayoutProps> = ({ children, showCta = true }): ReactNode => {
    return (
        <div className='flex min-h-screen flex-col bg-ink text-bone'>
            <Header />

            <main id='main' className='flex-1'>
                {children}
            </main>

            <Footer showCta={showCta} />
        </div>
    )
}
