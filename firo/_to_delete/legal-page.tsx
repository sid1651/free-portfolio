import type { FC, ReactNode } from 'react'

import { useRef } from 'react'
import { useIntro } from '@/hooks/use-intro'
import { Layout } from '@/components/generals/layout'
import { Seo } from '@/components/generals/seo'
import { SplitWords } from '@/components/generals/split-words'
import { RecLabel } from '@/components/generals/viewfinder'

export type LegalSection = {
    title: string
    paragraphs: string[]
}

interface LegalPageProps {
    title: string
    seoTitle: string
    description: string
    updated: string
    intro: string
    sections: LegalSection[]
}

/** Shared editorial layout for the terms and privacy pages. */
export const LegalPage: FC<LegalPageProps> = ({ title, seoTitle, description, updated, intro, sections }): ReactNode => {
    const scope = useRef<HTMLElement>(null)

    useIntro(scope, (timeline, root) => {
        timeline
            .from(root.querySelectorAll('[data-legal-title] [data-word]'), { yPercent: 120, duration: 1.3, stagger: 0.08 }, 0)
            .from(root.querySelectorAll('[data-legal-fade]'), { autoAlpha: 0, y: 24, duration: 1.1, stagger: 0.06 }, 0.4)
    })

    return (
        <Layout>
            <Seo title={seoTitle} description={description} />

            <article>
                <header ref={scope} className='bg-ink pb-16 pt-32 text-bone md:pb-24 md:pt-40'>
                    <div className='gutter'>
                        <div className='flex items-center justify-between gap-6' data-intro=''>
                            <span data-legal-fade=''>
                                <RecLabel label='Legal' />
                            </span>
                            <span className='eyebrow text-stone' data-legal-fade=''>
                                Last updated {updated}
                            </span>
                        </div>

                        <h1 className='mt-12 font-wide text-[clamp(2.8rem,9vw,10rem)] font-semibold uppercase leading-[0.85] tracking-[-0.055em] md:mt-16' data-intro='' data-legal-title=''>
                            <SplitWords text={title} />
                        </h1>

                        <p className='mt-10 max-w-2xl text-lead text-bone/85' data-intro=''>
                            <span className='block' data-legal-fade=''>
                                {intro}
                            </span>
                        </p>
                    </div>
                </header>

                <section className='bg-bone py-20 text-ink md:py-28' aria-label={title}>
                    <div className='gutter grid gap-12 md:grid-cols-12'>
                        <nav aria-label='On this page' className='md:col-span-3'>
                            <ol className='flex flex-col gap-3 border-t border-ink/15 pt-6 text-sm md:sticky md:top-28'>
                                {sections.map((section, index) => (
                                    <li key={section.title}>
                                        <a href={`#section-${index + 1}`} className='link-underline'>
                                            {String(index + 1).padStart(2, '0')}. {section.title}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </nav>

                        <div className='flex flex-col gap-14 md:col-span-7 md:col-start-5'>
                            {sections.map((section, index) => (
                                <section key={section.title} id={`section-${index + 1}`} className='scroll-mt-28 border-t border-ink/15 pt-8'>
                                    <h2 className='font-wide text-2xl font-semibold uppercase tracking-[-0.03em] md:text-3xl'>
                                        <span className='mr-3 text-flare'>{String(index + 1).padStart(2, '0')}</span>
                                        {section.title}
                                    </h2>

                                    <div className='mt-6 flex flex-col gap-4 text-base leading-relaxed text-ink/80 md:text-lg'>
                                        {section.paragraphs.map(paragraph => (
                                            <p key={paragraph}>
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </div>
                </section>
            </article>
        </Layout>
    )
}
