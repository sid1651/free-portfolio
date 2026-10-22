import type { FC, KeyboardEvent as ReactKeyboardEvent, ReactNode, RefObject } from 'react'
import type { FinishId } from '@/types'
import type { HeadphonesRig } from '@/components/landing/showcase/headphones-model'

import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { MoveHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createHeadphones } from '@/components/landing/showcase/headphones-model'
import { createStudioEnvironment } from '@/components/landing/showcase/studio'
import { StagePlaceholder } from '@/components/landing/showcase/stage-placeholder'
import { createDialTexture, createRadialTexture } from '@/components/landing/showcase/textures'

export interface StageReadouts {
    rotation?: RefObject<HTMLElement | null>
    tilt?: RefObject<HTMLElement | null>
}

interface HeadphonesStageProps {
    finish: FinishId
    variant?: 'hero' | 'compact'
    readouts?: StageReadouts
    parallaxTarget?: RefObject<HTMLElement | null>
    onReady?: () => void
    onInteract?: () => void
    onUnsupported?: () => void
    className?: string
    label?: string
}

interface Hotspot {
    id: string
    title: string
    detail: string
}

interface Framing {
    heightFraction: number
    widthFraction: number
    centerY: number
}

interface Controller {
    setFinish: (finish: FinishId) => void
    nudge: (turn: number, tilt: number) => void
}

const HOTSPOTS: Hotspot[] = [
    { id: 'crown', title: 'Precision crown', detail: 'Volume, play and assistant' },
    { id: 'chamfer', title: 'Bronze chamfer', detail: 'Diamond-cut, hand-polished' },
    { id: 'knit', title: 'Knit canopy', detail: 'Breathable, weight-spreading' },
    { id: 'yoke', title: 'Steel yoke', detail: 'Machined 316L stainless' },
    { id: 'cushion', title: 'Memory foam', detail: 'Wrapped in protein leather' },
    { id: 'pivot', title: 'Dual-axis hinge', detail: 'Follows the shape of your head' }
]

const FRAMING: Record<'hero' | 'compact', { wide: Framing; narrow: Framing }> = {
    hero: {
        wide: { heightFraction: 0.56, widthFraction: 0.6, centerY: 0.41 },
        narrow: { heightFraction: 0.42, widthFraction: 0.84, centerY: 0.45 }
    },
    compact: {
        wide: { heightFraction: 0.64, widthFraction: 0.74, centerY: 0.46 },
        narrow: { heightFraction: 0.56, widthFraction: 0.84, centerY: 0.47 }
    }
}

const HERO_ANGLE = -0.62
const IDLE_SPEED = 0.13
const PRODUCT_HEIGHT = 1.95
const PRODUCT_WIDTH = 2.05
const FLOOR_Y = -1.14
const MAX_LABELS = 3

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max)

const smoothstep = (edge0: number, edge1: number, value: number): number => {
    const t = clamp((value - edge0) / (edge1 - edge0), 0, 1)

    return t * t * (3 - 2 * t)
}

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)

const formatRotation = (radians: number): string => {
    const degrees = Math.round(((THREE.MathUtils.radToDeg(radians) % 360) + 360) % 360) % 360

    return `${String(degrees).padStart(3, '0')}°`
}

const formatTilt = (radians: number): string => {
    const degrees = Math.round(THREE.MathUtils.radToDeg(radians))

    return `${degrees < 0 ? '−' : '+'}${String(Math.abs(degrees)).padStart(2, '0')}°`
}

