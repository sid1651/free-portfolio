import type { FC, ReactNode } from 'react'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface NoiseWaveProps {
    level: number
    className?: string
}

/**
 * Two live waveforms: the noise outside (grey) and what actually reaches your ears (bronze).
 * `level` is the share of the outside world that gets through, from 0 to 1.
 */
export const NoiseWave: FC<NoiseWaveProps> = ({ level, className }): ReactNode => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const levelRef = useRef(level)
    const redrawRef = useRef<(() => void) | null>(null)

    useEffect(() => {
        levelRef.current = level
        redrawRef.current?.()
    }, [level])

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas?.getContext('2d')

        if (!canvas || !context) return

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const size = { width: 1, height: 1 }
        let current = levelRef.current
        let time = 1.2
        let last = performance.now()
        let frame = 0
        let running = false

        const noise = (x: number, t: number): number => (
            Math.sin(x * 0.045 + t * 2.1) * 0.42 +
            Math.sin(x * 0.11 - t * 3.3) * 0.26 +
            Math.sin(x * 0.29 + t * 5.7) * 0.18 +
            Math.sin(x * 0.61 - t * 8.9) * 0.14
        )

        const drawLine = (amplitude: number, color: string, width: number, offset: number): void => {
            const middle = size.height / 2

            context.beginPath()

            for (let x = 0; x <= size.width; x += 2) {
                const envelope = Math.sin((x / size.width) * Math.PI)
                const y = middle + noise(x + offset, time) * amplitude * middle * 0.9 * envelope

                if (x === 0) context.moveTo(x, y)
                else context.lineTo(x, y)
            }

            context.strokeStyle = color
            context.lineWidth = width
            context.stroke()
        }

        const draw = (): void => {
            context.clearRect(0, 0, size.width, size.height)
            drawLine(1, 'rgba(30, 28, 26, 0.22)', 1, 0)
            drawLine(Math.max(current, 0.035), 'rgba(184, 112, 63, 0.95)', 1.6, 40)
        }

        const tick = (): void => {
            const now = performance.now()
            const delta = Math.min((now - last) / 1000, 1 / 20)

            last = now
            time += delta
            current += (levelRef.current - current) * (1 - Math.exp(-delta * 3))
            draw()
            frame = requestAnimationFrame(tick)
        }

        const resize = (): void => {
            const rect = canvas.getBoundingClientRect()
            const ratio = Math.min(window.devicePixelRatio || 1, 2)

            size.width = Math.max(1, rect.width)
            size.height = Math.max(1, rect.height)
            canvas.width = Math.round(size.width * ratio)
            canvas.height = Math.round(size.height * ratio)
            context.setTransform(ratio, 0, 0, ratio, 0, 0)
            draw()
        }

        redrawRef.current = () => {
            if (running) return

            current = levelRef.current
            draw()
        }

        const resizeObserver = new ResizeObserver(resize)
        const intersectionObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !running && !reducedMotion) {
                running = true
                last = performance.now()
                frame = requestAnimationFrame(tick)
            } else if (!entry.isIntersecting && running) {
                running = false
                cancelAnimationFrame(frame)
            }
        })

        resizeObserver.observe(canvas)
        intersectionObserver.observe(canvas)
        resize()

        return () => {
            running = false
            redrawRef.current = null
            cancelAnimationFrame(frame)
            resizeObserver.disconnect()
            intersectionObserver.disconnect()
        }
    }, [])

    return <canvas ref={canvasRef} aria-hidden className={cn('block h-16 w-full', className)} />
}
