import type { FC, ReactNode } from 'react'
import type { GetStaticPaths, GetStaticProps } from 'next'
import type { Post, PostSummary } from '@/types'

import { ArrowLeft, ArrowUpRight, Check, Link2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { getPostBySlug, getPostSlugs, getPosts } from '@/lib/data'
import { cms } from '@/lib/cms'
import { useIntro } from '@/hooks/use-intro'
import { useReveal } from '@/hooks/use-reveal'
import { Layout } from '@/components/generals/layout'
import { Media } from '@/components/generals/media'
import { Seo } from '@/components/generals/seo'
import { TransitionLink } from '@/components/generals/transition-link'
import { PostMeta } from '@/components/journal/post-meta'
import { PostPair } from '@/components/journal/journal-layout'

interface ArticlePageProps {
    post: Post
    related: PostSummary[]
    next: PostSummary | null
}

const initials = (name: string): string => name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('')

const ShareLinks: FC<{ title: string }> = ({ title }): ReactNode => {
    const [url, setUrl] = useState('')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        setUrl(window.location.href)
    }, [title])

    if (!url) return null

    const copy = (): void => {
        navigator.clipboard?.writeText(url)
            .then(() => {
                setCopied(true)
                window.setTimeout(() => setCopied(false), 2200)
            })
            .catch(() => undefined)
    }

    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)

    return (
        <div className='flex flex-col gap-3'>
            <span className='eyebrow text-stone-deep'>
                Share
            </span>

            <div className='flex flex-wrap gap-2'>
                <button
                    type='button'
                    onClick={copy}
                    className='flex h-9 items-center gap-2 rounded-full border border-ink/20 px-4 text-xs transition-colors hover:border-ink hover:bg-ink hover:text-bone'
                >
                    {copied ? <Check className='size-3.5' aria-hidden='true' /> : <Link2 className='size-3.5' aria-hidden='true' />}
                    {copied ? 'Link copied' : 'Copy link'}
                </button>

                <a
                    href={`https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`}
                    target='_blank'
                    rel='noreferrer'
                    className='flex h-9 items-center rounded-full border border-ink/20 px-4 text-xs transition-colors hover:border-ink hover:bg-ink hover:text-bone'
                >
                    X
                </a>

                <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                    target='_blank'
                    rel='noreferrer'
                    className='flex h-9 items-center rounded-full border border-ink/20 px-4 text-xs transition-colors hover:border-ink hover:bg-ink hover:text-bone'
                >
                    LinkedIn
                </a>
            </div>
        </div>
    )
}

