import type { FC, ReactNode } from 'react'
import type { Project } from '@/types'

import Image from 'next/image'
import { useRef } from 'react'
import { cms } from '@/lib/cms'
import { useReveal } from '@/hooks/use-reveal'
import { ArrowLink } from '@/components/generals/arrow-link'
import { Marquee } from '@/components/generals/marquee'
import { Media } from '@/components/generals/media'
import { Eyebrow } from '@/components/generals/section-heading'
import { SplitWords } from '@/components/generals/split-words'
import { partnersContent, studioContent, team } from '@/constants/content'
import { media } from '@/constants/media'

interface StudioProps {
    partners: Pick<Project, 'id' | 'title' | 'logo' | 'logo_alt'>[]
}

export const Studio: FC<StudioProps> = ({ partners = [] }): ReactNode => {
    const scope = useRef<HTMLElement>(null)
    const logos = partners.filter(partner => Boolean(partner.logo))

    useReveal(scope)

    return (
        <section ref={scope} id='studio' aria-labelledby='studio-title' className='relative overflow-hidden bg-bone pt-28 text-ink md:pt-40'>
            <div className='gutter grid gap-14 lg:grid-cols-12 lg:gap-10'>
                <div className='relative lg:col-span-6'>
                    <Media
                        src={media.aboutTeamTable.src}
                        alt={media.aboutTeamTable.alt}
                        sizes='(min-width: 1024px) 48vw, 92vw'
                        className='aspect-[4/5]'
                        reveal
                        parallax={10}
                    />

                    <div className='absolute -bottom-10 right-4 w-[42%] md:right-[-6%] lg:w-[46%]'>
                        <Media
                            src={media.aboutStudioDesk.src}
                            alt={media.aboutStudioDesk.alt}
                            sizes='(min-width: 1024px) 22vw, 40vw'
                            className='aspect-[4/3] border-[6px] border-bone'
                            reveal
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-10 lg:col-span-5 lg:col-start-8 lg:pt-10'>
                    <div className='flex items-center justify-between'>
                        <Eyebrow className='text-stone-deep'>
                            {studioContent.label}
                        </Eyebrow>

                        <span className='eyebrow text-stone-deep'>
                            {studioContent.since}
                        </span>
                    </div>

                    <h2 id='studio-title' className='font-wide text-big font-semibold uppercase tracking-[-0.05em]' data-reveal='words'>
                        <SplitWords text='Novair' />
                        <br />
                        <SplitWords text='Studio' wordClassName='font-serif font-normal normal-case italic tracking-[-0.02em]' />
                    </h2>

                    <p className='text-lead font-medium' data-reveal='fade'>
                        {studioContent.statement}
                    </p>

                    <p className='max-w-md text-base leading-relaxed text-ink/70' data-reveal='fade'>
                        {studioContent.description}
                    </p>

                    <ul className='flex flex-col border-t border-ink/15' data-reveal='stagger'>
                        {team.map(member => (
                            <li key={member.name} className='flex items-center gap-4 border-b border-ink/15 py-4'>
                                <span className='relative size-12 shrink-0 overflow-hidden rounded-full'>
                                    <Image src={member.image.src} alt={member.image.alt} fill sizes='48px' className='object-cover' />
                                </span>

                                <span className='flex flex-1 flex-col'>
                                    <span className='text-base font-semibold'>
                                        {member.name}
                                    </span>
                                    <span className='eyebrow text-stone-deep'>
                                        {member.role}
                                    </span>
                                </span>

                                <span className='eyebrow text-stone-deep'>
                                    With us
                                </span>
                            </li>
                        ))}
                    </ul>

                    <ArrowLink href='/about' className='self-start text-base'>
                        Meet the studio
                    </ArrowLink>
                </div>
            </div>

            <div className='gutter mt-32 grid gap-10 border-t border-ink/15 pt-10 md:mt-44 md:grid-cols-12'>
                <div className='flex flex-col gap-4 md:col-span-4'>
                    <Eyebrow className='text-stone-deep'>
                        {partnersContent.label}
                    </Eyebrow>

                    <h3 className='font-wide text-title font-semibold uppercase tracking-[-0.04em]' data-reveal='words'>
                        <SplitWords text='Trusted by' />{' '}
                        <SplitWords text='modern brands.' wordClassName='font-serif font-normal normal-case italic tracking-[-0.01em]' />
                    </h3>
                </div>

                <div className='flex flex-col gap-4 md:col-span-6 md:col-start-7' data-reveal='fade'>
                    <p className='text-lead text-ink/85'>
                        {partnersContent.statement}
                    </p>

                    <p className='text-sm leading-relaxed text-ink/65'>
                        {partnersContent.description}
                    </p>
                </div>
            </div>

            {logos.length > 0 && (
                <Marquee duration={30} className='mt-14 bg-ink py-10 md:mt-20 md:py-14'>
                    {logos.map(partner => (
                        <span key={partner.id} className='mx-10 flex items-center gap-4 text-bone md:mx-16'>
                            <img src={partner.logo ?? ''} alt={partner.logo_alt ?? ''} className='h-9 w-auto md:h-11' loading='lazy' />
                            <span
                                className='font-wide text-xl font-semibold uppercase tracking-[-0.03em] md:text-2xl'
                                data-mdlfy-cms={cms('projects', partner.id, 'title')}
                            >
                                {partner.title}
                            </span>
                        </span>
                    ))}
                </Marquee>
            )}
        </section>
    )
}
