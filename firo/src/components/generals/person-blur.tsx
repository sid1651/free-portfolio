import type { FC } from 'react'
import type { PersonFrame, PersonLayer } from '@/lib/person-blur'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { isFinePointer } from '@/lib/motion/gsap'
import { renderPersonShader } from '@/lib/person-shader'
import { detectPersonLayer, renderPersonFallback, warmPersonDetector } from '@/lib/person-blur'

/**
 * Site-wide hover effect on photos of people, matched to the reference hero:
 * a chromatic lens blur that follows the pointer over the person only, while the
 * background stays sharp. The original <img> is never changed. A transparent canvas
 * with the same classes, crop and position sits right above it, the lens eases in
 * on hover, trails the pointer slightly, and eases back out when the pointer leaves.
 */

const MIN_SIDE = 96
const MAX_CACHED_LAYERS = 10
const REGION = 'main, header, footer, dialog, [role="dialog"], [aria-modal="true"]'

interface Overlay {
    src: string
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    layer: PersonLayer
    fit: string
    position: [string, string]
    hovering: boolean
    ease: number
    mouse: [number, number]
    frame: number
    last: number
}

const detections = new Map<string, Promise<PersonLayer | null>>()
const cachedLayers: string[] = []
const overlays = new WeakMap<HTMLImageElement, Overlay>()
const live = new Set<HTMLImageElement>()

let pointer: { x: number, y: number } | null = null

const sourceOf = (image: HTMLImageElement): string => image.currentSrc || image.src

const isCandidate = (image: HTMLImageElement): boolean => {
    const src = sourceOf(image)
    if (!src || /\.svg(\?|$)/i.test(src) || src.startsWith('data:')) return false
    if (!image.complete || !image.naturalWidth) return false
    return image.offsetWidth >= MIN_SIDE && image.offsetHeight >= MIN_SIDE
}

const removeOverlay = (image: HTMLImageElement): void => {
    const overlay = overlays.get(image)

    if (overlay) {
        window.cancelAnimationFrame(overlay.frame)
        overlay.canvas.remove()
    }

    overlays.delete(image)
    live.delete(image)
}

/** Keeps memory bounded: forget the oldest people layers that are not on screen right now. */
const remember = (src: string): void => {
    const existing = cachedLayers.indexOf(src)
    if (existing !== -1) cachedLayers.splice(existing, 1)
    cachedLayers.push(src)

    while (cachedLayers.length > MAX_CACHED_LAYERS) {
        const oldest = cachedLayers.shift()
        if (!oldest) break

        detections.delete(oldest)
        live.forEach(image => {
            const overlay = overlays.get(image)
            if (overlay?.src === oldest && !overlay.hovering && overlay.ease === 0) removeOverlay(image)
        })
    }
}

const detectionFor = (image: HTMLImageElement): Promise<PersonLayer | null> => {
    const src = sourceOf(image)
    let detection = detections.get(src)

    if (!detection) {
        detection = detectPersonLayer(image)
        detections.set(src, detection)
    }

    detection.then(layer => {
        if (layer) remember(src)
    })

    return detection
}

const offsetFor = (token: string, free: number): number => {
    if (token === 'left' || token === 'top') return 0
    if (token === 'right' || token === 'bottom') return free
    if (token.endsWith('%')) return (free * parseFloat(token)) / 100
    if (token.endsWith('px')) return parseFloat(token)
    return free / 2
}

/** Where the photo actually sits inside its box (object-fit and object-position). */
const frameFor = (overlay: Overlay): PersonFrame | null => {
    const boxWidth = overlay.canvas.offsetWidth
    const boxHeight = overlay.canvas.offsetHeight
    if (!boxWidth || !boxHeight) return null

    const { width, height } = overlay.layer
    let drawnWidth = boxWidth
    let drawnHeight = boxHeight

    if (overlay.fit !== 'fill') {
        let scale = Math.max(boxWidth / width, boxHeight / height)
        if (overlay.fit === 'contain') scale = Math.min(boxWidth / width, boxHeight / height)
        if (overlay.fit === 'scale-down') scale = Math.min(1, boxWidth / width, boxHeight / height)
        if (overlay.fit === 'none') scale = 1
        drawnWidth = width * scale
        drawnHeight = height * scale
    }

    return {
        box: [boxWidth, boxHeight],
        drawn: [drawnWidth, drawnHeight],
        offset: [offsetFor(overlay.position[0], boxWidth - drawnWidth), offsetFor(overlay.position[1], boxHeight - drawnHeight)],
        mouse: overlay.mouse,
        hover: overlay.ease,
        boost: Math.min(2, Math.max(1, 800 /Math.max(boxWidth, boxHeight)))
    }
}

