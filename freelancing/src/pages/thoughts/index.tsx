import type { FC, ReactNode } from 'react'

import Link from 'next/link'

import { Seo } from '@/components/generals/seo'
import { CurtainMedia } from '@/components/motion/curtain-media'
import { Parallax } from '@/components/motion/media'
import {
    CharsIn,
    WordsIn,
    LinesIn,
    Reveal,
    DrawLine
} from '@/components/motion/reveal'

import { thoughts } from '@/constants/thoughts'
import { studio } from '@/constants/site'

const ThoughtsPage: FC = (): ReactNode => {
    return (
        <>
            <Seo
                title='Thoughts'
                description='Project notes from Alchemy on portfolio design, product presentation and digital storefronts.'
                ogImage={thoughts[0].image}
            />

            <main id='thoughts'>
                {/* Masthead */}
                <section
                    id='thoughts-masthead'
                    className='bg-bone edge-x pb-6 pt-[16vh] text-ink'
                >
                    <CharsIn
                        as='h1'
                        text='Thoughts'
                        trigger='load'
                        delay={0.25}
                        stagger={0.05}
                        duration={1.3}
                        className='w-full text-[19vw] font-bold uppercase leading-[0.86] tracking-[-0.08em]'
                    />

                    <div className='mt-4 flex items-center gap-4'>
                        <span
                            aria-hidden='true'
                            className='grid shrink-0 grid-cols-2 gap-[2px]'
                        >
                            {[0, 1, 2, 3].map((dot) => (
                                <span
                                    key={dot}
                                    className={
                                        dot === 1
                                            ? 'block size-[3px] bg-transparent'
                                            : 'block size-[3px] bg-ink'
                                    }
                                />
                            ))}
                        </span>

                        <WordsIn
                            text={`THE ${studio.brand.toUpperCase()} BLOG`}
                            trigger='load'
                            delay={0.5}
                            className='label-mono shrink-0 text-ink'
                        />

                        <DrawLine
                            color='#292929'
                            trigger='load'
                            delay={0.55}
                            duration={1.6}
                        />
                    </div>
                </section>

                {/* Statement */}
                <section
                    id='thoughts-statement'
                    className='bg-ink edge-x py-[9vh] text-bone'
                >
                    <LinesIn
                        as='h2'
                        lines={[
                            <>
                                the archive of{' '}
                                <span className='text-acid'>Thoughts</span>
                            </>,
                            'I can keep in one place.'
                        ]}
                        stagger={0.11}
                        skew={2}
                        className='display-tight text-[clamp(34px,6.2vw,70px)] font-bold'
                    />
                </section>

                {/* Index */}
                <section id='thoughts-index' className='bg-bone text-ink'>
                    <h2 className='sr-only'>Latest writing</h2>

                    {thoughts.map((thought, index) => (
                        <article
                            key={thought.slug}
                            className='relative border-b border-hairline/20 last:border-b-0'
                        >
                            <Link
                                href={`/thoughts/${thought.slug}`}
                                data-cursor='view'
                                className='group grid grid-cols-1 items-stretch lg:grid-cols-2'
                            >
                                <div
                                    className={`relative flex flex-col justify-between edge-x py-10 lg:py-[9vh] ${
                                        index % 2 === 1
                                            ? 'lg:order-2'
                                            : 'lg:order-1'
                                    }`}
                                >
                                    <div
                                        aria-hidden='true'
                                        className='pointer-events-none absolute inset-0 opacity-[0.55]'
                                        style={{
                                            backgroundImage:
                                                'url(/images/e3CWgI0qLeMyFqQQSGJ3tutLM.svg)',
                                            backgroundRepeat: 'repeat',
                                            backgroundSize: '10px auto'
                                        }}
                                    />

                                    <div className='relative'>
                                        <Reveal y={16} className='mb-4'>
                                            <time
                                                dateTime={thought.date}
                                                className='font-mono text-[14px] uppercase tracking-[-0.04em] text-graphite'
                                            >
                                                {thought.dateLabel}
                                            </time>
                                        </Reveal>

                                        <WordsIn
                                            as='h3'
                                            text={thought.title}
                                            stagger={0.035}
                                            from={75}
                                            duration={1.25}
                                            className='max-w-[18ch] text-[clamp(28px,3.4vw,42px)] font-bold uppercase leading-[1.02] tracking-[-0.045em]'
                                        />

                                        <DrawLine
                                            color='#292929'
                                            thickness={2}
                                            delay={0.18}
                                            className='my-5'
                                        />

                                        <CharsIn
                                            text={thought.excerpt}
                                            stagger={0.006}
                                            duration={0.9}
                                            delay={0.22}
                                            className='max-w-[46ch] text-[clamp(16px,1.5vw,20px)] font-semibold uppercase leading-[1.2] tracking-[-0.06em]'
                                        />
                                    </div>

                                    <div className='relative mt-12 flex items-center gap-4'>
                                        <Reveal y={21} delay={0.3}>
                                            <img
                                                src={thought.authorPhoto}
                                                alt={thought.author}
                                                width={52}
                                                height={52}
                                                loading='lazy'
                                                decoding='async'
                                                className='size-[52px] object-cover'
                                            />
                                        </Reveal>

                                        <Reveal y={12} delay={0.36}>
                                            <p className='text-[16px] font-bold uppercase tracking-[-0.04em]'>
                                                by {thought.author}
                                            </p>
                                        </Reveal>
                                    </div>
                                </div>

                                <div
                                    className={`relative h-[58vh] lg:h-auto lg:min-h-[76vh] ${
                                        index % 2 === 1
                                            ? 'lg:order-1'
                                            : 'lg:order-2'
                                    }`}
                                >
                                    <Parallax
                                        speed={index % 2 === 0 ? 6 : -6}
                                        className='size-full'
                                    >
                                        <CurtainMedia
                                            src={thought.image}
                                            alt={thought.title}
                                            mask='#f2f2f2'
                                            curtain={
                                                index % 2 === 0
                                                    ? 'split'
                                                    : 'inverted'
                                            }
                                            zoom={1.3}
                                            caption={thought.topic}
                                            sublabel={`${thought.readMinutes} min read`}
                                            className='size-full'
                                            imageClassName='transition-[filter] duration-[900ms] ease-out group-hover:brightness-110'
                                        />
                                    </Parallax>
                                </div>
                            </Link>
                        </article>
                    ))}
                </section>
            </main>
        </>
    )
}

export default ThoughtsPage
