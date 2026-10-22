import type { FC, ReactNode } from 'react'

import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/motion/gsap'
import { useReveal } from '@/hooks/use-reveal'
import { Eyebrow } from '@/components/generals/section-heading'
import { SplitWords } from '@/components/generals/split-words'
import { processContent, processSteps } from '@/constants/content'

export const Process: FC = (): ReactNode => {
    const scope = useRef<HTMLElement>(null)
    const counterRef = useRef<HTMLSpanElement>(null)

    useReveal(scope)

    useGSAP(() => {
        const root = scope.current
        if (!root) return

        const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'))
        const list = root.querySelector('[data-steps]')
        const bar = root.querySelector('[data-step-bar]')

        const setActive = (activeIndex: number): void => {
            steps.forEach((step, index) => {
                step.dataset.active = index === activeIndex ? 'true' : 'false'
            })

            if (counterRef.current) counterRef.current.textContent = `0${activeIndex + 1}`
        }

        setActive(0)

        const triggers = steps.map((step, index) => ScrollTrigger.create({
            trigger: step,
            start: 'top 60%',
            end: 'bottom 60%',
            onToggle: (self) => {
                if (self.isActive) setActive(index)
            }
        }))

        const mm = gsap.matchMedia()

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            if (bar && list) {
                gsap.fromTo(bar, { scaleY: 0 }, {
                    scaleY: 1,
                    ease: 'none',
                    scrollTrigger: { trigger: list, start: 'top 60%', end: 'bottom 60%', scrub: true }
                })
            }
        })

        return () => {
            triggers.forEach(trigger => trigger.kill())
            mm.revert()
        }
    }, { scope })

    return (
        <section ref={scope} id='process' aria-labelledby='process-title' className='relative bg-ink py-28 text-bone md:py-40'>
            <div className='gutter grid gap-16 lg:grid-cols-12 lg:gap-10'>
                <div className='lg:col-span-5'>
                    <div className='flex flex-col gap-8 lg:sticky lg:top-32'>
                        <Eyebrow className='text-stone'>
                            {processContent.label}
                        </Eyebrow>

                        <h2 id='process-title' className='font-wide text-big font-semibold uppercase tracking-[-0.05em]' data-reveal='words'>
                            <SplitWords text='From brief to' />{' '}
                            <SplitWords text='delivery.' wordClassName='font-serif font-normal normal-case italic tracking-[-0.02em] text-flare' />
                        </h2>

                        <p className='max-w-sm text-lead text-bone/85' data-reveal='fade'>
                            {processContent.subtitle}
                        </p>

                        <p className='max-w-sm text-sm leading-relaxed text-stone' data-reveal='fade'>
                            {processContent.description}
                        </p>

                        <div className='mt-4 hidden items-end gap-4 lg:flex' aria-hidden='true'>
                            <span ref={counterRef} className='font-wide text-7xl font-semibold leading-none tracking-[-0.06em] text-flare'>
                                01
                            </span>
                            <span className='eyebrow pb-2 text-stone'>
                                / 0{processSteps.length} Stages
                            </span>
                        </div>
                    </div>
                </div>

                <div className='relative lg:col-span-6 lg:col-start-7'>
                    <div className='absolute bottom-0 left-0 top-0 hidden w-px bg-bone/15 md:block' aria-hidden='true'>
                        <div className='h-full w-full origin-top bg-flare' data-step-bar='' />
                    </div>

                    <ol className='flex flex-col md:pl-12' data-steps=''>
                        {processSteps.map(step => (
                            <li
                                key={step.index}
                                data-step=''
                                data-active='false'
                                className='group flex flex-col gap-6 border-b border-bone/10 py-12 transition-opacity duration-700 first:pt-0 last:border-b-0 md:min-h-[44vh] md:justify-center md:py-16 md:opacity-30 md:data-[active=true]:opacity-100'
                            >
                                <div className='flex items-center gap-4'>
                                    <span className='eyebrow text-flare'>
                                        {step.index}
                                    </span>
                                    <span className='h-px w-10 bg-bone/20' aria-hidden='true' />
                                    <span className='eyebrow text-stone'>
                                        {step.phase}
                                    </span>
                                </div>

                                <h3 className='font-wide text-[clamp(2.5rem,6vw,6.25rem)] font-semibold uppercase leading-[0.85] tracking-[-0.055em]'>
                                    {step.title}
                                </h3>

                                <p className='font-serif text-[clamp(1.5rem,2.4vw,2.4rem)] italic leading-tight text-bone/85'>
                                    {step.description}
                                </p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    )
}
