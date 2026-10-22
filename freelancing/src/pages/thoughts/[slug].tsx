import type { FC, ReactNode } from 'react'
import type { GetStaticPaths, GetStaticProps } from 'next'
import type { Thought } from '@/types'

import Link from 'next/link'

import { Seo } from '@/components/generals/seo'
import { CurtainMedia } from '@/components/motion/curtain-media'
import { Parallax } from '@/components/motion/media'
import {
    CharsIn,
    WordsIn,
    ScrubChars,
    Reveal,
    DrawLine
} from '@/components/motion/reveal'

import { thoughts, getThought, getOtherThoughts } from '@/constants/thoughts'
import { socialLinks } from '@/constants/navigation'

interface ThoughtPageProps {
    thought: Thought
    others: Thought[]
}

const ThoughtPage: FC<ThoughtPageProps> = ({
    thought,
    others
}): ReactNode => {
    return (
        <>
            <Seo
                title={thought.title}
                description={thought.excerpt}
                ogImage={thought.image}
            />

            <main>
                {/* Masthead */}
                <section
                    id='article-masthead'
                    className='bg-ink edge-x pb-[8vh] pt-[18vh] text-bone'
                >
                    <div className='flex flex-wrap items-center gap-x-5 gap-y-2'>
                        <Reveal y={14} trigger='load' delay={0.35}>
                            <time
                                dateTime={thought.date}
                                className='font-mono text-[14px] uppercase tracking-[-0.04em] text-dust'
                            >
                                {thought.dateLabel}
                            </time>
                        </Reveal>

                        <Reveal y={14} trigger='load' delay={0.42}>
                            <span className='label-mono text-acid'>
                                {thought.topic} / {thought.readMinutes} MIN READ
                            </span>
                        </Reveal>
                    </div>

                    <CharsIn
                        as='h1'
                        text={thought.title}
                        trigger='load'
                        delay={0.45}
                        stagger={0.012}
                        duration={1.15}
                        className='mt-7 max-w-[16ch] text-[clamp(34px,6.4vw,84px)] font-bold uppercase leading-[0.95] tracking-[-0.05em]'
                    />

                    <DrawLine
                        color='#292929'
                        trigger='load'
                        delay={0.7}
                        className='my-8'
                    />

                    <div className='grid grid-cols-1 gap-8 md:grid-cols-12'>
                        <WordsIn
                            text={thought.excerpt}
                            trigger='load'
                            delay={0.75}
                            stagger={0.022}
                            className='max-w-[48ch] text-[clamp(18px,2vw,26px)] font-semibold uppercase leading-[1.18] tracking-[-0.05em] text-smoke md:col-span-8'
                        />

                        <Reveal
                            y={18}
                            trigger='load'
                            delay={0.85}
                            className='flex items-center gap-4 md:col-span-3 md:col-start-10'
                        >
                            <img
                                src={thought.authorPhoto}
                                alt={thought.author}
                                width={52}
                                height={52}
                                loading='eager'
                                decoding='async'
                                className='size-[52px] shrink-0 object-cover'
                            />

                            <span>
                                <span className='block text-[16px] font-bold uppercase tracking-[-0.04em]'>
                                    {thought.author}
                                </span>

                                <span className='label-mono block text-dust'>
                                    {thought.authorRole}
                                </span>
                            </span>
                        </Reveal>
                    </div>
                </section>

                {/* Cover */}
                <section id='article-cover' className='bg-ink'>
                    <CurtainMedia
                        src={thought.image}
                        alt={thought.title}
                        mask='#050609'
                        zoom={1.3}
                        priority
                        className='h-[62vh] w-full md:h-[88vh]'
                    />
                </section>

                {/* Body */}
                <article
                    id='article-body'
                    className='bg-bone edge-x py-[12vh] text-ink'
                >
                    <div className='grid grid-cols-1 gap-10 lg:grid-cols-12'>
                        <aside className='lg:col-span-3'>
                            <div className='lg:sticky lg:top-[16vh]'>
                                <Reveal y={16}>
                                    <p className='label-mono text-dust'>
                                        FILED UNDER
                                    </p>

                                    <p className='mt-2 text-[20px] font-semibold uppercase leading-[1.15] tracking-[-0.06em]'>
                                        {thought.topic}
                                    </p>
                                </Reveal>

                                <DrawLine color='#292929' className='my-6' />

                                <Reveal y={16} delay={0.1}>
                                    <p className='label-mono text-dust'>
                                        SHARE
                                    </p>

                                    <div className='mt-3 flex flex-col gap-1'>
                                        {socialLinks.slice(2).map((link) => (
                                            <a
                                                key={link.label}
                                                href={link.href}
                                                target='_blank'
                                                rel='noreferrer'
                                                data-cursor='link'
                                                className='w-fit text-[14px] font-bold uppercase tracking-[-0.04em] transition-colors duration-300 hover:text-acid-dim'
                                            >
                                                {link.label}
                                            </a>
                                        ))}
                                    </div>
                                </Reveal>
                            </div>
                        </aside>

                        <div className='lg:col-span-8 lg:col-start-5'>
                            {thought.body.map((block, index) => (
                                <section
                                    key={index}
                                    className='mb-[7vh] last:mb-0'
                                >
                                    {block.heading && (
                                        <WordsIn
                                            as='h2'
                                            text={block.heading}
                                            stagger={0.04}
                                            className='mb-6 max-w-[22ch] text-[clamp(24px,2.8vw,34px)] font-bold uppercase leading-[1.05] tracking-[-0.05em]'
                                        />
                                    )}

                                    {block.paragraphs.map((paragraph, i) =>
                                        index === 0 && i === 0 ? (
                                            <ScrubChars
                                                key={i}
                                                text={paragraph}
                                                dim={0.16}
                                                className='mb-6 max-w-[62ch] text-[clamp(20px,2.2vw,28px)] font-semibold leading-[1.22] tracking-[-0.04em]'
                                            />
                                        ) : (
                                            <Reveal
                                                key={i}
                                                y={26}
                                                delay={i * 0.06}
                                                start='top 90%'
                                            >
                                                <p className='mb-6 max-w-[66ch] text-[17px] font-medium leading-[1.55] tracking-[-0.02em] text-graphite'>
                                                    {paragraph}
                                                </p>
                                            </Reveal>
                                        )
                                    )}
                                </section>
                            ))}

                            <DrawLine color='#292929' className='my-10' />

                            <Reveal y={22} className='flex items-center gap-5'>
                                <img
                                    src={thought.authorPhoto}
                                    alt={thought.author}
                                    width={72}
                                    height={72}
                                    loading='lazy'
                                    decoding='async'
                                    className='size-[72px] shrink-0 object-cover'
                                />

                                <div>
                                    <p className='text-[20px] font-bold uppercase tracking-[-0.05em]'>
                                        {thought.author}
                                    </p>

                                    <p className='label-mono mt-1 text-dust'>
                                        {thought.authorRole}
                                    </p>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </article>

                {/* More */}
                <section id='more-thoughts' className='bg-ink py-[10vh]'>
                    <div className='edge-x'>
                        <WordsIn
                            as='h2'
                            text='Keep reading'
                            stagger={0.06}
                            className='display-tight text-[clamp(34px,6vw,72px)] text-acid'
                        />
                    </div>

                    <div className='mt-[6vh] grid grid-cols-1 gap-px bg-hairline md:grid-cols-2'>
                        {others.slice(0, 4).map((other, index) => (
                            <Link
                                key={other.slug}
                                href={`/thoughts/${other.slug}`}
                                data-cursor='view'
                                className='group flex flex-col gap-5 bg-ink p-5 transition-colors duration-500 hover:bg-ink-soft md:p-7'
                            >
                                <Parallax speed={index % 2 ? 4 : -4}>
                                    <CurtainMedia
                                        src={other.image}
                                        alt={other.title}
                                        mask='#050609'
                                        staticZoom={1.04}
                                        className='aspect-[16/10] w-full'
                                        imageClassName='transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]'
                                    />
                                </Parallax>

                                <time
                                    dateTime={other.date}
                                    className='label-mono text-dust'
                                >
                                    {other.dateLabel}
                                </time>

                                <h3 className='max-w-[22ch] text-[clamp(20px,2vw,26px)] font-bold uppercase leading-[1.08] tracking-[-0.045em] text-bone transition-colors duration-500 group-hover:text-acid'>
                                    {other.title}
                                </h3>

                                <div className='mt-auto h-px w-full bg-hairline transition-colors duration-500 group-hover:bg-acid' />
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => ({
    paths: thoughts.map((thought) => ({ params: { slug: thought.slug } })),
    fallback: false
})

export const getStaticProps: GetStaticProps<ThoughtPageProps> = async ({
    params
}) => {
    const slug = params?.slug as string
    const thought = getThought(slug)

    if (!thought) return { notFound: true }

    return {
        props: {
            thought,
            others: [...getOtherThoughts(slug)]
        }
    }
}

export default ThoughtPage