/** Mirrors the image's classes, inline styles and position onto its overlay so both crop identically. */
const syncOverlay = (image: HTMLImageElement, overlay: Overlay): void => {
    const { canvas } = overlay
    const computed = window.getComputedStyle(image)

    canvas.className = image.className
    canvas.style.cssText = image.style.cssText

    if (computed.position !== 'absolute' && computed.position !== 'fixed') {
        canvas.style.position = 'absolute'
        canvas.style.left = `${image.offsetLeft}px`
        canvas.style.top = `${image.offsetTop}px`
        canvas.style.width = `${image.offsetWidth}px`
        canvas.style.height = `${image.offsetHeight}px`
        canvas.style.margin = '0'
    }

    const [x = '50%', y = x] = computed.objectPosition.trim().split(/\s+/)
    overlay.fit = computed.objectFit || 'fill'
    overlay.position = [x, y]

    canvas.style.objectFit = computed.objectFit
    canvas.style.objectPosition = computed.objectPosition
    canvas.style.pointerEvents = 'none'
    canvas.style.userSelect = 'none'
    canvas.style.visibility = overlay.hovering || overlay.ease > 0 ? 'visible' : 'hidden'
}

const draw = (overlay: Overlay): void => {
    const frame = frameFor(overlay)
    if (!frame) return
    if (!renderPersonShader(overlay.context, overlay.layer, frame)) renderPersonFallback(overlay.context, overlay.layer, frame)
}

/** Lens follows the pointer with a hint of drag and eases in and out, frame-rate independent. */
const animate = (overlay: Overlay): void => {
    const tick = (now: number): void => {
        const delta = overlay.last ? now - overlay.last : 1000 / 60
        overlay.last = now
        const steps = Math.min((delta / 1000) * 60, 3)

        let moved = false
        const rect = overlay.canvas.getBoundingClientRect()

        if (overlay.hovering && pointer && rect.width > 0 && rect.height > 0) {
            const targetX = (pointer.x - rect.left) / rect.width
            const targetY = (pointer.y - rect.top) / rect.height

            if (overlay.ease < 0.02) {
                overlay.mouse = [targetX, targetY]
            }
            else {
                const follow = 1 - Math.pow(0.8, steps)
                const nextX = overlay.mouse[0] + (targetX - overlay.mouse[0]) * follow
                const nextY = overlay.mouse[1] + (targetY - overlay.mouse[1]) * follow
                moved = Math.abs(nextX - overlay.mouse[0]) + Math.abs(nextY - overlay.mouse[1]) > 0.00005
                overlay.mouse = [nextX, nextY]
            }
        }

        const goal = overlay.hovering ? 1 : 0
        const previous = overlay.ease
        overlay.ease += (goal - overlay.ease) * (1 - Math.pow(0.85, steps))

        if (!overlay.hovering && overlay.ease < 0.004) {
            overlay.ease = 0
            overlay.context.clearRect(0, 0, overlay.canvas.width, overlay.canvas.height)
            overlay.canvas.style.visibility = 'hidden'
            overlay.frame = 0
            overlay.last = 0
            return
        }

        // A resting lens at full strength needs no new frame.
        if (moved || Math.abs(overlay.ease - previous) > 0.0005) draw(overlay)
        overlay.frame = window.requestAnimationFrame(tick)
    }

    if (!overlay.frame) {
        overlay.last = 0
        overlay.frame = window.requestAnimationFrame(tick)
    }
}

const mountOverlay = (image: HTMLImageElement, layer: PersonLayer): Overlay | null => {
    if (!image.isConnected || !image.parentElement) return null

    const src = sourceOf(image)
    const existing = overlays.get(image)

    if (existing && existing.src === src && existing.canvas.isConnected) {
        existing.layer = layer
        return existing
    }

    if (existing) removeOverlay(image)

    const canvas = document.createElement('canvas')
    canvas.width = layer.width
    canvas.height = layer.height
    canvas.setAttribute('aria-hidden', 'true')
    canvas.dataset.personBlur = ''

    const context = canvas.getContext('2d')
    if (!context) return null

    const overlay: Overlay = {
        src,
        canvas,
        context,
        layer,
        fit: 'cover',
        position: ['50%', '50%'],
        hovering: false,
        ease: 0,
        mouse: [0.5, 0.5],
        frame: 0,
        last: 0
    }

    syncOverlay(image, overlay)
    image.insertAdjacentElement('afterend', canvas)
    overlays.set(image, overlay)
    live.add(image)

    return overlay
}

