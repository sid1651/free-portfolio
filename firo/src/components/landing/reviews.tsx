import type { FC, ReactNode } from 'react'

import Image from 'next/image'
import { Quote } from 'lucide-react'
import { useRef } from 'react'
import { useReveal } from '@/hooks/use-reveal'
import { Media } from '@/components/generals/media'
import { Eyebrow } from '@/components/generals/section-heading'
import { SplitWords } from '@/components/generals/split-words'
import { Viewfinder } from '@/components/generals/viewfinder'
import { reviews, reviewsContent } from '@/constants/content'
import { media } from '@/constants/media'

export const Reviews: FC = (): ReactNode => {
    const scope = useRef<HTMLElement>(null)

    useReveal(scope)

    return (
        <section ref={scope} id='reviews' aria-labelledby='reviews-title' className='relative bg-bone py-28 text-ink md:py-40'>
            <div className='gutter'>
                <div className='flex flex-col gap-10 md:flex-row md:items-end md:justify-between'>
                    <div className='flex flex-col gap-8'>
                        <Eyebrow index='04' className='text-stone-deep'>
                            Reviews
                        </Eyebrow>

                        <h2 id='reviews-title' className='font-wide text-huge font-semibold uppercase tracking-[-0.05em]' data-reveal='words'>
                            <SplitWords text={reviewsContent.title} />
                            <br />
                            <SplitWords text={reviewsContent.subtitle} wordClassName='font-serif font-normal normal-case italic tracking-[-0.02em]' />
                        </h2>
                    </div>

                    <p className='max-w-sm text-lead text-ink/75' data-reveal='fade'>
                        {reviewsContent.description}
                    </p>
                </div>

                <div className='mt-20 grid gap-12 md:mt-28 lg:grid-cols-12 lg:gap-10'>
                    <div className='lg:col-span-5'>
                        <div className='flex flex-col gap-6 lg:sticky lg:top-28'>
                            <Media
                                src={media.resultShirt.src}
                                alt={media.resultShirt.alt}
                                sizes='(min-width: 1024px) 38vw, 92vw'
                                className='aspect-[4/5]'
                                reveal
                                parallax={8}
                            >
                                <Viewfinder />
                                <span className='eyebrow absolute left-6 top-6 z-10 text-bone'>
                                    {reviewsContent.showreel}
                                </span>
                                <span className='absolute bottom-6 left-6 z-10 flex flex-col text-bone'>
                                    <span className='font-wide text-6xl font-semibold leading-none tracking-[-0.05em]'>
                                        3X
                                    </span>
                                    <span className='eyebrow mt-2'>
                                        Faster campaigns
                                    </span>
                                </span>
                            </Media>

                            <div className='grid grid-cols-2 gap-6'>
                                <Media
                                    src={media.resultLamp.src}
                                    alt={media.resultLamp.alt}
                                    sizes='(min-width: 1024px) 18vw, 45vw'
                                    className='aspect-[3/4]'
                                    reveal
                                />

                                <p className='self-end text-sm leading-relaxed text-ink/70'>
                                    Every review comes from a brand we partnered with on campaigns, product visuals and social content.
                                </p>
                            </div>
                        </div>
                    </div>

                    <ol className='flex flex-col lg:col-span-7'>
                        {reviews.map((review, index) => (
                            <li key={review.name} className='grid gap-8 border-t border-ink/15 py-12 first:border-t-0 first:pt-0 md:grid-cols-7 md:py-16 lg:first:pt-0'>
                                <div className='flex flex-col gap-3 md:col-span-3'>
                                    <span className='eyebrow text-stone-deep'>
                                        Results / 0{index + 1}
                                    </span>

                                    <p className='font-wide text-[clamp(4rem,9vw,8.5rem)] font-semibold leading-[0.82] tracking-[-0.06em]'>
                                        <span data-count={review.metricValue}>{review.metricValue}</span>
                                        <span className='text-flare'>{review.metricSuffix}</span>
                                    </p>

                                    <span className='eyebrow text-ink'>
                                        {review.metricLabel}
                                    </span>
                                </div>

                                <div className='flex flex-col gap-6 md:col-span-4' data-reveal='fade'>
                                    <p className='text-base font-medium leading-snug md:text-lg'>
                                        {review.result}
                                    </p>

                                    <blockquote className='flex flex-col gap-6'>
                                        <Quote className='size-6 text-flare' aria-hidden='true' />

                                        <p className='font-serif text-[clamp(1.75rem,2.8vw,2.75rem)] italic leading-[1.08] tracking-[-0.01em]'>
                                            {review.quote}
                                        </p>

                                        <footer className='flex items-center gap-4'>
                                            <span className='relative size-12 overflow-hidden rounded-full'>
                                                <Image src={review.avatar.src} alt={review.avatar.alt} fill sizes='48px' className='object-cover' />
                                            </span>

                                            <span className='flex flex-col'>
                                                <cite className='text-sm font-semibold not-italic'>
                                                    {review.name}
                                                </cite>
                                                <span className='eyebrow text-stone-deep'>
                                                    Client review
                                                </span>
                                            </span>
                                        </footer>
                                    </blockquote>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    )
}
