import type { FC, ReactNode } from 'react'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { useIntro } from '@/hooks/use-intro'
import { useReveal } from '@/hooks/use-reveal'
import { PillLink } from '@/components/generals/arrow-link'
import { Layout } from '@/components/generals/layout'
import { Media } from '@/components/generals/media'
import { DisplayHeading, Eyebrow } from '@/components/generals/section-heading'
import { Seo } from '@/components/generals/seo'
import { SplitWords } from '@/components/generals/split-words'
import { RecLabel, Viewfinder } from '@/components/generals/viewfinder'
import { siteConfig } from '@/constants/site'
import { media } from '@/constants/media'

import {
    aboutContent,
    awards,
    stats,
    team,
    processSteps
} from '@/constants/content'

const AboutPage: FC = (): ReactNode => {
    const heroRef = useRef<HTMLElement>(null)
    const bodyRef = useRef<HTMLDivElement>(null)

    useIntro(heroRef, (timeline, root) => {
        timeline
            .from(root.querySelectorAll('[data-about-title] [data-word]'), { yPercent: 120, duration: 1.5, stagger: 0.1 }, 0)
            .fromTo(root.querySelector('[data-about-frame]'), { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.7, ease: 'expo.inOut' }, 0.2)
            .from(root.querySelectorAll('[data-about-fade]'), { autoAlpha: 0, y: 28, duration: 1.2, stagger: 0.08 }, 0.7)
    })

    useReveal(heroRef)
    useReveal(bodyRef)

    return (
        <Layout>
            <Seo
                title='About'
                description='Meet NOVAIR Studio, a boutique creative studio for AI-generated imagery, video and visual storytelling, led by human art direction.'
                ogImage={media.aboutPortrait.src}
            />

            <section ref={heroRef} id='about-hero' aria-labelledby='about-title' className='relative overflow-hidden bg-ink pb-24 pt-32 text-bone md:pb-36 md:pt-40'>
                <div className='gutter'>
                    <div className='flex items-center justify-between gap-6' data-intro=''>
                        <span data-about-fade=''>
                            <RecLabel label={aboutContent.eyebrow} />
                        </span>

                        <span className='eyebrow text-stone' data-about-fade=''>
                            About / Since {siteConfig.founded}
                        </span>
                    </div>

                    <h1 id='about-title' className='relative z-10 mt-12 text-white mix-blend-difference md:mt-16' data-intro='' data-about-title=''>
                        <span className='block font-wide text-[clamp(4rem,21.5vw,26rem)] font-bold uppercase leading-[0.78] tracking-[-0.065em]'>
                            <SplitWords text='Novair' />
                        </span>
                        <span className='-mt-[2vw] block text-right font-serif text-[clamp(3.4rem,15vw,18rem)] italic leading-[0.9] tracking-[-0.03em]'>
                            <SplitWords text='Studio' />
                        </span>
                    </h1>

                    <div className='relative -mt-[6vw] grid gap-10 md:grid-cols-12'>
                        <div className='order-2 flex flex-col gap-6 pt-6 md:order-1 md:col-span-4 md:pt-[14vw]' data-intro=''>
                            <span className='eyebrow text-flare' data-about-fade=''>
                                {aboutContent.kicker}
                            </span>

                            <p className='text-lead text-bone/90' data-about-fade=''>
                                {aboutContent.description}
                            </p>

                            <div data-about-fade=''>
                                <PillLink href='/projects'>
                                    See the work
                                </PillLink>
                            </div>
                        </div>

                        <div className='order-1 md:order-2 md:col-span-7 md:col-start-6' data-intro='' data-about-frame=''>
                            <Media
                                src={media.aboutPortrait.src}
                                alt={media.aboutPortrait.alt}
                                sizes='(min-width: 768px) 58vw, 92vw'
                                className='aspect-[4/3]'
                                parallax={10}
                                preload
                            >
                                <Viewfinder />
                                <span className='eyebrow absolute bottom-6 left-6 z-10 text-bone'>
                                    Studio portrait / Amsterdam
                                </span>
                            </Media>
                        </div>
                    </div>
                </div>
            </section>

            <div ref={bodyRef}>
                <section id='why' aria-labelledby='why-title' className='bg-bone py-28 text-ink md:py-40'>
                    <div className='gutter'>
                        <div className='grid gap-10 md:grid-cols-12'>
                            <div className='md:col-span-3'>
                                <Eyebrow index='01' className='text-stone-deep'>
                                    {aboutContent.whyLabel}
                                </Eyebrow>
                            </div>

                            <div className='flex flex-col gap-10 md:col-span-9'>
                                <h2 id='why-title' className='text-[clamp(2.2rem,5.4vw,6rem)] font-medium leading-[1] tracking-[-0.045em]' data-reveal='words'>
                                    <SplitWords text='Skip traditional' />{' '}
                                    <SplitWords text='photoshoots.' wordClassName='font-serif font-normal italic tracking-[-0.02em]' />{' '}
                                    <SplitWords text='Premium product visuals delivered in days for brands.' />
                                </h2>

                                <p className='max-w-xl text-lead text-ink/75' data-reveal='fade'>
                                    {aboutContent.whyDescription}
                                </p>
                            </div>
                        </div>

                        <dl className='mt-24 grid grid-cols-2 border-t border-ink/15 md:mt-32 lg:grid-cols-4'>
                            {stats.map((stat, index) => (
                                <div
                                    key={stat.label}
                                    className='flex flex-col gap-4 border-b border-ink/15 py-8 pr-4 odd:border-r lg:border-b-0 lg:border-r lg:py-10 lg:pl-6 lg:first:pl-0 lg:last:border-r-0'
                                >
                                    <dt className='eyebrow order-2 text-stone-deep'>
                                        {stat.label}
                                    </dt>
                                    <dd className='order-1 font-wide text-[clamp(3rem,6.5vw,6.5rem)] font-semibold leading-[0.85] tracking-[-0.06em]'>
                                        <span data-count={stat.value}>{stat.value}</span>
                                        <span className='text-flare'>{stat.suffix}</span>
                                    </dd>
                                    <span className='eyebrow order-3 text-stone-deep'>
                                        0{index + 1}
                                    </span>
                                </div>
                            ))}
                        </dl>
                    </div>
                </section>

                <section id='approach' aria-labelledby='approach-title' className='overflow-hidden bg-bone pb-28 text-ink md:pb-40'>
                    <div className='gutter grid items-start gap-10 md:grid-cols-12'>
                        <div className='md:col-span-5'>
                            <Media
                                src={media.aboutFriendsSky.src}
                                alt={media.aboutFriendsSky.alt}
                                sizes='(min-width: 768px) 40vw, 92vw'
                                className='aspect-[3/4]'
                                reveal
                                parallax={10}
                            />
                        </div>

                        <div className='flex flex-col gap-12 md:col-span-6 md:col-start-7 md:pt-[22vh]'>
                            <p id='approach-title' className='font-serif text-[clamp(2rem,4.2vw,4.5rem)] italic leading-[1.02] tracking-[-0.02em]' data-reveal='fade'>
                                Creating premium AI visuals for brands across fashion, beauty, lifestyle, and ecommerce.
                            </p>

                            <div className='grid grid-cols-5 gap-6'>
                                <Media
                                    src={media.aboutFriendsPhone.src}
                                    alt={media.aboutFriendsPhone.alt}
                                    sizes='(min-width: 768px) 28vw, 56vw'
                                    className='col-span-3 aspect-[3/4]'
                                    reveal
                                />

                                <ul className='col-span-2 flex flex-col justify-end gap-3 text-sm' data-reveal='stagger'>
                                    {['Fashion', 'Beauty', 'Lifestyle', 'Ecommerce'].map(item => (
                                        <li key={item} className='flex items-center justify-between border-b border-ink/15 pb-2'>
                                            {item}
                                            <ArrowUpRight className='size-3.5 text-flare' aria-hidden='true' />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section id='story' aria-labelledby='story-title' className='bg-ink py-28 text-bone md:py-40'>
                    <div className='gutter grid gap-14 md:grid-cols-12'>
                        <div className='flex flex-col gap-10 md:col-span-5'>
                            <Eyebrow index='02' className='text-stone'>
                                {aboutContent.storyLabel}
                            </Eyebrow>

                            <DisplayHeading
                                text='Directed by people, made with machines.'
                                accent='people,'
                                className='text-[clamp(2.2rem,4.6vw,5rem)] leading-[0.92]'
                            />

                            <div className='flex flex-col gap-5 text-base leading-relaxed text-bone/80 md:text-lg' data-reveal='stagger'>
                                {aboutContent.story.map(paragraph => (
                                    <p key={paragraph}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>

                        <div className='flex flex-col gap-10 md:col-span-6 md:col-start-7'>
                            <Media
                                src={media.aboutTeamTable.src}
                                alt={media.aboutTeamTable.alt}
                                sizes='(min-width: 768px) 48vw, 92vw'
                                className='aspect-[4/5]'
                                reveal
                                parallax={8}
                            />

                            <ol className='grid grid-cols-2 gap-px bg-bone/12' data-reveal='stagger'>
                                {processSteps.map(step => (
                                    <li key={step.index} className='flex flex-col gap-2 bg-ink p-5'>
                                        <span className='eyebrow text-flare'>
                                            {step.index} / {step.phase}
                                        </span>
                                        <span className='font-wide text-lg font-semibold uppercase tracking-[-0.02em]'>
                                            {step.title}
                                        </span>
                                        <span className='text-sm text-stone'>
                                            {step.description}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </section>

                <section id='team' aria-labelledby='team-title' className='bg-ink pb-28 text-bone md:pb-40'>
                    <div className='gutter'>
                        <div className='flex flex-col gap-8 border-t border-bone/12 pt-10 md:flex-row md:items-end md:justify-between'>
                            <div className='flex flex-col gap-6'>
                                <Eyebrow index='03' className='text-stone'>
                                    {aboutContent.teamLabel}
                                </Eyebrow>

                                <h2 id='team-title' className='font-wide text-big font-semibold uppercase tracking-[-0.05em]' data-reveal='words'>
                                    <SplitWords text='The people' />
                                    <br />
                                    <SplitWords text='behind the frames.' wordClassName='font-serif font-normal normal-case italic tracking-[-0.02em] text-flare' />
                                </h2>
                            </div>

                            <p className='max-w-xs text-sm leading-relaxed text-stone' data-reveal='fade'>
                                A small senior team. The people who pitch your idea are the people who make it.
                            </p>
                        </div>

                        <ul className='mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-8'>
                            {team.map((member, index) => (
                                <li
                                    key={member.name}
                                    className={index === 1 ? 'md:mt-[16vh]' : index === 2 ? 'md:mt-[6vh]' : undefined}
                                >
                                    <article className='group flex flex-col gap-5'>
                                        <div className='relative aspect-[3/4] overflow-hidden bg-ink-raised' data-reveal='image'>
                                            <div className='absolute inset-0' data-reveal-inner=''>
                                                <Image
                                                    src={member.image.src}
                                                    alt={member.image.alt}
                                                    fill
                                                    sizes='(min-width: 768px) 31vw, 92vw'
                                                    className='object-cover grayscale transition-[transform,translate,scale,rotate,filter] duration-[1.4s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105 group-hover:grayscale-0'
                                                />
                                            </div>

                                            <div className='absolute inset-x-0 bottom-0 z-10 translate-y-full bg-gradient-to-t from-ink/90 to-transparent p-6 pt-16 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0'>
                                                <p className='text-sm leading-relaxed text-bone'>
                                                    {member.focus}
                                                </p>
                                            </div>

                                            <Viewfinder size='sm' className='opacity-0 transition-opacity duration-500 group-hover:opacity-100' />
                                        </div>

                                        <div className='flex items-start justify-between gap-4'>
                                            <div className='flex flex-col gap-2'>
                                                <h3 className='font-wide text-2xl font-semibold uppercase leading-none tracking-[-0.035em] md:text-3xl'>
                                                    {member.name}
                                                </h3>
                                                <span className='eyebrow text-stone'>
                                                    {member.role}
                                                </span>
                                                <p className='mt-2 max-w-xs text-sm leading-relaxed text-stone md:hidden'>
                                                    {member.focus}
                                                </p>
                                            </div>

                                            <span className='eyebrow text-flare'>
                                                0{index + 1}
                                            </span>
                                        </div>
                                    </article>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section id='awards' aria-labelledby='awards-title' className='bg-bone py-28 text-ink md:py-40'>
                    <div className='gutter'>
                        <div className='grid gap-10 md:grid-cols-12'>
                            <div className='flex flex-col gap-6 md:col-span-5'>
                                <Eyebrow index='04' className='text-stone-deep'>
                                    {aboutContent.awardsLabel}
                                </Eyebrow>

                                <h2 id='awards-title' className='font-wide text-huge font-semibold uppercase tracking-[-0.055em]' data-reveal='words'>
                                    <SplitWords text='AI,' />
                                    <br />
                                    <SplitWords text='recognized.' wordClassName='font-serif font-normal normal-case italic tracking-[-0.02em]' />
                                </h2>
                            </div>

                            <div className='flex flex-col justify-end gap-4 md:col-span-6 md:col-start-7' data-reveal='fade'>
                                <p className='text-lead font-medium'>
                                    {aboutContent.awardsStatement}
                                </p>
                                <p className='text-sm leading-relaxed text-ink/70'>
                                    {aboutContent.awardsDescription}
                                </p>
                            </div>
                        </div>

                        <ul className='mt-20 border-t border-ink/15 md:mt-28'>
                            {awards.map(award => (
                                <li key={`${award.title}-${award.year}`} className='group border-b border-ink/15'>
                                    <div className='flex flex-col gap-3 py-6 md:grid md:grid-cols-12 md:items-center md:gap-4 md:py-8'>
                                        <span className='eyebrow text-stone-deep md:col-span-1'>
                                            {award.year}
                                        </span>

                                        <div className='flex items-center gap-5 md:col-span-6'>
                                            <span className='relative hidden h-16 w-0 shrink-0 overflow-hidden transition-[width] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:w-24 md:block'>
                                                <Image src={award.image.src} alt='' fill sizes='96px' className='object-cover' />
                                            </span>

                                            <h3 className='font-wide text-[clamp(1.4rem,3vw,3rem)] font-semibold uppercase leading-[0.95] tracking-[-0.04em] transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]'>
                                                {award.title}
                                            </h3>
                                        </div>

                                        <span className='text-sm text-ink/70 md:col-span-4 md:text-base'>
                                            {award.organisation}
                                        </span>

                                        <span className='hidden md:col-span-1 md:block'>
                                            <ArrowUpRight className='ml-auto size-5 text-ink/40 transition-all duration-500 group-hover:rotate-45 group-hover:text-flare' aria-hidden='true' />
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>
        </Layout>
    )
}

export default AboutPage