const ArticlePage: FC<ArticlePageProps> = ({ post, related, next }): ReactNode => {
    const headerRef = useRef<HTMLElement>(null)
    const bodyRef = useRef<HTMLDivElement>(null)

    useIntro(headerRef, (timeline, root) => {
        timeline
            .from(root.querySelectorAll('[data-article-rise]'), { yPercent: 110, duration: 1.4, stagger: 0.08 }, 0)
            .from(root.querySelectorAll('[data-article-fade]'), { autoAlpha: 0, y: 24, duration: 1.1, stagger: 0.07 }, 0.35)
    }, [post.id])

    useReveal(bodyRef, [post.id])

    return (
        <Layout>
            <Seo
                title={post.title}
                description={post.excerpt ?? `${post.title}, from the NOVAIR Studio journal.`}
                ogImage={post.cover ?? undefined}
                type='article'
            />

            <article>
                <header ref={headerRef} id='article-header' className='bg-bone pb-14 pt-32 text-ink md:pb-20 md:pt-40'>
                    <div className='gutter'>
                        <div className='flex flex-wrap items-center justify-between gap-6' data-intro=''>
                            <span data-article-fade=''>
                                <TransitionLink href='/blog' className='group inline-flex items-center gap-3 text-sm'>
                                    <span className='flex size-10 items-center justify-center rounded-full border border-ink/25 transition-colors duration-300 group-hover:bg-ink group-hover:text-bone'>
                                        <ArrowLeft className='size-4' aria-hidden='true' />
                                    </span>
                                    Journal
                                </TransitionLink>
                            </span>

                            <span data-article-fade=''>
                                <PostMeta post={post} className='text-stone-deep' />
                            </span>
                        </div>

                        <div className='mt-14 grid gap-10 md:mt-20 md:grid-cols-12' data-intro=''>
                            <h1 className='overflow-hidden pb-[0.08em] md:col-span-10'>
                                <span
                                    className='block font-wide text-[clamp(2.4rem,6.6vw,7.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]'
                                    data-article-rise=''
                                >
                                    <span data-mdlfy-cms={cms('posts', post.id, 'title')}>{post.title}</span>
                                </span>
                            </h1>

                            <div className='flex flex-col gap-8 md:col-span-7 md:col-start-6'>
                                {post.excerpt && (
                                    <p
                                        className='font-serif text-[clamp(1.6rem,2.8vw,2.75rem)] italic leading-[1.1] tracking-[-0.01em]'
                                        data-article-fade=''
                                        data-mdlfy-cms={cms('posts', post.id, 'excerpt')}
                                    >
                                        {post.excerpt}
                                    </p>
                                )}

                                {post.author && (
                                    <div className='flex items-center gap-4' data-article-fade=''>
                                        <span className='flex size-12 items-center justify-center rounded-full bg-ink font-wide text-sm font-semibold text-bone' aria-hidden='true'>
                                            {initials(post.author)}
                                        </span>
                                        <span className='flex flex-col'>
                                            <span className='eyebrow text-stone-deep'>
                                                Written by
                                            </span>
                                            <span className='text-base font-semibold' data-mdlfy-cms={cms('posts', post.id, 'author')}>
                                                {post.author}
                                            </span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <div ref={bodyRef}>
                    {post.cover && (
                        <div className='bg-bone'>
                            <div className='gutter'>
                                <Media
                                    src={post.cover}
                                    alt={post.cover_alt ?? ''}
                                    sizes='100vw'
                                    className='aspect-[4/3] md:aspect-[21/9]'
                                    parallax={10}
                                    reveal
                                    preload
                                />
                            </div>
                        </div>
                    )}

                    <section id='article-body' aria-label='Article' className='bg-bone py-20 text-ink md:py-28'>
                        <div className='gutter grid gap-12 md:grid-cols-12'>
                            <aside className='md:col-span-3'>
                                <div className='flex flex-col gap-8 border-t border-ink/15 pt-6 md:sticky md:top-28'>
                                    {post.category && (
                                        <div className='flex flex-col gap-2'>
                                            <span className='eyebrow text-stone-deep'>
                                                Category
                                            </span>
                                            <span className='text-sm font-medium' data-mdlfy-cms={cms('posts', post.id, 'category')}>
                                                {post.category}
                                            </span>
                                        </div>
                                    )}

                                    <ShareLinks title={post.title} />
                                </div>
                            </aside>

                            <div className='md:col-span-7 md:col-start-5'>
                                {post.body
                                    ? <div className='prose-novair' dangerouslySetInnerHTML={{ __html: post.body }} />
                                    : (
                                        <p className='text-stone-deep'>
                                            This article is being written. Check back soon.
                                        </p>
                                    )}

                                <div className='mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-ink/15 pt-8'>
                                    <span className='eyebrow text-stone-deep'>
                                        NOVAIR Studio / Journal
                                    </span>

                                    <TransitionLink href='/contact' className='group inline-flex items-center gap-2 text-sm font-medium'>
                                        <span className='link-underline'>
                                            Start a project with us
                                        </span>
                                        <ArrowUpRight className='size-4 transition-transform duration-500 group-hover:rotate-45' aria-hidden='true' />
                                    </TransitionLink>
                                </div>
                            </div>
                        </div>
                    </section>

                    {related.length > 0 && (
                        <section id='related' aria-labelledby='related-title' className='bg-ink py-24 text-bone md:py-36'>
                            <div className='gutter flex flex-col gap-16'>
                                <div className='flex items-end justify-between gap-6 border-t border-bone/12 pt-8'>
                                    <h2 id='related-title' className='font-wide text-title font-semibold uppercase tracking-[-0.04em]'>
                                        Keep{' '}
                                        <span className='font-serif font-normal normal-case italic tracking-[-0.01em] text-flare'>
                                            reading
                                        </span>
                                    </h2>

                                    <TransitionLink href='/blog' className='eyebrow link-underline text-stone hover:text-bone'>
                                        All articles
                                    </TransitionLink>
                                </div>

                                <PostPair posts={related} />
                            </div>
                        </section>
                    )}

                    {next && (
                        <section id='next-article' aria-label='Next article' className='border-t border-bone/12 bg-ink text-bone'>
                            <TransitionLink href={`/blog/${next.slug}`} className='gutter group flex flex-col gap-6 py-20 md:flex-row md:items-end md:justify-between md:py-28' data-cursor='Read'>
                                <div className='flex flex-col gap-5'>
                                    <span className='eyebrow text-stone'>
                                        Next article
                                    </span>
                                    <span className='max-w-5xl font-wide text-[clamp(2rem,5.4vw,5.75rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em] transition-colors duration-500 group-hover:text-flare'>
                                        <span data-mdlfy-cms={cms('posts', next.id, 'title')}>{next.title}</span>
                                    </span>
                                </div>

                                <span className='flex size-16 shrink-0 items-center justify-center rounded-full border border-bone/25 transition-all duration-700 group-hover:rotate-45 group-hover:border-flare group-hover:bg-flare group-hover:text-ink md:size-24'>
                                    <ArrowUpRight className='size-6' aria-hidden='true' />
                                </span>
                            </TransitionLink>
                        </section>
                    )}
                </div>
            </article>
        </Layout>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        const slugs = await getPostSlugs()
        return { paths: slugs.map(slug => ({ params: { slug } })), fallback: 'blocking' }
    }
    catch (error) {
        console.error('Article paths failed to load:', error instanceof Error ? error.message : error)
        return { paths: [], fallback: 'blocking' }
    }
}

export const getStaticProps: GetStaticProps<ArticlePageProps, { slug: string }> = async ({ params }) => {
    const slug = params?.slug

    if (!slug) return { notFound: true }

    try {
        const [post, posts] = await Promise.all([getPostBySlug(slug), getPosts()])

        if (!post) return { notFound: true, revalidate: 30 }

        const others = posts.filter(item => item.slug !== slug)
        const sameCategory = others.filter(item => item.category && item.category === post.category)
        const related = [...sameCategory, ...others.filter(item => !sameCategory.includes(item))].slice(0, 2)

        const ordered = [...posts].sort((a, b) => a.sort_order - b.sort_order)
        const currentIndex = ordered.findIndex(item => item.slug === slug)
        const nextPost = ordered.length > 1 ? ordered[(currentIndex + 1) % ordered.length] : null

        return {
            props: {
                post,
                related,
                next: nextPost && nextPost.slug !== slug ? nextPost : null
            },
            revalidate: 60
        }
    }
    catch (error) {
        console.error(`Article "${slug}" failed to load:`, error instanceof Error ? error.message : error)
        return { notFound: true, revalidate: 30 }
    }
}

export default ArticlePage
