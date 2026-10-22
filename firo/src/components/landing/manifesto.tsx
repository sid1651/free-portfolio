import type { FC, ReactNode } from 'react'

import Image from 'next/image'
import { Gauge, Layers, ScanEye } from 'lucide-react'
import { Fragment, useRef } from 'react'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { useReveal } from '@/hooks/use-reveal'
import { Eyebrow } from '@/components/generals/section-heading'
import { manifestoContent, pillars } from '@/constants/content'

const pillarIcons = [Gauge, ScanEye, Layers]
const serifWords = new Set(['photoshoots.', 'brands.'])

export const Manifesto: FC = (): ReactNode => {
    const scope = useRef<HTMLElement>(null)

    useReveal(scope)

    useGSAP(() => {
        const root = scope.current
        if (!root) return

        const mm = gsap.matchMedia()

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            const statement = root.querySelector('[data-statement]')
            const tokens = root.querySelectorAll('[data-token]')

            gsap.fromTo(
                tokens,
                { opacity: 0.16 },
                {
                    opacity: 1,
                    ease: 'none',
                    stagger: 0.12,
                    scrollTrigger: { trigger: statement, start: 'top 82%', end: 'bottom 48%', scrub: true }
                }
            )

            gsap.from(root.querySelectorAll('[data-pill]'), {
                scale: 0,
                duration: 1,
                ease: 'back.out(1.6)',
                stagger: 0.12,
                scrollTrigger: { trigger: statement, start: 'top 75%', toggleActions: 'play none none none' }
            })
        })

        return () => mm.revert()
    }, { scope })

    return (
        <section ref={scope} id='manifesto' aria-labelledby='manifesto-title' className='relative bg-ink py-28 text-bone md:py-44'>
            <div className='gutter'>
                <div className='flex flex-col gap-6 border-t border-bone/15 pt-6 md:flex-row md:items-start md:justify-between'>
                    <Eyebrow index='01' className='text-stone'>
                        {manifestoContent.label}
                    </Eyebrow>

                    <p className='max-w-xs text-sm leading-relaxed text-stone md:text-right' data-reveal='fade'>
                        {manifestoContent.description}
                    </p>
                </div>

                <h2
                    id='manifesto-title'
                    className='mt-16 max-w-[22ch] text-[clamp(2.1rem,5.2vw,6rem)] font-medium leading-[1.02] tracking-[-0.045em] md:mt-24'
                    data-statement=''
                >
                    {manifestoContent.statement.map((token, index) => {
                        if (token.image) {
                            return (
                                <Fragment key={`image-${index}`}>
                                    <span
                                        className='relative mx-[0.12em] inline-block h-[0.78em] w-[1.6em] translate-y-[0.06em] overflow-hidden rounded-full align-baseline'
                                        data-pill=''
                                    >
                                        <Image src={token.image.src} alt='' fill sizes='160px' className='object-cover' />
                                    </span>{' '}
                                </Fragment>
                            )
                        }

                        return (
                            <Fragment key={`text-${index}`}>
                                {(token.text ?? '').split(' ').map((word, wordIndex) => (
                                    <Fragment key={`${word}-${wordIndex}`}>
                                        <span
                                            data-token=''
                                            className={serifWords.has(word) ? 'font-serif font-normal italic tracking-[-0.02em] text-flare' : undefined}
                                        >
                                            {word}
                                        </span>{' '}
                                    </Fragment>
                                ))}
                            </Fragment>
                        )
                    })}
                </h2>

                <ul className='mt-24 grid gap-px overflow-hidden bg-bone/12 md:mt-32 md:grid-cols-3' data-reveal='stagger'>
                    {pillars.map((pillar, index) => {
                        const Icon = pillarIcons[index] ?? Gauge

                        return (
                            <li key={pillar.title} className='group flex flex-col gap-10 bg-ink p-6 transition-colors duration-500 hover:bg-ink-soft md:min-h-[22rem] md:p-8'>
                                <div className='flex items-center justify-between'>
                                    <span className='eyebrow text-stone'>
                                        0{index + 1}
                                    </span>

                                    <Icon className='size-5 text-flare transition-transform duration-700 group-hover:rotate-12' aria-hidden='true' />
                                </div>

                                <div className='mt-auto flex flex-col gap-4'>
                                    <h3 className='font-wide text-xl font-semibold uppercase leading-tight tracking-[-0.02em] md:text-2xl'>
                                        {pillar.title}
                                    </h3>

                                    <p className='max-w-xs text-sm leading-relaxed text-stone'>
                                        {pillar.description}
                                    </p>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}
