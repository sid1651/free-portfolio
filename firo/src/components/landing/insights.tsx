import type { FC, ReactNode } from 'react'
import type { PostSummary } from '@/types'

import Image from 'next/image'
import { useRef } from 'react'
import { cms } from '@/lib/cms'
import { cn } from '@/lib/utils'
import { useReveal } from '@/hooks/use-reveal'
import { ArrowLink } from '@/components/generals/arrow-link'
import { Eyebrow } from '@/components/generals/section-heading'
import { SplitWords } from '@/components/generals/split-words'
import { TransitionLink } from '@/components/generals/transition-link'
import { PostMeta } from '@/components/journal/post-meta'
import { insightsContent } from '@/constants/content'

interface InsightsProps {
    posts: PostSummary[]
}

export const Insights: FC<InsightsProps> = ({ posts = [] }): ReactNode => {
    const scope = useRef<HTMLElement>(null)

    useReveal(scope)

    if (posts.length === 0) return null

    const [lead, ...rest] = posts

    return (
        <section ref={scope} id='insights' aria-labelledby='insights-title' className='relative bg-ink py-28 text-bone md:py-40'>
            <div className='gutter'>
                <div className='flex flex-col gap-8 md:flex-row md:items-end md:justify-between'>
                    <div className='flex flex-col gap-8'>
                        <Eyebrow className='text-stone'>
                            {insightsContent.label}
                        </Eyebrow>

                        <h2 id='insights-title' className='font-wide text-big font-semibold uppercase tracking-[-0.05em]' data-reveal='words'>
                            <SplitWords text='AI Creative' />
                            <br />
                            <SplitWords text='Insights' wordClassName='font-serif font-normal normal-case italic tracking-[-0.02em] text-flare' />
                        </h2>
                    </div>

                    <div className='flex max-w-sm flex-col gap-6' data-reveal='fade'>
                        <p className='text-sm leading-relaxed text-stone'>
                            {insightsContent.description}
                        </p>

                        <ArrowLink href='/blog' className='self-start'>
                            Read the journal
                        </ArrowLink>
                    </div>
                </div>

                <article className='group mt-16 grid gap-8 border-t border-bone/15 pt-8 md:mt-24 md:grid-cols-12 md:gap-10'>
                    <TransitionLink href={`/blog/${lead.slug}`} className='relative block overflow-hidden md:col-span-7' data-cursor='Read' aria-label={`Read ${lead.title}`}>
                        <div className='relative aspect-[16/11] overflow-hidden bg-ink-raised'>
                            {lead.cover && (
                                <Image
                                    src={lead.cover}
                                    alt={lead.cover_alt ?? ''}
                                    fill
                                    sizes='(min-width: 768px) 58vw, 92vw'
                                    className='object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105'
                                />
                            )}
                        </div>
                    </TransitionLink>

                    <div className='flex flex-col justify-between gap-8 md:col-span-5'>
                        <div className='flex flex-col gap-6'>
                            <PostMeta post={lead} className='text-stone' />

                            <h3 className='font-wide text-title font-semibold uppercase tracking-[-0.04em]'>
                                <TransitionLink href={`/blog/${lead.slug}`} className='transition-colors hover:text-flare'>
                                    <span data-mdlfy-cms={cms('posts', lead.id, 'title')}>{lead.title}</span>
                                </TransitionLink>
                            </h3>

                            {lead.excerpt && (
                                <p className='max-w-md text-lead text-bone/80' data-mdlfy-cms={cms('posts', lead.id, 'excerpt')}>
                                    {lead.excerpt}
                                </p>
                            )}
                        </div>

                        <ArrowLink href={`/blog/${lead.slug}`} className='self-start'>
                            Read article
                        </ArrowLink>
                    </div>
                </article>

                {rest.length > 0 && (
                    <div className='mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-10'>
                        {rest.slice(0, 2).map((post, index) => (
                            <article
                                key={post.id}
                                className={cn('group flex flex-col gap-6', index === 0 ? 'md:col-span-5' : 'md:col-span-6 md:col-start-7 md:mt-28')}
                                data-reveal='fade'
                            >
                                <TransitionLink href={`/blog/${post.slug}`} className='relative block overflow-hidden' data-cursor='Read' aria-label={`Read ${post.title}`}>
                                    <div className={cn('relative overflow-hidden bg-ink-raised', index === 0 ? 'aspect-[4/5]' : 'aspect-[4/3]')}>
                                        {post.cover && (
                                            <Image
                                                src={post.cover}
                                                alt={post.cover_alt ?? ''}
                                                fill
                                                sizes='(min-width: 768px) 46vw, 92vw'
                                                className='object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105'
                                            />
                                        )}
                                    </div>
                                </TransitionLink>

                                <PostMeta post={post} className='text-stone' />

                                <h3 className='font-wide text-[clamp(1.4rem,2.2vw,2.2rem)] font-semibold uppercase leading-[0.98] tracking-[-0.035em]'>
                                    <TransitionLink href={`/blog/${post.slug}`} className='transition-colors hover:text-flare'>
                                        <span data-mdlfy-cms={cms('posts', post.id, 'title')}>{post.title}</span>
                                    </TransitionLink>
                                </h3>

                                {post.excerpt && (
                                    <p className='max-w-md text-sm leading-relaxed text-stone' data-mdlfy-cms={cms('posts', post.id, 'excerpt')}>
                                        {post.excerpt}
                                    </p>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
