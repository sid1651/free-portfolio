import type { CSSProperties, ElementType, FC, ReactNode } from 'react'

import { gsap, ScrollTrigger } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import { useGsapContext } from '@/hooks/use-gsap'
import { useSiteReady } from '@/components/generals/ready-provider'
import { SplitChars, SplitWords } from '@/components/motion/split-text'

type Trigger = 'scroll' | 'load'

interface BaseMotionProps {
    className?: string
    style?: CSSProperties
    delay?: number
    stagger?: number
    duration?: number
    ease?: string
    trigger?: Trigger
    /** ScrollTrigger start string, e.g. "top 85%". */
    start?: string
    once?: boolean
    id?: string
}

/**
 * Fires `animate` the first time the element crosses `start`, and immediately
 * if it is already past it. ScrollTrigger alone leaves above-the-fold blocks
 * sitting in their hidden initial state, which is how content disappears.
 */
const onScrollIn = (
    element: Element | null,
    start: string,
    once: boolean,
    animate: () => void
): void => {
    if (!element) return

    let played = false

    const run = () => {
        if (played && once) return

        played = true
        animate()
    }

    ScrollTrigger.create({
        trigger: element,
        start,
        once,
        onEnter: run
    })

    const bounds = element.getBoundingClientRect()

    if (bounds.top < window.innerHeight && bounds.bottom > 0) run()
}

/* ── Characters rising out of a mask ─────────────────────────────────── */

interface CharsInProps extends BaseMotionProps {
    text: string
    as?: ElementType
    charClassName?: string
    /** Distance the glyphs travel, as a percentage of their own height. */
    from?: number
    rotate?: number
}

export const CharsIn: FC<CharsInProps> = ({
    text,
    as: Tag = 'span',
    className,
    charClassName,
    style,
    delay = 0,
    stagger = 0.022,
    duration = 1.1,
    ease = 'expo.out',
    trigger = 'scroll',
    start = 'top 88%',
    once = true,
    from = 122,
    rotate = 0,
    id
}): ReactNode => {
    const ready = useSiteReady()

    const scope = useGsapContext<HTMLElement>(() => {
        const chars = gsap.utils.toArray<HTMLElement>('.split-char')

        if (!chars.length) return

        gsap.set(chars, { yPercent: from, opacity: 0, rotate })

        const animate = () =>
            gsap.to(chars, {
                yPercent: 0,
                opacity: 1,
                rotate: 0,
                duration,
                ease,
                delay,
                stagger
            })

        if (trigger === 'load') {
            if (ready) animate()
            return
        }

        onScrollIn(scope.current, start, once, animate)
    }, [text, ready, trigger])

    return (
        <Tag
            id={id}
            ref={scope}
            style={style}
            className={cn('block', className)}
        >
            <SplitChars text={text} charClassName={charClassName} />
        </Tag>
    )
}

/* ── Words rising out of a mask ──────────────────────────────────────── */

interface WordsInProps extends BaseMotionProps {
    text: string
    as?: ElementType
    from?: number
}

export const WordsIn: FC<WordsInProps> = ({
    text,
    as: Tag = 'p',
    className,
    style,
    delay = 0,
    stagger = 0.045,
    duration = 1.15,
    ease = 'expo.out',
    trigger = 'scroll',
    start = 'top 85%',
    once = true,
    from = 122,
    id
}): ReactNode => {
    const ready = useSiteReady()

    const scope = useGsapContext<HTMLElement>(() => {
        const words = gsap.utils.toArray<HTMLElement>('.split-word')

        if (!words.length) return

        gsap.set(words, { yPercent: from, opacity: 0 })

        const animate = () =>
            gsap.to(words, {
                yPercent: 0,
                opacity: 1,
                duration,
                ease,
                delay,
                stagger
            })

        if (trigger === 'load') {
            if (ready) animate()
            return
        }

        onScrollIn(scope.current, start, once, animate)
    }, [text, ready, trigger])

    return (
        <Tag id={id} ref={scope} style={style} className={className}>
            <SplitWords text={text} />
        </Tag>
    )
}

