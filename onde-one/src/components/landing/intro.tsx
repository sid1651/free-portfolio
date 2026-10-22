import type { FC, ReactNode } from 'react'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { Counter } from '@/components/landing/counter'
import { Eyebrow } from '@/components/landing/section-heading'

const STATEMENT = 'Arden Halo started with one belief. Headphones should be crafted like fine watches: cut from solid metal, tuned by ear and finished by hand, so the only thing you notice is the music.'

const FACTS = [
    { value: 268, suffix: ' g', label: 'Of metal and memory foam, balanced to vanish on your head' },
    { value: 60, suffix: ' h', label: 'Of playback with noise cancelling switched on' },
    { value: 42, prefix: '−', suffix: ' dB', label: 'Of intelligent, adaptive noise reduction' },
    { value: 12, label: 'Microphones, eight devoted entirely to quiet' }
]

export const Intro: FC = (): ReactNode => {
    const sectionRef = useRef<HTMLElement>(null)

    useGSAP(() => {
        const media = gsap.matchMedia()

        media.add('(prefers-reduced-motion: no-preference)', () => {
            gsap.fromTo(
                '.intro-word',
                { opacity: 0.12 },
                {
                    opacity: 1,
                    ease: 'none',
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: '.intro-statement',
                        start: 'top 78%',
                        end: 'bottom 42%',
                        scrub: 0.6
                    }
                }
            )
        })
    }, { scope: sectionRef })

    return (
        <section
            id='intro'
            ref={sectionRef}
            aria-label='Introducing Arden Halo'
            className='relative bg-background py-28 md:py-44'
        >
            <div className='mx-auto max-w-[1600px] px-5 md:px-10'>
                <div data-reveal>
                    <Eyebrow index='00' label='Introducing Arden Halo' />
                </div>

                <p className='intro-statement mt-10 max-w-[22ch] font-heading stretch-semi text-[clamp(2rem,4.6vw,4.6rem)] font-medium leading-[1.02] tracking-[-0.035em] md:mt-14 lg:max-w-[28ch]'>
                    {STATEMENT.split(' ').map((word, index) => (
                        <span key={`${word}-${index}`} className='intro-word'>
                            {word}{' '}
                        </span>
                    ))}
                </p>

                <dl className='mt-20 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-border pt-10 md:mt-28 lg:grid-cols-4'>
                    {FACTS.map((fact) => (
                        <div key={fact.label} data-reveal className='flex flex-col gap-3'>
                            <dt className='order-2 max-w-[16rem] text-sm leading-relaxed text-muted-foreground'>
                                {fact.label}
                            </dt>
                            <dd className='order-1 font-heading stretch-semi text-[clamp(2.6rem,4.4vw,4.2rem)] font-medium leading-none tracking-[-0.04em]'>
                                <Counter value={fact.value} prefix={fact.prefix} suffix={fact.suffix} />
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    )
}
