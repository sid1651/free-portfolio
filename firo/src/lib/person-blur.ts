import type { ImageSegmenter } from '@mediapipe/tasks-vision'

/**
 * Person detection for the hover effect.
 *
 * For a photo that contains people this returns a `cutout`: a sharp copy of the photo
 * where everything except the people is transparent (soft, feathered silhouette edge).
 * The hover effect only ever distorts this cutout, so the background stays untouched.
 */

export interface PersonLayer {
    width: number
    height: number
    cutout: HTMLCanvasElement
}

export interface PersonFrame {
    /** Visible box of the image on screen, css px (before transforms). */
    box: [number, number]
    /** Size the photo is drawn at inside that box (object-fit), css px. */
    drawn: [number, number]
    /** Where the drawn photo starts inside the box (object-position), css px. */
    offset: [number, number]
    /** Smoothed pointer position inside the box, 0..1 from the top left. */
    mouse: [number, number]
    /** Eased hover amount, 0..1. */
    hover: number
    /** Extra pull for small photos, so the blur reads as clearly on a card as on a hero. */
    boost: number
}

/** Shared look of the effect, matched to the reference: lens size and pull strength. */
export const PERSON_EFFECT = {
    size: 0.52,
    strength: 140,
    opacity: 0.8
}

const ENGINE = {
    wasmLoaderPath: '/mediapipe/vision_wasm_internal.js',
    wasmBinaryPath: '/mediapipe/vision_wasm_internal.wasm'
}

const MODEL_PATH = '/mediapipe/deeplab_v3.tflite'
const LAYER_MAX_SIDE = 1200
const SEGMENT_MAX_SIDE = 513
const PERSON_LABEL_FALLBACK = 15
const MIN_PERSON_SHARE = 0.02

let segmenterPromise: Promise<ImageSegmenter> | null = null
let queue: Promise<unknown> = Promise.resolve()
let consoleFiltered = false

// The detection engine prints routine status lines ("INFO: Created TensorFlow Lite XNNPACK delegate")
// through console.error. Drop only those, so they never show up as site errors.
const ENGINE_NOISE = /^(INFO: |[IW]\d{4} |W0000|I0000)/

const filterEngineNoise = (): void => {
    if (consoleFiltered) return
    consoleFiltered = true

    const wrap = (method: 'error' | 'warn' | 'info' | 'log'): void => {
        const original = console[method].bind(console)
        console[method] = (...args: unknown[]): void => {
            if (typeof args[0] === 'string' && ENGINE_NOISE.test(args[0])) return
            original(...args)
        }
    }

    wrap('error')
    wrap('warn')
    wrap('info')
    wrap('log')
}

const loadSegmenter = (): Promise<ImageSegmenter> => {
    if (!segmenterPromise) {
        filterEngineNoise()

        // The category mask is a per-pixel "which class won" answer, so a pixel only counts
        // as a person when person is the model's best guess for it.
        segmenterPromise = import('@mediapipe/tasks-vision').then(({ ImageSegmenter: Segmenter }) => Segmenter.createFromOptions(ENGINE, {
            baseOptions: { modelAssetPath: MODEL_PATH, delegate: 'CPU' },
            runningMode: 'IMAGE',
            outputCategoryMask: true,
            outputConfidenceMasks: false
        }))

        segmenterPromise.catch(() => {
            segmenterPromise = null
        })
    }

    return segmenterPromise
}

/** Start downloading the detector before the first hover lands. */
export const warmPersonDetector = (): void => {
    loadSegmenter().catch(() => undefined)
}

const createCanvas = (width: number, height: number): HTMLCanvasElement => {
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(width))
    canvas.height = Math.max(1, Math.round(height))
    return canvas
}

let filterSupport: boolean | null = null

const supportsCanvasFilter = (): boolean => {
    if (filterSupport === null) {
        const context = createCanvas(1, 1).getContext('2d')
        filterSupport = Boolean(context) && typeof context?.filter === 'string'
    }

    return filterSupport
}

const smoothstep = (edge0: number, edge1: number, value: number): number => {
    const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)))
    return t * t * (3 - 2 * t)
}

