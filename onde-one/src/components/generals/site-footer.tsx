import type { FC, ReactNode } from 'react'

import { ArrowUp } from 'lucide-react'
import { Logo } from '@/components/generals/logo'

const COLUMNS = [
    {
        title: 'Admire it',
        links: [
            { label: 'Design', href: '#design' },
            { label: 'Materials', href: '#materials' },
            { label: 'Comfort', href: '#comfort' }
        ]
    },
    {
        title: 'Hear it',
        links: [
            { label: 'Sound', href: '#sound' },
            { label: 'Noise control', href: '#noise-control' },
            { label: 'Specifications', href: '#specs' }
        ]
    },
    {
        title: 'Live with it',
        links: [
            { label: 'Battery', href: '#battery' },
            { label: 'Controls', href: '#controls' },
            { label: 'Everyday life', href: '#lifestyle' }
        ]
    }
]

export const SiteFooter: FC = (): ReactNode => {
    return (
        <footer className='relative overflow-hidden border-t border-border bg-background'>
            <div className='mx-auto max-w-[1600px] px-5 pt-20 md:px-10 md:pt-28'>
                <div className='grid gap-14 md:grid-cols-12'>
                    <div className='md:col-span-5'>
                        <Logo />

                        <p className='mt-6 max-w-sm leading-relaxed text-muted-foreground'>
                            Arden Halo wireless headphones. Crafted to be admired, heard and lived with, every single day.
                        </p>

                        <a
                            href='#reserve'
                            className='mt-8 inline-flex h-11 items-center rounded-full border border-foreground/15 px-5 text-sm font-medium transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                        >
                            Reserve yours
                        </a>
                    </div>

                    <nav aria-label='Footer' className='grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-6 md:col-start-7'>
                        {COLUMNS.map((column) => (
                            <div key={column.title}>
                                <p className='font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground'>
                                    {column.title}
                                </p>

                                <ul className='mt-5 flex flex-col gap-3'>
                                    {column.links.map((link) => (
                                        <li key={link.href}>
                                            <a
                                                href={link.href}
                                                className='text-[15px] text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>

                <p
                    aria-hidden
                    className='mt-20 select-none font-heading stretch-wide text-[18.5vw] font-semibold uppercase leading-[0.74] tracking-[-0.06em] text-foreground/[0.07] md:mt-28 2xl:text-[17rem]'
                >
                    Arden
                </p>

                <div className='flex flex-col gap-4 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-end'>
                    <a
                        href='#hero'
                        className='inline-flex items-center gap-2 font-mono uppercase tracking-[0.2em] transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                    >
                        Back to top
                        <ArrowUp className='size-3.5' />
                    </a>
                </div>
            </div>
        </footer>
    )
}