const show = (image: HTMLImageElement, overlay: Overlay): void => {
    overlay.hovering = true
    syncOverlay(image, overlay)
    animate(overlay)
}

const hide = (image: HTMLImageElement): void => {
    const overlay = overlays.get(image)
    if (!overlay || !overlay.hovering) return

    overlay.hovering = false
    animate(overlay)
}

/** The photo under the pointer, ignoring anything that does not catch the pointer (hover previews, the cursor, grain). */
const imageAt = (x: number, y: number): HTMLImageElement | null => {
    const stack = document.elementsFromPoint(x, y)
    const index = stack.findIndex(element => element instanceof HTMLImageElement || element instanceof HTMLVideoElement)
    if (index === -1) return null

    const media = stack[index]
    if (!(media instanceof HTMLImageElement)) return null

    // Anything above the photo that belongs to another part of the page (a fixed header, an open menu) wins.
    const region = media.closest(REGION) ?? document.body
    const covered = stack.slice(0, index).some(element => !region.contains(element))

    return covered ? null : media
}

export const PersonBlur: FC = () => {
    const router = useRouter()

    useEffect(() => {
        if (!isFinePointer() || typeof document.elementsFromPoint !== 'function') return

        let active: HTMLImageElement | null = null
        let requested: HTMLImageElement | null = null
        let frame = 0
        let warmed = false

        const warm = (): void => {
            if (warmed) return
            warmed = true
            warmPersonDetector()
        }

        const activate = (image: HTMLImageElement | null): void => {
            if (image !== active) {
                if (active) hide(active)
                active = image
                requested = null
            }

            // An image that is still loading gets picked up on a later check.
            if (!image || requested === image || !isCandidate(image)) return
            requested = image
            warm()

            detectionFor(image).then(layer => {
                if (!layer || active !== image) return
                const overlay = mountOverlay(image, layer)
                if (overlay && active === image) show(image, overlay)
            })
        }

        const evaluate = (): void => {
            frame = 0
            activate(pointer ? imageAt(pointer.x, pointer.y) : null)
        }

        const schedule = (): void => {
            if (!frame) frame = window.requestAnimationFrame(evaluate)
        }

        const handleMove = (event: PointerEvent): void => {
            if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
            pointer = { x: event.clientX, y: event.clientY }
            schedule()
        }

        const handleLeave = (): void => {
            pointer = null
            schedule()
        }

        // Content can move or change under a still pointer (scrolling, a video fading in over a cover).
        const recheck = window.setInterval(() => {
            if (pointer) schedule()
        }, 300)

        // Remove overlays whose image left the page or switched to a different file.
        const tidy = (): void => {
            live.forEach(image => {
                const overlay = overlays.get(image)
                if (image.isConnected && overlay && overlay.src === sourceOf(image) && overlay.canvas.isConnected) return

                removeOverlay(image)

                if (active === image) {
                    active = null
                    requested = null
                }
            })
        }

        // Keep every overlay aligned with its image after the layout changes size.
        const realign = (): void => {
            tidy()
            live.forEach(image => {
                const overlay = overlays.get(image)
                if (overlay) syncOverlay(image, overlay)
            })
        }

        const observer = new MutationObserver(tidy)
        observer.observe(document.body, { childList: true, subtree: true })

        // Load the detector quietly once the page has settled, so the first hover feels instant.
        const idle = window.setTimeout(warm, 4000)

        document.addEventListener('pointermove', handleMove, { passive: true })
        document.documentElement.addEventListener('pointerleave', handleLeave)
        window.addEventListener('scroll', schedule, { passive: true })
        window.addEventListener('resize', realign)
        window.addEventListener('blur', handleLeave)

        return () => {
            window.cancelAnimationFrame(frame)
            window.clearInterval(recheck)
            window.clearTimeout(idle)
            observer.disconnect()
            document.removeEventListener('pointermove', handleMove)
            document.documentElement.removeEventListener('pointerleave', handleLeave)
            window.removeEventListener('scroll', schedule)
            window.removeEventListener('resize', realign)
            window.removeEventListener('blur', handleLeave)
            if (active) hide(active)
        }
    }, [])

    // A new page starts with every photo sharp.
    useEffect(() => {
        const reset = (): void => {
            live.forEach(image => hide(image))
        }

        router.events.on('routeChangeStart', reset)
        return () => router.events.off('routeChangeStart', reset)
    }, [router.events])

    return null
}
