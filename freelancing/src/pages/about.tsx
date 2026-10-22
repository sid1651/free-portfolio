import type { FC, ReactNode } from 'react'

import { Seo } from '@/components/generals/seo'
import { AcidButton } from '@/components/generals/acid-button'
import { CurtainMedia } from '@/components/motion/curtain-media'
import { Marquee } from '@/components/motion/marquee'
import { Parallax } from '@/components/motion/media'

import {
    CharsIn,
    WordsIn,
    LinesIn,
    TrackIn,
    ScrubChars,
    Reveal,
    DrawLine
} from '@/components/motion/reveal'

import { aboutPage } from '@/constants/about'
import { studio } from '@/constants/site'

/**
 * About — the standalone profile page.
 *
 * Five plates, each with its own entrance so the page reads as a sequence
 * rather than one repeated fade: glyph rise on load, a scroll-read statement,
 * a masked list, per-row rules that draw themselves, and a closing marquee.
 */
const AboutPage: FC = (): ReactNode => {
    return (
        <>
            <Seo
                title='About'
                description={`${studio.artist} is an independent full stack developer building websites and applications with React, TypeScript and Node.js.`}
                ogImage={aboutPage.portrait}
            />

            <main id='about'>
                {/* 01 — Identity */}
                <section
                    id='about-hero'
                    className='bg-ink edge-x pb-[12vh] pt-[18vh] text-bone'
                >
                    <div className='flex items-center justify-between gap-6'>
                        <Reveal y={14} trigger='load' delay={0.25}>
                            <span className='label-mono text-acid'>
                                {aboutPage.kicker}
                            </span>
                        </Reveal>

                        <TrackIn
                            text={`${studio.yearFrom}—${studio.yearTo}`}
                            trigger='load'
                            delay={0.32}
                            fromTracking={0.36}
                            toTracking={-0.02}
                            className='label-mono text-dust'
                        />
                    </div>

                    <DrawLine
                        color='#292929'
                        trigger='load'
                        delay={0.42}
                        className='mb-[7vh] mt-5'
                    />

                    <CharsIn
                        as='h1'
                        text={aboutPage.name}
                        trigger='load'
                        delay={0.5}
                        stagger={0.045}
                        duration={1.5}
                        from={126}
                        className='display-tight text-[clamp(44px,11vw,168px)]'
                    />

                    <div className='mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8'>
                        <div className='lg:col-span-5'>
                            <LinesIn
                                lines={aboutPage.lede}
                                trigger='load'
                                delay={0.78}
                                stagger={0.1}
                                from={124}
                                className='text-[clamp(20px,2.6vw,34px)] font-black uppercase leading-[1.06] tracking-[-0.05em]'
                            />

                            <Reveal y={20} trigger='load' delay={1} className='mt-6'>
                                <span className='label-mono text-acid'>
                                    {aboutPage.role}
                                </span>
                            </Reveal>
                        </div>

                        <div className='lg:col-span-6 lg:col-start-7'>
                            <Parallax speed={-8}>
                                <CurtainMedia
                                    src={aboutPage.portrait}
                                    alt='Abstract corridor of glass and stone opening toward warm light'
                                    mask='#050609'
                                    curtain='wipe-left'
                                    staticZoom={1}
                                    priority
                                    caption={aboutPage.portraitCaption}
                                    sublabel={aboutPage.portraitLabel}
                                    className='aspect-[16/11] w-full'
                                />
                            </Parallax>
                        </div>
                    </div>
                </section>

                {/* 02 — Biography, read by the scroll */}
                <section
                    id='about-biography'
                    className='bg-bone edge-x py-[15vh] text-ink'
                >
                    <div className='grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8'>
                        <div className='lg:col-span-3'>
                            <Reveal y={14}>
                                <span className='label-mono text-acid-dim'>
                                    {aboutPage.biography.label}
                                </span>
                            </Reveal>
                        </div>

                        <div className='lg:col-span-8 lg:col-start-5'>
                            <ScrubChars
                                text={aboutPage.biography.statement}
                                dim={0.12}
                                className='text-[clamp(22px,3.4vw,50px)] font-black uppercase leading-[1.06] tracking-[-0.05em]'
                            />

                            <div className='mt-12 max-w-[62ch] space-y-6'>
                                {aboutPage.biography.paragraphs.map(
                                    (paragraph, index) => (
                                        <Reveal
                                            key={paragraph.slice(0, 24)}
                                            y={28}
                                            delay={index * 0.08}
                                            start='top 90%'
                                        >
                                            <p className='text-[16px] font-semibold leading-[1.5] tracking-[-0.03em] text-graphite'>
                                                {paragraph}
                                            </p>
                                        </Reveal>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 03 — Practice */}
                <section
                    id='about-practice'
                    className='bg-ink edge-x py-[14vh] text-bone'
                >
                    <div className='flex flex-wrap items-end justify-between gap-6'>
                        <LinesIn
                            as='h2'
                            lines={aboutPage.practice.title}
                            stagger={0.1}
                            skew={2}
                            from={120}
                            className='display-tight text-[clamp(32px,5.4vw,76px)]'
                        />

                        <Reveal y={14} delay={0.2}>
                            <span className='label-mono text-dust'>
                                {aboutPage.practice.label}
                            </span>
                        </Reveal>
                    </div>

                    <div className='mt-[9vh] grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-4'>
                        {aboutPage.practice.disciplines.map(
                            (discipline, index) => (
                                <div key={discipline.title}>
                                    <DrawLine
                                        color='#292929'
                                        thickness={2}
                                        delay={index * 0.1}
                                        className='mb-5'
                                    />

                                    <Reveal
                                        y={30}
                                        delay={index * 0.1 + 0.08}
                                        start='top 92%'
                                    >
                                        <span className='label-mono text-acid'>
                                            {discipline.code}
                                        </span>

                                        <h3 className='mt-4 text-[clamp(24px,2.6vw,36px)] font-black uppercase leading-[1.02] tracking-[-0.05em]'>
                                            {discipline.title}
                                        </h3>

                                        <p className='mt-4 text-[15px] font-semibold leading-[1.45] tracking-[-0.03em] text-smoke'>
                                            {discipline.body}
                                        </p>
                                    </Reveal>
                                </div>
                            )
                        )}
                    </div>
                </section>

                {/* 04 — Selected shows */}
                <section
                    id='about-shows'
                    className='bg-ash edge-x py-[13vh] text-ink'
                >
                    <div className='flex flex-wrap items-end justify-between gap-6'>
                        <CharsIn
                            as='h2'
                            text={aboutPage.shows.title}
                            stagger={0.02}
                            from={118}
                            className='display-tight text-[clamp(28px,4.6vw,64px)]'
                        />

                        <Reveal y={14} delay={0.18}>
                            <span className='label-mono text-ink/55'>
                                {aboutPage.shows.label}
                            </span>
                        </Reveal>
                    </div>

                    <ul className='mt-[8vh]'>
                        {aboutPage.shows.entries.map((entry, index) => (
                            <li key={`${entry.year}-${entry.title}`}>
                                <DrawLine
                                    color='#050609'
                                    delay={index * 0.06}
                                    className='opacity-25'
                                />

                                <div className='grid grid-cols-1 items-baseline gap-2 py-6 md:grid-cols-12 md:gap-6'>
                                    <Reveal
                                        y={18}
                                        delay={index * 0.06}
                                        start='top 92%'
                                        className='md:col-span-2'
                                    >
                                        <span className='label-mono text-acid-dim'>
                                            {entry.year}
                                        </span>
                                    </Reveal>

                                    <WordsIn
                                        text={entry.title}
                                        delay={index * 0.06 + 0.05}
                                        stagger={0.04}
                                        from={110}
                                        start='top 92%'
                                        className='text-[clamp(22px,3vw,40px)] font-black uppercase leading-[1.02] tracking-[-0.05em] md:col-span-6'
                                    />

                                    <Reveal
                                        y={18}
                                        delay={index * 0.06 + 0.12}
                                        start='top 92%'
                                        className='md:col-span-4 md:text-right'
                                    >
                                        <span className='text-[15px] font-semibold tracking-[-0.03em] text-graphite'>
                                            {entry.venue}
                                        </span>

                                        <span className='label-mono ml-3 text-ink/50'>
                                            {entry.city}
                                        </span>
                                    </Reveal>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* 05 — Closing */}
                <section
                    id='about-closing'
                    className='relative overflow-hidden bg-ink pb-[10vh] pt-[14vh] text-bone'
                >
                    <div className='edge-x'>
                        <div className='grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8'>
                            <LinesIn
                                as='h2'
                                lines={aboutPage.closing.title}
                                stagger={0.12}
                                skew={4}
                                from={128}
                                className='display-tight text-[clamp(44px,9vw,132px)] text-acid lg:col-span-6'
                            />

                            <div className='flex flex-col justify-end lg:col-span-5 lg:col-start-8'>
                                <WordsIn
                                    text={aboutPage.closing.body}
                                    delay={0.12}
                                    stagger={0.025}
                                    className='max-w-[44ch] text-[16px] font-semibold leading-[1.45] tracking-[-0.03em] text-smoke'
                                />

                                <Reveal y={24} delay={0.26} className='mt-8'>
                                    <AcidButton
                                        label={aboutPage.closing.cta}
                                        href='/contact'
                                    />
                                </Reveal>
                            </div>
                        </div>
                    </div>

                    <div className='mt-[12vh] border-y border-hairline py-4'>
                        <Marquee speed={34} repeat={3} direction='right'>
                            <span className='display-tight px-8 text-[clamp(28px,4.6vw,64px)] text-bone'>
                                {aboutPage.closing.marquee}
                            </span>

                            <span
                                aria-hidden='true'
                                className='display-tight px-8 text-[clamp(28px,4.6vw,64px)] text-transparent'
                                style={{ WebkitTextStroke: '1px #f4521c' }}
                            >
                                {aboutPage.closing.marquee}
                            </span>
                        </Marquee>
                    </div>
                </section>
            </main>
        </>
    )
}

export default AboutPage
