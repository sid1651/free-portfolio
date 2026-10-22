import type { FC, ReactNode } from 'react'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface SoundFieldProps {
    className?: string
}

const COLUMNS = 68
const ROWS = 26
const FAR = 1 / 3.4
const INK: [number, number, number] = [22, 30, 52]
const BRONZE: [number, number, number] = [176, 138, 78]

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max)
const lerp = (from: number, to: number, amount: number): number => from + (to - from) * amount

/**
 * A perspective field of points that ripples outward from a moving sound source.
 * The source drifts on its own and follows the pointer or a finger when one is over the field.
 */
export const SoundField: FC<SoundFieldProps> = ({ className }): ReactNode => {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const sourceRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        const canvas = canvasRef.current
        const context = canvas?.getContext('2d')

        if (!container || !canvas || !context) return

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const size = { width: 1, height: 1 }
        const pointer = { x: 0, depth: 0.5, targetX: 0, targetDepth: 0.5, weight: 0, targetWeight: 0 }
        let frame = 0
        let running = false
        let inView = false
        let time = 2.4
        let last = performance.now()

        const draw = (): void => {
            const { width, height } = size
            const horizon = height * 0.12
            const near = height * 0.98

            context.clearRect(0, 0, width, height)

            const orbit = time * 0.32
            const sourceX = lerp(Math.cos(orbit) * 0.5, pointer.x, pointer.weight)
            const sourceDepth = lerp(0.45 + Math.sin(orbit) * 0.28, pointer.depth, pointer.weight)

            for (let row = ROWS - 1; row >= 0; row--) {
                const depth = row / (ROWS - 1)
                const scale = 1 / (1 + depth * 2.4)
                const baseY = horizon + (near - horizon) * ((scale - FAR) / (1 - FAR))

                for (let column = 0; column < COLUMNS; column++) {
                    const x = (column / (COLUMNS - 1)) * 2 - 1
                    const distance = Math.hypot(x - sourceX, (depth - sourceDepth) * 1.7)
                    const ripple = Math.sin(distance * 15 - time * 3.1) * Math.exp(-distance * 2.1) * 0.55
                    const swell = Math.sin(x * 3.6 + time * 0.8) * Math.cos(depth * 5 - time * 0.55) * 0.16
                    const wave = ripple + swell
                    const screenX = width / 2 + x * width * 0.6 * scale
                    const screenY = baseY - wave * height * 0.15 * scale
                    const energy = clamp(Math.exp(-distance * 3.2) * 1.25, 0, 1)
                    const lift = clamp(wave * 1.6 + 0.5, 0, 1)
                    const radius = (0.45 + 1.5 * scale) * (0.85 + lift * 0.45)
                    const alpha = (0.1 + 0.78 * scale) * (0.45 + 0.55 * lift)
                    const red = Math.round(lerp(INK[0], BRONZE[0], energy))
                    const green = Math.round(lerp(INK[1], BRONZE[1], energy))
                    const blue = Math.round(lerp(INK[2], BRONZE[2], energy))

                    context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha.toFixed(3)})`
                    context.beginPath()
                    context.arc(screenX, screenY, radius, 0, Math.PI * 2)
                    context.fill()
                }
            }

            const source = sourceRef.current

            if (source) {
                const scale = 1 / (1 + sourceDepth * 2.4)
                const x = width / 2 + sourceX * width * 0.6 * scale
                const y = horizon + (near - horizon) * ((scale - FAR) / (1 - FAR))

                source.style.transform = `translate3d(${x.toFixed(1)}px, ${(y - 34 * scale - 18).toFixed(1)}px, 0)`
            }
        }

        const tick = (): void => {
            const now = performance.now()
            const delta = Math.min((now - last) / 1000, 1 / 20)

            last = now
            time += delta

            const ease = 1 - Math.exp(-delta * 3)

            pointer.x += (pointer.targetX - pointer.x) * ease
            pointer.depth += (pointer.targetDepth - pointer.depth) * ease
            pointer.weight += (pointer.targetWeight - pointer.weight) * (1 - Math.exp(-delta * 2))

            draw()
            frame = requestAnimationFrame(tick)
        }

        const start = (): void => {
            if (running || reducedMotion) return

            running = true
            last = performance.now()
            frame = requestAnimationFrame(tick)
        }

        const stop = (): void => {
            running = false
            cancelAnimationFrame(frame)
        }

        const resize = (): void => {
            const rect = container.getBoundingClientRect()
            const ratio = Math.min(window.devicePixelRatio || 1, 2)

            size.width = Math.max(1, rect.width)
            size.height = Math.max(1, rect.height)
            canvas.width = Math.round(size.width * ratio)
            canvas.height = Math.round(size.height * ratio)
            context.setTransform(ratio, 0, 0, ratio, 0, 0)

            if (!running) draw()
        }

        const onPointerMove = (event: PointerEvent): void => {
            const rect = container.getBoundingClientRect()
            const horizon = rect.height * 0.12
            const near = rect.height * 0.98
            const progress = clamp((event.clientY - rect.top - horizon) / (near - horizon), 0.02, 1)
            const scale = FAR + progress * (1 - FAR)
            const depth = clamp((1 / scale - 1) / 2.4, 0, 1)
            const x = clamp(((event.clientX - rect.left) / rect.width - 0.5) / (0.6 * scale), -1.2, 1.2)

            pointer.targetX = x
            pointer.targetDepth = depth
            pointer.targetWeight = 1

            if (reducedMotion) {
                pointer.x = x
                pointer.depth = depth
                pointer.weight = 1
                draw()
            }
        }

        const onPointerLeave = (): void => {
            pointer.targetWeight = 0
        }

        const resizeObserver = new ResizeObserver(resize)
        const intersectionObserver = new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting

            if (inView) start()
            else stop()
        })

        resizeObserver.observe(container)
        intersectionObserver.observe(container)
        container.addEventListener('pointermove', onPointerMove)
        container.addEventListener('pointerleave', onPointerLeave)
        resize()

        return () => {
            stop()
            resizeObserver.disconnect()
            intersectionObserver.disconnect()
            container.removeEventListener('pointermove', onPointerMove)
            container.removeEventListener('pointerleave', onPointerLeave)
        }
    }, [])

    return (
        <div ref={containerRef} className={cn('relative touch-pan-y', className)}>
            <canvas ref={canvasRef} aria-hidden className='absolute inset-0 size-full' />

            <div ref={sourceRef} aria-hidden className='pointer-events-none absolute left-0 top-0 will-change-transform'>
                <span className='flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-foreground/10 bg-background/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground backdrop-blur-md'>
                    <span className='size-1.5 rounded-full bg-bronze' />
                    Source
                </span>
            </div>
        </div>
    )
}
