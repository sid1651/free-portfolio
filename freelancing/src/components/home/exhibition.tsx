import type { FC, ReactNode } from 'react'

import { gsap } from '@/lib/gsap'
import { useGsapContext } from '@/hooks/use-gsap'
import { AcidButton } from '@/components/generals/acid-button'
import { CurtainMedia } from '@/components/motion/curtain-media'
import { ScrubCrop } from '@/components/motion/media'
import {
    CharsIn,
    WordsIn,
    Reveal,
    DrawLine
} from '@/components/motion/reveal'

import { exhibition } from '@/constants/home'

/**
 * Section 10 — Exhibition.
 *
 * The white plate, the brightest point on the page. Three counters roll up
 * through their digits as the block arrives, and the lower band crops itself
 * open across the scroll.
 */
export const Exhibition: FC = (): ReactNode => {
    const scope = useGsapContext<HTMLElement>(() => {
        const counters = gsap.utils.toArray<HTMLElement>('[data-count]')

        counters.forEach((counter) => {
            const target = Number(counter.dataset.count ?? '0')
            const state = { value: 0 }

            gsap.to(state, {
                value: target,
                duration: 1.8,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: counter,
                    start: 'top 92%',
                    once: true
                },
                onUpdate: () => {
                    counter.textContent = String(Math.round(state.value))
                }
            })
        })
    }, [])

    return (
        <section
            id='exhibition'
            ref={scope}
            className='bg-white edge-x pb-[10vh] pt-[14vh] text-ink'
        >
            {/* The plate leads here and the details sit in a narrow rail, the
                inverse of the featured study further up the page. */}
            <div className='grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8'>
                <div className='lg:col-span-7'>
                    <CurtainMedia
                        src={exhibition.image}
                        alt={exhibition.title}
                        mask='#ffffff'
                        zoom={1.3}
                        caption={exhibition.title}
                        sublabel={exhibition.author}
                        className='aspect-[11/13] w-full'
                    />
                </div>

                <div className='flex flex-col justify-between lg:col-span-4 lg:col-start-9'>
                    <div>
                        <Reveal y={14} className='mb-5'>
                            <span className='label-mono text-dust'>
                                {exhibition.kicker}
                            </span>
                        </Reveal>

                        <CharsIn
                            as='h2'
                            text={exhibition.title}
                            stagger={0.024}
                            className='display-tight text-[clamp(38px,6.4vw,88px)]'
                        />

                        <Reveal y={16} delay={0.16} className='mt-3'>
                            <span className='text-[16px] font-semibold tracking-[-0.04em] text-graphite'>
                                {exhibition.author}
                            </span>
                        </Reveal>

                        <DrawLine color='#292929' className='my-7' />

                        <WordsIn
                            text={exhibition.description}
                            delay={0.12}
                            stagger={0.02}
                            className='max-w-[48ch] text-[16px] font-bold uppercase leading-[1.28] tracking-[-0.04em]'
                        />
                    </div>

                    <div className='mt-10'>
                        <Reveal
                            y={22}
                            delay={0.1}
                            className='flex flex-col gap-1'
                        >
                            <span className='text-[15px] font-semibold tracking-[-0.03em]'>
                                {exhibition.showing}
                            </span>

                            <span className='label-mono text-dust'>
                                {exhibition.venue}
                            </span>

                            <span className='label-mono text-dust'>
                                {exhibition.location}
                            </span>
                        </Reveal>

                        <Reveal y={22} delay={0.18} className='mt-7'>
                            <AcidButton
                                label={exhibition.button}
                                href='/work'
                            />
                        </Reveal>
                    </div>
                </div>
            </div>

            {/* Lower band */}
            <div className='mt-[12vh] grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8'>
                <div className='lg:col-span-4'>
                    <Reveal y={16} className='mb-4'>
                        <span className='label-mono text-acid-dim'>
                            {exhibition.number}
                        </span>
                    </Reveal>

                    <h3 className='display-tight text-[clamp(28px,3.6vw,48px)]'>
                        {exhibition.conceptTitle}
                    </h3>

                    <WordsIn
                        text={exhibition.conceptBody}
                        delay={0.12}
                        stagger={0.016}
                        className='mt-5 max-w-[46ch] text-[15px] font-semibold leading-[1.45] tracking-[-0.03em] text-graphite'
                    />

                    <div className='mt-8 flex items-end gap-6'>
                        <span className='flex items-baseline gap-1 text-[clamp(30px,4vw,54px)] font-black tracking-[-0.06em]'>
                            <span data-count={exhibition.yearFrom}>0</span>
                        </span>

                        <DrawLine color='#292929' className='mb-3 flex-1' />

                        <span className='flex items-baseline gap-1 text-[clamp(30px,4vw,54px)] font-black tracking-[-0.06em] text-acid-dim'>
                            <span data-count={exhibition.yearTo}>0</span>
                        </span>
                    </div>
                </div>

                <div className='lg:col-span-7 lg:col-start-6'>
                    <ScrubCrop
                        src={exhibition.wideImage}
                        alt='Hitha editorial portfolio image'
                        drift={14}
                        className='h-[40vh] w-full md:h-[56vh]'
                    />

                    <div className='mt-5 grid grid-cols-2 gap-6 md:grid-cols-4'>
                        {exhibition.details.map((detail, index) => (
                            <Reveal
                                key={detail}
                                y={20}
                                delay={index * 0.06}
                                start='top 94%'
                            >
                                <DrawLine
                                    color='#292929'
                                    delay={index * 0.06}
                                    className='mb-2'
                                />

                                <span className='label-mono text-dust'>
                                    {detail}
                                </span>
                            </Reveal>
                        ))}
                    </div>

                    <Reveal
                        y={18}
                        delay={0.2}
                        className='mt-7 flex flex-wrap items-center gap-x-6 gap-y-2'
                    >
                        <span className='label-mono text-graphite'>
                            {exhibition.code}
                        </span>

                        <span className='label-mono text-graphite'>
                            {exhibition.projectCode}
                        </span>

                        <span className='text-[15px] font-black uppercase tracking-[-0.04em]'>
                            {exhibition.projectName}
                        </span>

                        <span className='label-mono text-acid-dim'>
                            {exhibition.version}
                        </span>
                    </Reveal>
                </div>
            </div>
        </section>
    )
}
