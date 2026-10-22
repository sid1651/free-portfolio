import type { FC, ReactNode } from 'react'
import type { PostSummary } from '@/types'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { cms } from '@/lib/cms'
import { formatDate, pad } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useHoverPreview } from '@/hooks/use-hover-preview'
import { ArrowLink } from '@/components/generals/arrow-link'
import { Media } from '@/components/generals/media'
import { TransitionLink } from '@/components/generals/transition-link'
import { PostMeta } from '@/components/journal/post-meta'

interface PostProps {
    post: PostSummary
}

/** The lead story: a wide frame with the headline set beside it. */
export const FeaturedPost: FC<PostProps> = ({ post }): ReactNode => {
    const href = `/blog/${post.slug}`

    return (
        <article className='group grid gap-8 md:grid-cols-12 md:gap-10'>
            <TransitionLink href={href} className='relative block md:col-span-8' data-cursor='Read' aria-label={`Read ${post.title}`}>
                <Media
                    src={post.cover ?? ''}
                    alt={post.cover_alt ?? ''}
                    sizes='(min-width: 768px) 64vw, 92vw'
                    className='aspect-[4/3] md:aspect-[16/10]'
                    imageClassName='transition-transform duration-[1.6s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105'
                    reveal
                >
                    <span className='eyebrow absolute left-5 top-5 z-10 rounded-full bg-flare px-3 py-1.5 text-ink'>
                        Featured
                    </span>
                </Media>
            </TransitionLink>

            <div className='flex flex-col justify-between gap-10 md:col-span-4'>
                <div className='flex flex-col gap-6'>
                    <PostMeta post={post} className='text-stone' />

                    <h2 className='font-wide text-[clamp(2rem,3.6vw,3.75rem)] font-semibold uppercase leading-[0.92] tracking-[-0.045em]'>
                        <TransitionLink href={href} className='transition-colors duration-500 hover:text-flare'>
                            <span data-mdlfy-cms={cms('posts', post.id, 'title')}>{post.title}</span>
                        </TransitionLink>
                    </h2>

                    {post.excerpt && (
                        <p className='font-serif text-[clamp(1.4rem,2vw,1.9rem)] italic leading-tight text-bone/85' data-mdlfy-cms={cms('posts', post.id, 'excerpt')}>
                            {post.excerpt}
                        </p>
                    )}
                </div>

                <div className='flex items-center justify-between gap-4 border-t border-bone/12 pt-5'>
                    {post.author && (
                        <span className='text-sm text-stone'>
                            By <span className='text-bone' data-mdlfy-cms={cms('posts', post.id, 'author')}>{post.author}</span>
                        </span>
                    )}

                    <ArrowLink href={href}>
                        Full article
                    </ArrowLink>
                </div>
            </div>
        </article>
    )
}

interface PostPairProps {
    posts: PostSummary[]
}

/** Two supporting stories set at different scales and heights. */
export const PostPair: FC<PostPairProps> = ({ posts }): ReactNode => {
    return (
        <div className='grid gap-16 md:grid-cols-12 md:gap-10'>
            {posts.map((post, index) => {
                const href = `/blog/${post.slug}`

                return (
                    <article
                        key={post.id}
                        className={cn('group flex flex-col gap-6', index === 0 ? 'md:col-span-5' : 'md:col-span-6 md:col-start-7 md:mt-[22vh]')}
                    >
                        <TransitionLink href={href} className='relative block' data-cursor='Read' aria-label={`Read ${post.title}`}>
                            <Media
                                src={post.cover ?? ''}
                                alt={post.cover_alt ?? ''}
                                sizes='(min-width: 768px) 46vw, 92vw'
                                className={index === 0 ? 'aspect-[4/5]' : 'aspect-[4/3]'}
                                imageClassName='transition-transform duration-[1.6s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105'
                                reveal
                            />
                        </TransitionLink>

                        <PostMeta post={post} className='text-stone' />

                        <h3 className='font-wide text-[clamp(1.6rem,2.6vw,2.6rem)] font-semibold uppercase leading-[0.95] tracking-[-0.04em]'>
                            <TransitionLink href={href} className='transition-colors duration-500 hover:text-flare'>
                                <span data-mdlfy-cms={cms('posts', post.id, 'title')}>{post.title}</span>
                            </TransitionLink>
                        </h3>

                        {post.excerpt && (
                            <p className='max-w-md text-base leading-relaxed text-stone' data-mdlfy-cms={cms('posts', post.id, 'excerpt')}>
                                {post.excerpt}
                            </p>
                        )}
                    </article>
                )
            })}
        </div>
    )
}

