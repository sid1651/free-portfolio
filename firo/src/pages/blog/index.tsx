import type { FC, ReactNode } from 'react'
import type { GetStaticProps } from 'next'
import type { PostSummary } from '@/types'

import { useRouter } from 'next/router'

import {
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react'

import { getPosts } from '@/lib/data'
import { pad, slugify } from '@/lib/format'
import { gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { cn } from '@/lib/utils'
import { useIntro } from '@/hooks/use-intro'
import { useReveal } from '@/hooks/use-reveal'
import { Layout } from '@/components/generals/layout'
import { Seo } from '@/components/generals/seo'
import { SplitWords } from '@/components/generals/split-words'
import { RecLabel } from '@/components/generals/viewfinder'
import { FeaturedPost, PostIndex, PostPair } from '@/components/journal/journal-layout'
import { journalPageContent } from '@/constants/content'
import { categories } from '@/constants/site'

interface JournalPageProps {
    posts: PostSummary[]
}

const JournalPage: FC<JournalPageProps> = ({ posts = [] }): ReactNode => {
    const router = useRouter()
    const heroRef = useRef<HTMLElement>(null)
    const listRef = useRef<HTMLDivElement>(null)
    const [filter, setFilter] = useState('all')

    const filters = useMemo(() => [
        { slug: 'all', label: 'All', count: posts.length },
        ...categories.map(category => ({
            slug: slugify(category),
            label: category,
            count: posts.filter(post => post.category === category).length
        }))
    ], [posts])

    const visible = useMemo(() => {
        if (filter === 'all') return posts
        return posts.filter(post => slugify(post.category ?? '') === filter)
    }, [filter, posts])

    const [lead, ...others] = visible
    const pair = others.slice(0, 2)
    const rest = others.slice(2)

    useIntro(heroRef, (timeline, root) => {
        timeline
            .from(root.querySelectorAll('[data-journal-title] [data-word]'), { yPercent: 120, duration: 1.4, stagger: 0.1 }, 0)
            .from(root.querySelectorAll('[data-journal-fade]'), { autoAlpha: 0, y: 26, duration: 1.2, stagger: 0.08 }, 0.5)
    })

    useReveal(listRef, [filter])

    useEffect(() => {
        if (!router.isReady) return

        const requested = typeof router.query.filter === 'string' ? router.query.filter : 'all'
        if (filters.some(item => item.slug === requested)) setFilter(requested)
    }, [router.isReady, router.query.filter, filters])

    useEffect(() => {
        const list = listRef.current
        if (!list) return

        gsap.to(list, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'expo.out' })
        requestAnimationFrame(() => ScrollTrigger.refresh())
    }, [filter])

    const selectFilter = (slug: string): void => {
        if (slug === filter) return

        const list = listRef.current

        const apply = (): void => {
            setFilter(slug)
            const query = slug === 'all' ? {} : { filter: slug }
            router.replace({ pathname: router.pathname, query }, undefined, { shallow: true, scroll: false }).catch(() => undefined)
        }

        if (!list) {
            apply()
            return
        }

        gsap.to(list, { autoAlpha: 0, y: 24, duration: 0.35, ease: 'power2.in', onComplete: apply })
    }

    return (
        <Layout>
            <Seo
                title='Journal'
                description='AI creative insights from NOVAIR Studio on generative imagery, product storytelling, ecommerce visuals and building distinctive brands with AI.'
            />

            <section ref={heroRef} id='journal-hero' aria-labelledby='journal-title' className='relative overflow-hidden bg-ink pb-16 pt-32 text-bone md:pb-24 md:pt-40'>
                <div className='nova-bloom pointer-events-none absolute -right-[20vw] -top-[20vw] size-[70vw] opacity-20' aria-hidden='true' />

                <div className='gutter relative'>
                    <div className='flex items-center justify-between gap-6' data-intro=''>
                        <span data-journal-fade=''>
                            <RecLabel label={journalPageContent.eyebrow} />
                        </span>

                        <span className='eyebrow text-stone' data-journal-fade=''>
                            Journal / {pad(posts.length)} Articles
                        </span>
                    </div>

                    <div className='mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:items-end'>
                        <h1 id='journal-title' className='md:col-span-9' data-intro='' data-journal-title=''>
                            <span className='block font-wide text-[clamp(3rem,11vw,12.5rem)] font-semibold uppercase leading-[0.82] tracking-[-0.06em]'>
                                <SplitWords text='AI Creative' />
                            </span>
                            <span className='block font-serif text-[clamp(3.2rem,12vw,13.5rem)] italic leading-[0.86] tracking-[-0.03em] text-flare'>
                                <SplitWords text='Insights' />
                            </span>
                        </h1>

                        <div className='flex flex-col gap-4 md:col-span-3' data-intro=''>
                            <span className='eyebrow text-bone' data-journal-fade=''>
                                {journalPageContent.kicker}
                            </span>
                            <p className='text-sm leading-relaxed text-stone' data-journal-fade=''>
                                {journalPageContent.description}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id='articles' aria-label='Articles' className='bg-ink pb-32 text-bone md:pb-44'>
                <div className='gutter'>
                    <div className='flex flex-col gap-6 border-y border-bone/12 py-5 md:flex-row md:items-center md:justify-between'>
                        <span className='eyebrow text-stone'>
                            Showing {pad(visible.length)} of {pad(posts.length)}
                        </span>

                        <div className='no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1' role='group' aria-label='Filter articles by category'>
                            {filters.map(item => (
                                <button
                                    key={item.slug}
                                    type='button'
                                    onClick={() => selectFilter(item.slug)}
                                    aria-pressed={filter === item.slug}
                                    disabled={item.count === 0}
                                    className={cn(
                                        'flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-35',
                                        filter === item.slug ? 'border-bone bg-bone text-ink' : 'border-bone/20 text-bone hover:border-bone/60'
                                    )}
                                >
                                    {item.label}
                                    <sup className='text-[0.65em] opacity-60'>
                                        {item.count}
                                    </sup>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div ref={listRef} className='mt-14 flex flex-col gap-24 md:mt-20 md:gap-36'>
                        {lead
                            ? <FeaturedPost post={lead} />
                            : (
                                <p className='py-24 text-center text-stone'>
                                    New articles are on their way. Check back soon.
                                </p>
                            )}

                        {pair.length > 0 && <PostPair posts={pair} />}

                        {rest.length > 0 && (
                            <div className='flex flex-col gap-10'>
                                <div className='flex items-end justify-between gap-6'>
                                    <h2 className='font-wide text-title font-semibold uppercase tracking-[-0.04em]'>
                                        More from the journal
                                    </h2>
                                    <span className='eyebrow text-stone'>
                                        Index
                                    </span>
                                </div>

                                <PostIndex posts={rest} startIndex={3} />
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export const getStaticProps: GetStaticProps<JournalPageProps> = async () => {
    try {
        const posts = await getPosts()
        return { props: { posts }, revalidate: 60 }
    }
    catch (error) {
        console.error('Journal failed to load:', error instanceof Error ? error.message : error)
        return { props: { posts: [] }, revalidate: 30 }
    }
}

export default JournalPage