/* ── Stacked lines, each in its own mask ─────────────────────────────── */

interface LinesInProps extends BaseMotionProps {
    lines: readonly (string | ReactNode)[]
    as?: ElementType
    lineClassName?: string
    from?: number
    skew?: number
}

export const LinesIn: FC<LinesInProps> = ({
    lines,
    as: Tag = 'div',
    className,
    lineClassName,
    style,
    delay = 0,
    stagger = 0.09,
    duration = 1.2,
    ease = 'expo.out',
    trigger = 'scroll',
    start = 'top 85%',
    once = true,
    from = 126,
    skew = 0,
    id
}): ReactNode => {
    const ready = useSiteReady()

    const scope = useGsapContext<HTMLElement>(() => {
        const inner = gsap.utils.toArray<HTMLElement>('[data-line-inner]')

        if (!inner.length) return

        gsap.set(inner, { yPercent: from, opacity: 0, skewY: skew })

        const animate = () =>
            gsap.to(inner, {
                yPercent: 0,
                opacity: 1,
                skewY: 0,
                duration,
                ease,
                delay,
                stagger
            })

        if (trigger === 'load') {
            if (ready) animate()
            return
        }

        onScrollIn(scope.current, start, once, animate)
    }, [lines.length, ready, trigger])

    return (
        <Tag id={id} ref={scope} style={style} className={className}>
            {lines.map((line, index) => (
                <span
                    key={index}
                    className={cn('mask-box block overflow-hidden', lineClassName)}
                >
                    <span data-line-inner className='block'>
                        {line}
                    </span>
                </span>
            ))}
        </Tag>
    )
}

/* ── Tracking (letter-spacing) expansion ─────────────────────────────── */

interface TrackInProps extends BaseMotionProps {
    text: string
    as?: ElementType
    /** Starting letter-spacing in em. */
    fromTracking?: number
    toTracking?: number
}

export const TrackIn: FC<TrackInProps> = ({
    text,
    as: Tag = 'span',
    className,
    style,
    delay = 0,
    stagger = 0.03,
    duration = 1.6,
    ease = 'expo.out',
    trigger = 'scroll',
    start = 'top 85%',
    once = true,
    fromTracking = 0.42,
    toTracking = 0,
    id
}): ReactNode => {
    const ready = useSiteReady()

    const scope = useGsapContext<HTMLElement>(() => {
        const root = scope.current

        if (!root) return

        const chars = gsap.utils.toArray<HTMLElement>('.split-char')

        gsap.set(root, { letterSpacing: `${fromTracking}em` })
        gsap.set(chars, { opacity: 0, filter: 'blur(6px)' })

        const animate = () => {
            const timeline = gsap.timeline({ delay })

            timeline
                .to(root, {
                    letterSpacing: `${toTracking}em`,
                    duration,
                    ease
                })
                .to(
                    chars,
                    {
                        opacity: 1,
                        filter: 'blur(0px)',
                        duration: duration * 0.55,
                        ease: 'power2.out',
                        stagger
                    },
                    0
                )
        }

        if (trigger === 'load') {
            if (ready) animate()
            return
        }

        onScrollIn(root, start, once, animate)
    }, [text, ready, trigger])

    return (
        <Tag
            id={id}
            ref={scope}
            style={style}
            className={cn('block', className)}
        >
            <SplitChars text={text} mask={false} />
        </Tag>
    )
}

/* ── Scroll-scrubbed character highlight ─────────────────────────────── */

interface ScrubCharsProps {
    text: string
    as?: ElementType
    className?: string
    id?: string
    /** Resting opacity before the scrub reaches a glyph. */
    dim?: number
    start?: string
    end?: string
}

/**
 * The statement treatment: every glyph sits at a low opacity and lights up in
 * sequence as the block crosses the viewport, so the sentence is literally
 * read by the scroll rather than faded in as a lump.
 */