const detect = async (image: HTMLImageElement): Promise<PersonLayer | null> => {
    const naturalWidth = image.naturalWidth
    const naturalHeight = image.naturalHeight
    if (!naturalWidth || !naturalHeight) return null

    const longSide = Math.max(naturalWidth, naturalHeight)

    // Run the model on a small copy of the photo.
    const segmentScale = Math.min(1, SEGMENT_MAX_SIDE / longSide)
    const input = createCanvas(naturalWidth * segmentScale, naturalHeight * segmentScale)
    const inputContext = input.getContext('2d')
    if (!inputContext) return null
    inputContext.drawImage(image, 0, 0, input.width, input.height)

    const segmenter = await loadSegmenter()
    const labels = segmenter.getLabels().map(label => label.toLowerCase())
    const personIndex = labels.includes('person') ? labels.indexOf('person') : PERSON_LABEL_FALLBACK

    const result = segmenter.segment(input)
    const categories = result.categoryMask

    if (!categories) {
        result.close()
        return null
    }

    const classes = categories.getAsUint8Array()
    const maskWidth = categories.width
    const maskHeight = categories.height
    result.close()

    let personPixels = 0
    for (let index = 0; index < classes.length; index++) {
        if (classes[index] === personIndex) personPixels++
    }

    // No real person in the photo: leave it alone. Close-up portraits are welcome, the lens only
    // ever works around the pointer, never across the whole frame.
    if (personPixels / classes.length < MIN_PERSON_SHARE) return null

    const silhouette = createCanvas(maskWidth, maskHeight)
    const silhouetteContext = silhouette.getContext('2d')
    if (!silhouetteContext) return null

    const silhouettePixels = silhouetteContext.createImageData(maskWidth, maskHeight)
    for (let index = 0; index < classes.length; index++) {
        if (classes[index] === personIndex) silhouettePixels.data[index * 4 + 3] = 255
    }
    silhouetteContext.putImageData(silhouettePixels, 0, 0)

    const layerScale = Math.min(1, LAYER_MAX_SIDE / longSide)
    const width = Math.round(naturalWidth * layerScale)
    const height = Math.round(naturalHeight * layerScale)

    // Scale the silhouette up smoothly and give it a soft, natural edge.
    const mask = createCanvas(width, height)
    const maskContext = mask.getContext('2d')
    if (!maskContext) return null
    maskContext.imageSmoothingEnabled = true
    maskContext.imageSmoothingQuality = 'high'

    if (supportsCanvasFilter()) {
        maskContext.filter = `blur(${Math.max(1.5, Math.max(width, height) / 320)}px)`
    }

    maskContext.drawImage(silhouette, 0, 0, width, height)
    maskContext.filter = 'none'

    const edge = maskContext.getImageData(0, 0, width, height)
    for (let index = 3; index < edge.data.length; index += 4) {
        edge.data[index] = Math.round(smoothstep(0.25, 0.65, edge.data[index] / 255) * 255)
    }
    maskContext.putImageData(edge, 0, 0)

    // The person on their own: sharp pixels inside the silhouette, transparent elsewhere.
    const cutout = createCanvas(width, height)
    const cutoutContext = cutout.getContext('2d')
    if (!cutoutContext) return null
    cutoutContext.imageSmoothingQuality = 'high'
    cutoutContext.drawImage(image, 0, 0, width, height)
    cutoutContext.globalCompositeOperation = 'destination-in'
    cutoutContext.drawImage(mask, 0, 0)
    cutoutContext.globalCompositeOperation = 'source-over'

    return { width, height, cutout }
}

/** Runs one detection at a time so hovering quickly across a grid never stalls the page. */
export const detectPersonLayer = (image: HTMLImageElement): Promise<PersonLayer | null> => {
    const job = queue.then(() => detect(image)).catch(() => null)
    queue = job
    return job
}

/**
 * Fallback for browsers without WebGL 2: a soft blur of the person, faded in around the pointer.
 * The shader version in `@/lib/person-shader` is what nearly every visitor sees.
 */
export const renderPersonFallback = (context: CanvasRenderingContext2D, layer: PersonLayer, frame: PersonFrame): void => {
    const { width, height } = layer
    context.clearRect(0, 0, width, height)
    if (frame.hover <= 0.002 || !supportsCanvasFilter()) return

    const scale = frame.drawn[0] / width || 1
    const mouseX = (frame.mouse[0] * frame.box[0] - frame.offset[0]) / scale
    const mouseY = (frame.mouse[1] * frame.box[1] - frame.offset[1]) / scale
    const reach = (PERSON_EFFECT.size * 0.5 * Math.max(frame.box[0], frame.box[1]) * 1.6) / scale

    context.save()
    context.globalAlpha = frame.hover * PERSON_EFFECT.opacity
    context.filter = `blur(${(Math.max(width, height) / 90) * frame.hover * frame.boost}px)`
    context.drawImage(layer.cutout, 0, 0)
    context.filter = 'none'
    context.globalAlpha = 1

    const lens = context.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, Math.max(1, reach))
    lens.addColorStop(0, 'rgba(0, 0, 0, 1)')
    lens.addColorStop(0.55, 'rgba(0, 0, 0, 0.6)')
    lens.addColorStop(1, 'rgba(0, 0, 0, 0)')

    context.globalCompositeOperation = 'destination-in'
    context.fillStyle = lens
    context.fillRect(0, 0, width, height)
    context.restore()
}