interface PostIndexProps {
    posts: PostSummary[]
    startIndex: number
}

/** Remaining stories as a typographic index; hovering a row floats its cover beside the cursor. */
export const PostIndex: FC<PostIndexProps> = ({ posts, startIndex }): ReactNode => {
    const listRef = useRef<HTMLUListElement>(null)
    const previewRef = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState<number | null>(null)
    const clear = useCallback(() => setActive(null), [])

    useHoverPreview(listRef, previewRef, clear)

    return (
        <div className='relative'>
            <ul ref={listRef} className='border-t border-bone/12'>
                {posts.map((post, index) => {
                    const href = `/blog/${post.slug}`

                    return (
                        <li key={post.id} className='border-b border-bone/12'>
                            <article
                                className='group relative grid grid-cols-[auto_1fr] items-start gap-x-5 gap-y-3 py-7 md:grid-cols-12 md:items-center md:gap-6 md:py-9'
                                onMouseEnter={() => setActive(index)}
                            >
                                <span className='eyebrow pt-1 text-stone md:col-span-1 md:pt-0'>
                                    {pad(startIndex + index + 1)}
                                </span>

                                <div className='flex flex-col gap-3 md:col-span-7'>
                                    <h3 className='font-wide text-[clamp(1.4rem,2.8vw,2.9rem)] font-semibold uppercase leading-[0.95] tracking-[-0.04em] transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] md:group-hover:translate-x-4'>
                                        <TransitionLink
                                            href={href}
                                            className='transition-colors duration-500 hover:text-flare'
                                            onFocus={() => setActive(index)}
                                            data-cursor='Read'
                                        >
                                            <span data-mdlfy-cms={cms('posts', post.id, 'title')}>{post.title}</span>
                                        </TransitionLink>
                                    </h3>

                                    {post.excerpt && (
                                        <p className='max-w-lg text-sm leading-relaxed text-stone' data-mdlfy-cms={cms('posts', post.id, 'excerpt')}>
                                            {post.excerpt}
                                        </p>
                                    )}
                                </div>

                                <div className='col-start-2 flex items-center gap-4 md:col-span-3 md:col-start-auto md:flex-col md:items-start md:gap-1'>
                                    {post.category && (
                                        <span className='eyebrow text-flare' data-mdlfy-cms={cms('posts', post.id, 'category')}>
                                            {post.category}
                                        </span>
                                    )}
                                    {post.published_at && (
                                        <time className='eyebrow text-stone' dateTime={post.published_at}>
                                            {formatDate(post.published_at)}
                                        </time>
                                    )}
                                </div>

                                <TransitionLink
                                    href={href}
                                    className='hidden justify-self-end md:col-span-1 md:flex'
                                    tabIndex={-1}
                                    aria-hidden='true'
                                >
                                    <span className='flex size-11 items-center justify-center rounded-full border border-bone/20 transition-colors duration-500 group-hover:border-flare group-hover:bg-flare group-hover:text-ink'>
                                        <ArrowUpRight className='size-4 transition-transform duration-500 group-hover:rotate-45' />
                                    </span>
                                </TransitionLink>
                            </article>
                        </li>
                    )
                })}
            </ul>

            <div
                ref={previewRef}
                className='pointer-events-none invisible absolute left-0 top-0 z-20 hidden h-64 w-52 overflow-hidden md:block lg:h-80 lg:w-64'
                aria-hidden='true'
            >
                {posts.map((post, index) => (
                    <div
                        key={post.id}
                        className={cn(
                            'absolute inset-0 transition-[clip-path] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]',
                            active === index ? '[clip-path:inset(0%_0%_0%_0%)]' : '[clip-path:inset(100%_0%_0%_0%)]'
                        )}
                        style={{ zIndex: active === index ? 2 : 1 }}
                    >
                        {post.cover && <Image src={post.cover} alt='' fill sizes='256px' className='object-cover' />}
                    </div>
                ))}
            </div>
        </div>
    )
}