export const ScrubChars: FC<ScrubCharsProps> = ({
    text,
    as: Tag = 'p',
    className,
    id,
    dim = 0.1,
    start = 'top 78%',
    end = 'bottom 55%'
}): ReactNode => {
    const scope = useGsapContext<HTMLElement>(() => {
        const root = scope.current

        if (!root) return

        const chars = gsap.utils.toArray<HTMLElement>('.split-char')

        if (!chars.length) return

        gsap.set(chars, { opacity: dim })

        gsap.to(chars, {
            opacity: 1,
            ease: 'none',
            stagger: 0.6,
            scrollTrigger: {
                trigger: root,
                start,
                end,
                scrub: 0.6,
                invalidateOnRefresh: true
            }
        })
    }, [text])

    return (
        <Tag id={id} ref={scope} className={className}>
            <SplitChars text={text} mask={false} />
        </Tag>
    )
}

/* ── Generic element reveal ──────────────────────────────────────────── */

interface RevealProps extends BaseMotionProps {
    children: ReactNode
    as?: ElementType
    y?: number
    x?: number
    scale?: number
    opacity?: number
    blur?: number
    /** Stagger direct children instead of the wrapper itself. */
    staggerChildren?: boolean
}

export const Reveal: FC<RevealProps> = ({
    children,
    as: Tag = 'div',
    className,
    style,
    delay = 0,
    stagger = 0.08,
    duration = 1.2,
    ease = 'expo.out',
    trigger = 'scroll',
    start = 'top 88%',
    once = true,
    y = 32,
    x = 0,
    scale = 1,
    opacity = 0,
    blur = 0,
    staggerChildren = false,
    id
}): ReactNode => {
    const ready = useSiteReady()

    const scope = useGsapContext<HTMLElement>(() => {
        const root = scope.current

        if (!root) return

        const targets = staggerChildren
            ? Array.from(root.children)
            : [root]

        if (!targets.length) return

        const fromVars: gsap.TweenVars = { y, x, opacity, scale }

        if (blur) fromVars.filter = `blur(${blur}px)`

        gsap.set(targets, fromVars)

        const toVars: gsap.TweenVars = {
            y: 0,
            x: 0,
            opacity: 1,
            scale: 1,
            duration,
            ease,
            delay,
            stagger: staggerChildren ? stagger : 0
        }

        if (blur) toVars.filter = 'blur(0px)'

        const animate = () => gsap.to(targets, toVars)

        if (trigger === 'load') {
            if (ready) animate()
            return
        }

        onScrollIn(root, start, once, animate)
    }, [ready, trigger, staggerChildren])

    return (
        <Tag id={id} ref={scope} style={style} className={className}>
            {children}
        </Tag>
    )
}

/* ── Hairline that draws itself ──────────────────────────────────────── */

interface DrawLineProps extends BaseMotionProps {
    orientation?: 'horizontal' | 'vertical'
    color?: string
    thickness?: number
}

export const DrawLine: FC<DrawLineProps> = ({
    className,
    style,
    delay = 0,
    duration = 1.4,
    ease = 'expo.out',
    trigger = 'scroll',
    start = 'top 92%',
    once = true,
    orientation = 'horizontal',
    color = '#292929',
    thickness = 1
}): ReactNode => {
    const ready = useSiteReady()
    const isHorizontal = orientation === 'horizontal'

    const scope = useGsapContext<HTMLDivElement>(() => {
        const root = scope.current

        if (!root) return

        gsap.set(root, isHorizontal ? { scaleX: 0 } : { scaleY: 0 })

        const animate = () =>
            gsap.to(root, {
                scaleX: 1,
                scaleY: 1,
                duration,
                ease,
                delay
            })

        if (trigger === 'load') {
            if (ready) animate()
            return
        }

        onScrollIn(root, start, once, animate)
    }, [ready, trigger])

    return (
        <div
            ref={scope}
            aria-hidden='true'
            className={cn('shrink-0', className)}
            style={{
                backgroundColor: color,
                transformOrigin: isHorizontal ? 'left center' : 'top center',
                ...(isHorizontal
                    ? { height: thickness, width: '100%' }
                    : { width: thickness, height: '100%' }),
                ...style
            }}
        />
    )
}
