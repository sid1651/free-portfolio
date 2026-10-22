import type { FC, ReactNode } from 'react'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { gsap, isFinePointer, prefersReducedMotion } from '@/lib/motion/gsap'
import { cn } from '@/lib/utils'
import { useReveal } from '@/hooks/use-reveal'
import { Eyebrow } from '@/components/generals/section-heading'
import { SplitWords } from '@/components/generals/split-words'
import { TransitionLink } from '@/components/generals/transition-link'
import { services, servicesContent } from '@/constants/content'

export const Services: FC = (): ReactNode => {
    const scope = useRef<HTMLElement>(null)
    const listRef = useRef<HTMLUListElement>(null)
    const previewRef = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState<number | null>(null)

    useReveal(scope)

    useEffect(() => {
        const list = listRef.current
        const preview = previewRef.current
        if (!list || !preview || !isFinePointer()) return

        const reduced = prefersReducedMotion()
        const moveX = gsap.quickTo(preview, 'x', { duration: reduced ? 0.01 : 0.8, ease: 'expo.out' })
        const moveY = gsap.quickTo(preview, 'y', { duration: reduced ? 0.01 : 0.8, ease: 'expo.out' })

        const handleMove = (event: PointerEvent): void => {
            const bounds = list.getBoundingClientRect()
            moveX(event.clientX - bounds.left)
            moveY(event.clientY - bounds.top)
        }

        const handleEnter = (): void => {
            gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'expo.out' })
        }

        const handleLeave = (): void => {
            gsap.to(preview, { autoAlpha: 0, scale: 0.85, duration: 0.4, ease: 'power2.out' })
            setActive(null)
        }

        gsap.set(preview, { autoAlpha: 0, scale: 0.85, xPercent: -50, yPercent: -50 })

        list.addEventListener('pointermove', handleMove)
        list.addEventListener('pointerenter', handleEnter)
        list.addEventListener('pointerleave', handleLeave)

        return () => {
            list.removeEventListener('pointermove', handleMove)
            list.removeEventListener('pointerenter', handleEnter)
            list.removeEventListener('pointerleave', handleLeave)
        }
    }, [])

    return (
        <section ref={scope} id='services' aria-labelledby='services-title' className='relative bg-bone py-28 text-ink md:py-40'>
            <div className='gutter'>
                <div className='flex items-center justify-between gap-6 border-t border-ink/15 pt-6'>
                    <Eyebrow index='02' className='text-stone-deep'>
                        Services
                    </Eyebrow>

                    <span className='eyebrow text-stone-deep'>
                        {servicesContent.since}
                    </span>
                </div>

                <h2
                    id='services-title'
                    className='mt-12 font-wide text-[clamp(2.6rem,9vw,10rem)] font-semibold uppercase leading-[0.86] tracking-[-0.05em] md:mt-16'
                    data-reveal='words'
                >
                    <SplitWords text='Generative' />
                    <br />
                    <span className='block pl-[14vw]'>
                        <SplitWords text='Services' wordClassName='font-serif font-normal normal-case italic tracking-[-0.02em]' />
                    </span>
                </h2>

                <div className='mt-12 grid gap-6 md:mt-16 md:grid-cols-12 md:items-end' data-reveal='fade'>
                    <p className='max-w-md text-lead text-ink/80 md:col-span-6 md:col-start-5'>
                        {servicesContent.description}
                    </p>

                    <span className='eyebrow text-stone-deep md:col-span-3 md:col-start-10 md:text-right'>
                        {servicesContent.kicker} / 0{services.length}
                    </span>
                </div>

                <div className='relative mt-20 md:mt-28'>
                    <ul ref={listRef} className='relative border-t border-ink/15'>
                        {services.map((service, index) => (
                            <li key={service.title} className='border-b border-ink/15'>
                                <TransitionLink
                                    href={`/projects?filter=${service.filter}`}
                                    className='group grid grid-cols-[auto_1fr_auto] items-start gap-x-5 gap-y-4 py-7 md:grid-cols-12 md:items-center md:gap-6 md:py-10'
                                    onMouseEnter={() => setActive(index)}
                                    onFocus={() => setActive(index)}
                                    data-cursor='Explore'
                                >
                                    <span className='eyebrow pt-2 text-stone-deep md:col-span-1 md:pt-0'>
                                        ({service.index})
                                    </span>

                                    <h3
                                        className={cn(
                                            'font-wide text-[clamp(1.75rem,4.4vw,4.75rem)] font-semibold uppercase leading-[0.92] tracking-[-0.045em] transition-[transform,translate,scale,rotate,color] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] md:col-span-6 md:group-hover:translate-x-6',
                                            active !== null && active !== index ? 'md:text-ink/25' : 'text-ink'
                                        )}
                                    >
                                        {service.title}
                                    </h3>

                                    <span className='flex size-10 items-center justify-center self-start rounded-full border border-ink/20 transition-colors duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-bone md:order-last md:col-span-1 md:size-12 md:justify-self-end md:self-center'>
                                        <ArrowUpRight className='size-4 transition-transform duration-500 group-hover:rotate-45' aria-hidden='true' />
                                    </span>

                                    <div className='col-span-3 flex flex-col gap-4 md:col-span-4'>
                                        <div className='relative aspect-[16/10] overflow-hidden md:hidden'>
                                            <Image src={service.image.src} alt={service.image.alt} fill sizes='90vw' className='object-cover' />
                                        </div>

                                        <p className='max-w-sm text-sm leading-relaxed text-ink/70 md:text-base'>
                                            {service.description}
                                        </p>

                                        <ul className='flex flex-wrap gap-2' aria-label={`${service.title} deliverables`}>
                                            {service.deliverables.map(item => (
                                                <li key={item} className='eyebrow rounded-full border border-ink/15 px-3 py-1.5 text-[0.625rem] text-ink/70'>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </TransitionLink>
                            </li>
                        ))}
                    </ul>

                    <div
                        ref={previewRef}
                        className='pointer-events-none invisible absolute left-0 top-0 z-20 hidden h-[22rem] w-[17rem] overflow-hidden md:block lg:h-[26rem] lg:w-[20rem]'
                        aria-hidden='true'
                    >
                        {services.map((service, index) => (
                            <div
                                key={service.title}
                                className={cn(
                                    'absolute inset-0 transition-[clip-path] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]',
                                    active === index ? '[clip-path:inset(0%_0%_0%_0%)]' : '[clip-path:inset(100%_0%_0%_0%)]'
                                )}
                                style={{ zIndex: active === index ? 2 : 1 }}
                            >
                                <Image src={service.image.src} alt='' fill sizes='320px' className='object-cover' />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