export const HeadphonesStage: FC<HeadphonesStageProps> = ({
    finish,
    variant = 'hero',
    readouts,
    parallaxTarget,
    onReady,
    onInteract,
    onUnsupported,
    className,
    label = 'Arden Halo headphones in 3D. Drag, swipe or use the arrow keys to turn them.'
}): ReactNode => {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasHostRef = useRef<HTMLDivElement>(null)
    const cursorRef = useRef<HTMLDivElement>(null)
    const labelRefs = useRef<Record<string, HTMLDivElement | null>>({})
    const controllerRef = useRef<Controller | null>(null)
    const finishRef = useRef<FinishId>(finish)
    const optionsRef = useRef({ readouts, parallaxTarget, onReady, onInteract, onUnsupported })
    const [ready, setReady] = useState(false)
    const showLabels = variant === 'hero'

    useEffect(() => {
        optionsRef.current = { readouts, parallaxTarget, onReady, onInteract, onUnsupported }
    })

    useEffect(() => {
        finishRef.current = finish
        controllerRef.current?.setFinish(finish)
    }, [finish])

    useEffect(() => {
        const container = containerRef.current
        const host = canvasHostRef.current

        if (!container || !host) return

        const canvas = document.createElement('canvas')

        canvas.className = 'block size-full'
        canvas.setAttribute('aria-hidden', 'true')
        host.appendChild(canvas)

        let renderer: THREE.WebGLRenderer

        try {
            renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
        } catch {
            canvas.remove()
            optionsRef.current.onUnsupported?.()
            return
        }

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const framing = FRAMING[variant]
        const narrowScreen = window.innerWidth < 768

        renderer.setClearColor(0x000000, 0)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.NeutralToneMapping
        renderer.toneMappingExposure = 1
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap

        const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()
        const scene = new THREE.Scene()
        const studio = createStudioEnvironment(renderer)

        scene.environment = studio.texture
        scene.environmentIntensity = 0.95

        const camera = new THREE.PerspectiveCamera(22, 1, 0.1, 100)
        const cameraBase = new THREE.Vector3()
        let cameraDistance = 8
        let lookY = 0

        const keyLight = new THREE.DirectionalLight('#fffaf2', 2.3)

        keyLight.position.set(-2.6, 6.5, 3.6)
        keyLight.castShadow = true
        keyLight.shadow.mapSize.set(narrowScreen ? 1024 : 2048, narrowScreen ? 1024 : 2048)
        keyLight.shadow.camera.left = -2.4
        keyLight.shadow.camera.right = 2.4
        keyLight.shadow.camera.top = 2.4
        keyLight.shadow.camera.bottom = -2.4
        keyLight.shadow.camera.near = 1
        keyLight.shadow.camera.far = 18
        keyLight.shadow.camera.updateProjectionMatrix()
        keyLight.shadow.bias = -0.0004
        keyLight.shadow.normalBias = 0.02
        scene.add(keyLight, keyLight.target)

        const rimLight = new THREE.DirectionalLight('#e9efff', 1)

        rimLight.position.set(3.4, 2.6, -4.2)
        scene.add(rimLight)
        scene.add(new THREE.HemisphereLight('#ffffff', '#cfd5df', 0.3))

        const floatGroup = new THREE.Group()
        const tiltGroup = new THREE.Group()
        const turnGroup = new THREE.Group()

        scene.add(floatGroup)
        floatGroup.add(tiltGroup)
        tiltGroup.add(turnGroup)

        const rig: HeadphonesRig = createHeadphones({ anisotropy: maxAnisotropy, finish: finishRef.current })

        rig.root.position.y = -0.09
        turnGroup.add(rig.root)

        // Floor: real cast shadow, a soft contact shadow and a precision dial that turns with the product.
        const floorDisposables: Array<THREE.BufferGeometry | THREE.Material | THREE.Texture> = []
        const shadowGeometry = new THREE.PlaneGeometry(12, 12)
        const shadowMaterial = new THREE.ShadowMaterial({ color: '#141a2a', opacity: 0.12 })
        const shadowCatcher = new THREE.Mesh(shadowGeometry, shadowMaterial)

        shadowCatcher.rotation.x = -Math.PI / 2
        shadowCatcher.position.y = FLOOR_Y
        shadowCatcher.receiveShadow = true
        scene.add(shadowCatcher)

        const floorSpin = new THREE.Group()

        floorSpin.position.y = FLOOR_Y
        scene.add(floorSpin)

        const contactTexture = createRadialTexture([
            [0, 'rgba(0, 0, 0, 0.62)'],
            [0.35, 'rgba(0, 0, 0, 0.3)'],
            [0.7, 'rgba(0, 0, 0, 0.08)'],
            [1, 'rgba(0, 0, 0, 0)']
        ])
        const contactGeometry = new THREE.PlaneGeometry(1, 1)
        const contactMaterial = new THREE.MeshBasicMaterial({ map: contactTexture, transparent: true, depthWrite: false, toneMapped: false })
        const contact = new THREE.Mesh(contactGeometry, contactMaterial)

        contact.rotation.x = -Math.PI / 2
        contact.position.y = 0.003
        contact.renderOrder = 1
        floorSpin.add(contact)

        const dialTexture = createDialTexture()

        dialTexture.anisotropy = maxAnisotropy

        const dialGeometry = new THREE.PlaneGeometry(3.7, 3.7)
        const dialMaterial = new THREE.MeshBasicMaterial({ map: dialTexture, transparent: true, depthWrite: false, opacity: 0.26, toneMapped: false })
        const dial = new THREE.Mesh(dialGeometry, dialMaterial)

        dial.rotation.x = -Math.PI / 2
        dial.position.y = 0.001
        floorSpin.add(dial)

        const markerShape = new THREE.Shape()

        markerShape.moveTo(-0.035, 0)
        markerShape.lineTo(0.035, 0)
        markerShape.lineTo(0, 0.07)
        markerShape.closePath()

        const markerGeometry = new THREE.ShapeGeometry(markerShape)
        const markerMaterial = new THREE.MeshBasicMaterial({ color: '#b08a4e', transparent: true, opacity: 0.9, depthWrite: false, toneMapped: false })
        const marker = new THREE.Mesh(markerGeometry, markerMaterial)

        marker.rotation.x = -Math.PI / 2
        marker.position.set(0, FLOOR_Y + 0.002, 1.8)
        scene.add(marker)

        floorDisposables.push(
            shadowGeometry,
            shadowMaterial,
            contactTexture,
            contactGeometry,
            contactMaterial,
            dialTexture,
            dialGeometry,
            dialMaterial,
            markerGeometry,
            markerMaterial
        )

        // Interaction state.
        const state = {
            rotY: HERO_ANGLE,
            rotX: 0.12,
            velY: 0,
            velX: 0,
            idleDirection: 1,
            dragging: false,
            pointerId: -1,
            lastX: 0,
            lastY: 0,
            lastTime: 0,
            caught: false,
            samples: [] as Array<{ turn: number; tilt: number; duration: number; time: number }>,
            hoverX: 0,
            hoverY: 0,
            hoverTargetX: 0,
            hoverTargetY: 0,
            hoverWeight: 1,
            cursorX: 0,
            cursorY: 0,
            cursorTargetX: 0,
            cursorTargetY: 0,
            cursorOpacity: 0,
            cursorVisible: false,
            previousRotY: HERO_ANGLE,
            angularSpeed: 0,
            introStart: -1,
            interacted: false
        }

        const size = { width: 1, height: 1 }
        const labelState = HOTSPOTS.map((hotspot) => ({ id: hotspot.id, opacity: 0, side: '', shown: false }))
        const anchorById = new Map(rig.anchors.map((anchor) => [anchor.id, anchor]))
        const tmpPosition = new THREE.Vector3()
        const tmpNormal = new THREE.Vector3()
        const toCamera = new THREE.Vector3()
        const normalMatrix = new THREE.Matrix3()
        let lastRotationText = ''
        let lastTiltText = ''
        let lastParallaxX = 0
        let lastParallaxY = 0
        let readyFlag = false
        let lastFrame = performance.now()
        let elapsed = 0
        let running = false
        let inView = false
        let compiled = false
        let disposed = false
        let pageVisible = !document.hidden

        const markInteracted = (): void => {
            if (state.interacted) return

            state.interacted = true
            optionsRef.current.onInteract?.()
        }

        const beginIntro = (): void => {
            state.introStart = performance.now()

            if (reducedMotion) return

            state.rotY = HERO_ANGLE - 5.2
            state.previousRotY = state.rotY
            state.velY = 6.4
        }

        const frameCamera = (): void => {
            const aspect = size.width / size.height
            const fit = aspect < 0.9 ? framing.narrow : framing.wide
            const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
            const byHeight = PRODUCT_HEIGHT / fit.heightFraction / (2 * tanHalf)
            const byWidth = PRODUCT_WIDTH / fit.widthFraction / (2 * tanHalf * aspect)

            cameraDistance = Math.max(byHeight, byWidth)
            lookY = -(0.5 - fit.centerY) * 2 * cameraDistance * tanHalf
            cameraBase.set(0, lookY + cameraDistance * 0.13, cameraDistance)
        }

        const resize = (): void => {
            const rect = container.getBoundingClientRect()
            const width = Math.max(1, Math.round(rect.width))
            const height = Math.max(1, Math.round(rect.height))

            if (width === size.width && height === size.height) return

            size.width = width
            size.height = height
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 768 ? 1.6 : 1.8))
            renderer.setSize(width, height, false)
            camera.aspect = width / height
            camera.updateProjectionMatrix()
            frameCamera()
        }

        const updateLabels = (delta: number, intro: number): void => {
            if (!showLabels) return

            const calm = 1 - smoothstep(0.7, 2.6, state.angularSpeed)
            const enabled = size.width >= 768 ? 1 : 0
            const ranked = labelState
                .map((entry) => {
                    const anchor = anchorById.get(entry.id)

                    if (!anchor) return { entry, score: -1, x: 0, y: 0 }

                    anchor.object.getWorldPosition(tmpPosition)
                    normalMatrix.getNormalMatrix(anchor.object.matrixWorld)
                    tmpNormal.copy(anchor.normal).applyMatrix3(normalMatrix).normalize()
                    toCamera.copy(camera.position).sub(tmpPosition).normalize()

                    const facing = tmpNormal.dot(toCamera) + (entry.shown ? 0.08 : 0)

                    tmpPosition.project(camera)

                    return {
                        entry,
                        score: facing,
                        x: (tmpPosition.x * 0.5 + 0.5) * size.width,
                        y: (-tmpPosition.y * 0.5 + 0.5) * size.height
                    }
                })
                .sort((a, b) => b.score - a.score)

            ranked.forEach(({ entry, score, x, y }, rank) => {
                const element = labelRefs.current[entry.id]

                if (!element) return

                const insideBand = smoothstep(0.1, 0.16, y / size.height) * (1 - smoothstep(0.74, 0.8, y / size.height))
                const visible = rank < MAX_LABELS ? smoothstep(0.2, 0.45, score) : 0
                const target = visible * calm * enabled * intro * insideBand

                entry.shown = target > 0.5
                entry.opacity += (target - entry.opacity) * (1 - Math.exp(-delta * 7))

                const side = x > size.width / 2 + (entry.side === 'left' ? 24 : -24) ? 'right' : 'left'

                if (side !== entry.side) {
                    entry.side = side
                    element.dataset.side = side
                }

                element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
                element.style.opacity = entry.opacity.toFixed(3)
            })
        }

        const updateReadouts = (turn: number, tilt: number): void => {
            const { readouts: targets } = optionsRef.current
            const rotationText = formatRotation(turn)
            const tiltText = formatTilt(tilt)

            if (rotationText !== lastRotationText && targets?.rotation?.current) {
                targets.rotation.current.textContent = rotationText
                lastRotationText = rotationText
            }

            if (tiltText !== lastTiltText && targets?.tilt?.current) {
                targets.tilt.current.textContent = tiltText
                lastTiltText = tiltText
            }
        }

        const updateParallax = (): void => {
            const target = optionsRef.current.parallaxTarget?.current

            if (!target) return

            if (Math.abs(state.hoverX - lastParallaxX) < 0.001 && Math.abs(state.hoverY - lastParallaxY) < 0.001) return

            lastParallaxX = state.hoverX
            lastParallaxY = state.hoverY
            target.style.setProperty('--mx', state.hoverX.toFixed(4))
            target.style.setProperty('--my', state.hoverY.toFixed(4))
        }

        const updateCursor = (delta: number): void => {
            const element = cursorRef.current

            if (!element) return

            const follow = 1 - Math.exp(-delta * 16)

            state.cursorX += (state.cursorTargetX - state.cursorX) * follow
            state.cursorY += (state.cursorTargetY - state.cursorY) * follow
            state.cursorOpacity += ((state.cursorVisible ? 1 : 0) - state.cursorOpacity) * (1 - Math.exp(-delta * 10))
            element.style.transform = `translate3d(${state.cursorX.toFixed(1)}px, ${state.cursorY.toFixed(1)}px, 0)`
            element.style.opacity = state.cursorOpacity.toFixed(3)
        }

        const renderFrame = (): void => {
            const now = performance.now()
            const delta = Math.min((now - lastFrame) / 1000, 1 / 20)

            lastFrame = now
            elapsed += delta

            if (state.introStart < 0) beginIntro()

            const intro = reducedMotion ? 1 : easeOutCubic(clamp((now - state.introStart) / 1900, 0, 1))

            if (!state.dragging) {
                const idleVelocity = reducedMotion ? 0 : IDLE_SPEED * state.idleDirection
                const restTilt = 0.12 + (reducedMotion ? 0 : Math.sin(elapsed * 0.42) * 0.035)

                state.velY += (idleVelocity - state.velY) * (1 - Math.exp(-delta * 1.3))
                state.rotY += state.velY * delta
                state.velX += (15 * (restTilt - state.rotX) - 6.2 * state.velX) * delta
                state.rotX += state.velX * delta
            }

            state.rotX = clamp(state.rotX, -0.62, 0.82)

            const turnDelta = state.rotY - state.previousRotY

            state.previousRotY = state.rotY
            state.angularSpeed += (Math.abs(turnDelta) / Math.max(delta, 0.001) - state.angularSpeed) * (1 - Math.exp(-delta * 10))

            const hoverEase = 1 - Math.exp(-delta * 3.5)

            state.hoverWeight += ((state.dragging ? 0 : 1) - state.hoverWeight) * (1 - Math.exp(-delta * 4))
            state.hoverX += (state.hoverTargetX - state.hoverX) * hoverEase
            state.hoverY += (state.hoverTargetY - state.hoverY) * hoverEase

            const turn = state.rotY + state.hoverX * 0.2 * state.hoverWeight
            const tilt = state.rotX + state.hoverY * 0.1 * state.hoverWeight
            const bob = reducedMotion ? 0 : Math.sin(elapsed * 0.95) * 0.035

            turnGroup.rotation.y = turn
            tiltGroup.rotation.x = tilt
            floatGroup.position.y = bob - (1 - intro) * 0.25
            floatGroup.rotation.z = (reducedMotion ? 0 : Math.sin(elapsed * 0.6) * 0.012) - clamp(state.velY, -8, 8) * 0.004
            floatGroup.scale.setScalar(0.86 + 0.14 * intro)

            const lift = bob + 0.035

            floorSpin.rotation.y = turn
            contact.scale.set(2.5 + lift * 3, 1.05 + lift * 1.2, 1)
            contactMaterial.opacity = (0.82 - lift * 3.5) * intro
            dialMaterial.opacity = 0.26 * intro
            markerMaterial.opacity = 0.9 * intro

            camera.position.set(
                cameraBase.x + state.hoverX * cameraDistance * 0.018,
                cameraBase.y - state.hoverY * cameraDistance * 0.01,
                cameraBase.z
            )
            camera.lookAt(0, lookY, 0)

            rig.crown.rotation.y += turnDelta * 3.2
            rig.setLedLevel(0.55 + 0.45 * Math.pow(Math.sin(elapsed * 1.8), 2) + Math.min(state.angularSpeed * 0.35, 1.4))
            rig.updateFinish(delta)

            scene.updateMatrixWorld()
            camera.updateMatrixWorld()
            updateLabels(delta, intro)
            updateReadouts(turn, tilt)
            updateParallax()
            updateCursor(delta)

            renderer.render(scene, camera)

            if (!readyFlag) {
                readyFlag = true
                setReady(true)
                optionsRef.current.onReady?.()
            }
        }

        const start = (): void => {
            if (running) return

            running = true
            lastFrame = performance.now()
            renderer.setAnimationLoop(renderFrame)
        }

        const stop = (): void => {
            if (!running) return

            running = false
            renderer.setAnimationLoop(null)
        }

        const syncLoop = (): void => {
            if (inView && pageVisible && compiled && !disposed) start()
            else stop()
        }

        const onContextLost = (event: Event): void => {
            event.preventDefault()
            stop()
            optionsRef.current.onUnsupported?.()
        }

        // Pointer, touch and keyboard.
        const onPointerDown = (event: PointerEvent): void => {
            if (event.pointerType === 'mouse' && event.button !== 0) return

            state.dragging = true
            state.caught = false
            state.pointerId = event.pointerId
            state.lastX = event.clientX
            state.lastY = event.clientY
            state.lastTime = event.timeStamp
            state.samples.length = 0

            try {
                container.setPointerCapture(event.pointerId)
            } catch {
                // Capture is best effort.
            }

            cursorRef.current?.setAttribute('data-dragging', 'true')
            markInteracted()
        }

        const onPointerMove = (event: PointerEvent): void => {
            const rect = container.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top

            state.hoverTargetX = clamp((x / Math.max(rect.width, 1)) * 2 - 1, -1, 1)
            state.hoverTargetY = clamp((y / Math.max(rect.height, 1)) * 2 - 1, -1, 1)
            state.cursorTargetX = x
            state.cursorTargetY = y

            if (event.pointerType === 'mouse') {
                if (!state.cursorVisible && state.cursorOpacity < 0.05) {
                    state.cursorX = x
                    state.cursorY = y
                }

                state.cursorVisible = true
            }

            if (!state.dragging || event.pointerId !== state.pointerId) return

            if (!state.caught) {
                state.caught = true
                state.velY *= 0.15
                state.velX = 0
            }

            const perPixel = (Math.PI * 2) / Math.max(rect.width * 0.85, 560)
            const turn = (event.clientX - state.lastX) * perPixel
            const tilt = (event.clientY - state.lastY) * perPixel * 0.55
            const duration = Math.max(event.timeStamp - state.lastTime, 1)

            state.rotY += turn
            state.rotX = clamp(state.rotX + tilt, -0.62, 0.82)
            state.lastX = event.clientX
            state.lastY = event.clientY
            state.lastTime = event.timeStamp
            state.samples.push({ turn, tilt, duration, time: event.timeStamp })

            while (state.samples.length > 0 && event.timeStamp - state.samples[0].time > 90) state.samples.shift()
        }

        const endDrag = (event: PointerEvent): void => {
            if (!state.dragging || event.pointerId !== state.pointerId) return

            state.dragging = false

            let turn = 0
            let tilt = 0
            let duration = 0

            for (const sample of state.samples) {
                if (event.timeStamp - sample.time > 90) continue

                turn += sample.turn
                tilt += sample.tilt
                duration += sample.duration
            }

            if (duration > 0 && state.caught) {
                state.velY = clamp((turn / duration) * 1000, -14, 14)
                state.velX = clamp((tilt / duration) * 1000, -5, 5)
            }

            if (Math.abs(state.velY) > 0.3) state.idleDirection = Math.sign(state.velY)

            try {
                if (container.hasPointerCapture(event.pointerId)) container.releasePointerCapture(event.pointerId)
            } catch {
                // Already released.
            }

            cursorRef.current?.setAttribute('data-dragging', 'false')
        }

        const onPointerLeave = (event: PointerEvent): void => {
            if (event.pointerType === 'mouse') state.cursorVisible = false
            if (state.dragging) return

            state.hoverTargetX = 0
            state.hoverTargetY = 0
        }

        controllerRef.current = {
            setFinish: (id) => rig.setFinish(id),
            nudge: (turn, tilt) => {
                state.velY += turn
                state.velX += tilt

                if (Math.abs(turn) > 0) state.idleDirection = Math.sign(turn)

                markInteracted()
            }
        }

        container.addEventListener('pointerdown', onPointerDown)
        container.addEventListener('pointermove', onPointerMove)
        container.addEventListener('pointerup', endDrag)
        container.addEventListener('pointercancel', endDrag)
        container.addEventListener('pointerleave', onPointerLeave)

        const resizeObserver = new ResizeObserver(resize)
        const intersectionObserver = new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting
            syncLoop()
        }, { rootMargin: '120px 0px' })

        const onVisibility = (): void => {
            pageVisible = !document.hidden
            syncLoop()
        }

        resizeObserver.observe(container)
        intersectionObserver.observe(container)
        document.addEventListener('visibilitychange', onVisibility)
        canvas.addEventListener('webglcontextlost', onContextLost)
        resize()

        // Compile every material up front so the intro spin never stutters on first use.
        scene.updateMatrixWorld()
        frameCamera()
        camera.position.copy(cameraBase)
        camera.lookAt(0, lookY, 0)
        renderer.compileAsync(scene, camera)
            .catch(() => undefined)
            .finally(() => {
                compiled = true
                syncLoop()
            })

        return () => {
            disposed = true
            stop()
            canvas.removeEventListener('webglcontextlost', onContextLost)
            resizeObserver.disconnect()
            intersectionObserver.disconnect()
            document.removeEventListener('visibilitychange', onVisibility)
            container.removeEventListener('pointerdown', onPointerDown)
            container.removeEventListener('pointermove', onPointerMove)
            container.removeEventListener('pointerup', endDrag)
            container.removeEventListener('pointercancel', endDrag)
            container.removeEventListener('pointerleave', onPointerLeave)
            controllerRef.current = null
            rig.dispose()
            studio.dispose()
            floorDisposables.forEach((item) => item.dispose())
            renderer.dispose()
            canvas.remove()
        }
    }, [variant, showLabels])

    const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
        const controller = controllerRef.current

        if (!controller) return

        switch (event.key) {
            case 'ArrowLeft':
                controller.nudge(-2.4, 0)
                break
            case 'ArrowRight':
                controller.nudge(2.4, 0)
                break
            case 'ArrowUp':
                controller.nudge(0, -1.6)
                break
            case 'ArrowDown':
                controller.nudge(0, 1.6)
                break
            default:
                return
        }

        event.preventDefault()
    }

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            role='group'
            aria-roledescription='3D viewer'
            aria-label={label}
            onKeyDown={onKeyDown}
            className={cn(
                'relative touch-pan-y select-none outline-none [-webkit-tap-highlight-color:transparent]',
                'focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-inset',
                ready ? 'cursor-grab active:cursor-grabbing pointer-fine:cursor-none pointer-fine:active:cursor-none' : 'cursor-progress',
                className
            )}
        >
            <div
                ref={canvasHostRef}
                className={cn(
                    'absolute inset-0 transition-opacity duration-[1400ms] ease-out',
                    ready ? 'opacity-100' : 'opacity-0'
                )}
            />

            {!ready && <StagePlaceholder />}

            {showLabels && (
                <div aria-hidden className='pointer-events-none absolute inset-0 overflow-hidden'>
                    {HOTSPOTS.map((hotspot) => (
                        <div
                            key={hotspot.id}
                            ref={(element) => {
                                labelRefs.current[hotspot.id] = element
                            }}
                            data-side='right'
                            className='group/label absolute left-0 top-0 opacity-0 will-change-transform'
                        >
                            <span className='absolute -left-[5px] -top-[5px] block size-2.5 rounded-full border border-bronze bg-background shadow-[0_0_0_4px_rgb(255_255_255/0.35)]' />
                            <span className='absolute top-0 block h-px w-12 bg-foreground/25 group-data-[side=left]/label:right-2 group-data-[side=right]/label:left-2' />
                            <span className='absolute -top-[15px] block whitespace-nowrap group-data-[side=left]/label:right-16 group-data-[side=left]/label:text-right group-data-[side=right]/label:left-16'>
                                <span className='block font-mono text-[10px] uppercase tracking-[0.2em] text-foreground'>
                                    {hotspot.title}
                                </span>
                                <span className='mt-0.5 block text-xs text-muted-foreground'>
                                    {hotspot.detail}
                                </span>
                            </span>
                        </div>
                    ))}
                </div>
            )}

            <div
                ref={cursorRef}
                aria-hidden
                data-dragging='false'
                className='group/cursor pointer-events-none absolute left-0 top-0 hidden opacity-0 pointer-fine:block'
            >
                <div className='flex size-[84px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-foreground/15 bg-background/55 backdrop-blur-md transition-transform duration-300 ease-out group-data-[dragging=true]/cursor:scale-75'>
                    <span className='font-mono text-[10px] uppercase tracking-[0.22em] text-foreground group-data-[dragging=true]/cursor:hidden'>
                        Drag
                    </span>
                    <MoveHorizontal className='hidden size-5 text-foreground group-data-[dragging=true]/cursor:block' strokeWidth={1.5} />
                </div>
            </div>
        </div>
    )
}
