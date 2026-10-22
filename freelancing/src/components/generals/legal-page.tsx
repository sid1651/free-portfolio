import type { FC, ReactNode } from 'react'

import { Seo } from '@/components/generals/seo'
import { CharsIn, WordsIn, Reveal, DrawLine } from '@/components/motion/reveal'

import { studio } from '@/constants/site'

export interface LegalSection {
    heading: string
    paragraphs: readonly string[]
}

interface LegalPageProps {
    title: string
    intro: string
    updated: string
    sections: readonly LegalSection[]
}

export const LegalPage: FC<LegalPageProps> = ({
    title,
    intro,
    updated,
    sections
}): ReactNode => {
    return (
        <>
            <Seo title={title} description={intro} />

            <main className='bg-ink text-bone'>
                <section className='edge-x pb-[8vh] pt-[18vh]'>
                    <CharsIn
                        as='h1'
                        text={title}
                        trigger='load'
                        delay={0.3}
                        stagger={0.03}
                        className='display-tight text-[clamp(40px,10vw,132px)]'
                    />

                    <DrawLine
                        color='#292929'
                        trigger='load'
                        delay={0.55}
                        className='my-8'
                    />

                    <div className='grid grid-cols-1 gap-8 md:grid-cols-12'>
                        <WordsIn
                            text={intro}
                            trigger='load'
                            delay={0.6}
                            stagger={0.02}
                            className='max-w-[52ch] text-[clamp(17px,2vw,24px)] font-semibold leading-[1.3] tracking-[-0.04em] text-smoke md:col-span-8'
                        />

                        <Reveal
                            y={18}
                            trigger='load'
                            delay={0.7}
                            className='md:col-span-3 md:col-start-10'
                        >
                            <p className='label-mono text-dust'>
                                LAST UPDATED
                            </p>

                            <p className='mt-1 text-[15px] font-semibold tracking-[-0.03em]'>
                                {updated}
                            </p>
                        </Reveal>
                    </div>
                </section>

                <section className='bg-bone edge-x py-[12vh] text-ink'>
                    <div className='grid grid-cols-1 gap-10 lg:grid-cols-12'>
                        <div className='lg:col-span-8 lg:col-start-4'>
                            {sections.map((section, index) => (
                                <div key={section.heading} className='mb-14'>
                                    <div className='mb-4 flex items-baseline gap-4'>
                                        <span className='label-mono text-dust'>
                                            {String(index + 1).padStart(2, '0')}
                                        </span>

                                        <WordsIn
                                            as='h2'
                                            text={section.heading}
                                            stagger={0.04}
                                            className='text-[clamp(20px,2.4vw,30px)] font-black uppercase leading-[1.08] tracking-[-0.05em]'
                                        />
                                    </div>

                                    <DrawLine
                                        color='#292929'
                                        className='mb-5'
                                    />

                                    {section.paragraphs.map(
                                        (paragraph, paragraphIndex) => (
                                            <Reveal
                                                key={paragraphIndex}
                                                y={22}
                                                delay={paragraphIndex * 0.05}
                                                start='top 92%'
                                            >
                                                <p className='mb-4 max-w-[66ch] text-[16px] font-medium leading-[1.55] tracking-[-0.02em] text-graphite'>
                                                    {paragraph}
                                                </p>
                                            </Reveal>
                                        )
                                    )}
                                </div>
                            ))}

                            <Reveal y={22} start='top 94%'>
                                <p className='text-[15px] font-semibold tracking-[-0.03em]'>
                                    Questions about any of this go to{' '}
                                    <a
                                        href={`mailto:${studio.email}`}
                                        data-cursor='link'
                                        className='underline underline-offset-2 transition-colors duration-300 hover:text-acid-dim'
                                    >
                                        {studio.email}
                                    </a>
                                    .
                                </p>
                            </Reveal>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
