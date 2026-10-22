import * as THREE from 'three'

type HeightField = (x: number, y: number) => number

type GradientStop = [number, string]

const hash = (x: number, y: number, seed: number): number => {
    const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123

    return value - Math.floor(value)
}

const periodicNoise = (x: number, y: number, period: number, seed: number): number => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const xf = x - xi
    const yf = y - yi
    const x0 = ((xi % period) + period) % period
    const y0 = ((yi % period) + period) % period
    const x1 = (x0 + 1) % period
    const y1 = (y0 + 1) % period
    const u = xf * xf * (3 - 2 * xf)
    const v = yf * yf * (3 - 2 * yf)
    const top = hash(x0, y0, seed) * (1 - u) + hash(x1, y0, seed) * u
    const bottom = hash(x0, y1, seed) * (1 - u) + hash(x1, y1, seed) * u

    return top * (1 - v) + bottom * v
}

const smoothstep = (edge0: number, edge1: number, value: number): number => {
    const t = Math.min(Math.max((value - edge0) / (edge1 - edge0), 0), 1)

    return t * t * (3 - 2 * t)
}

const wrap = (value: number, cell: number): number => (((value % cell) + cell) % cell) / cell

const createNormalTexture = (size: number, heightAt: HeightField, strength: number): THREE.DataTexture => {
    const heights = new Float32Array(size * size)

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            heights[y * size + x] = heightAt(x, y)
        }
    }

    const sample = (x: number, y: number): number => heights[((y + size) % size) * size + ((x + size) % size)]
    const data = new Uint8Array(size * size * 4)

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const dx = (sample(x - 1, y) - sample(x + 1, y)) * strength
            const dy = (sample(x, y - 1) - sample(x, y + 1)) * strength
            const length = Math.hypot(dx, dy, 1)
            const index = (y * size + x) * 4

            data[index] = Math.round(((dx / length) * 0.5 + 0.5) * 255)
            data[index + 1] = Math.round(((dy / length) * 0.5 + 0.5) * 255)
            data[index + 2] = Math.round(((1 / length) * 0.5 + 0.5) * 255)
            data[index + 3] = 255
        }
    }

    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)

    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.generateMipmaps = true
    texture.needsUpdate = true

    return texture
}

export const createKnitNormalMap = (): THREE.DataTexture => {
    const size = 256
    const cell = 16

    return createNormalTexture(size, (x, y) => {
        const a = wrap(x + y, cell)
        const b = wrap(x - y, cell)
        const threadA = 1 - smoothstep(0.06, 0.26, Math.min(a, 1 - a))
        const threadB = 1 - smoothstep(0.06, 0.26, Math.min(b, 1 - b))
        const fuzz = periodicNoise(x / 4, y / 4, size / 4, 7) * 0.12

        return Math.max(threadA, threadB) * 0.85 + threadA * threadB * 0.15 + fuzz
    }, 2.4)
}

export const createLeatherNormalMap = (): THREE.DataTexture => {
    const size = 256

    return createNormalTexture(size, (x, y) => {
        const grain = periodicNoise(x / 8, y / 8, size / 8, 3)
        const pebble = Math.pow(1 - Math.abs(grain * 2 - 1), 2.5)
        const fine = periodicNoise(x / 4, y / 4, size / 4, 11)

        return pebble * 0.75 + fine * 0.25
    }, 3)
}

export const createKnurlNormalMap = (): THREE.DataTexture => {
    const size = 128
    const cell = 8

    return createNormalTexture(size, (x, y) => {
        const a = wrap(x + y, cell)
        const b = wrap(x - y, cell)

        return Math.min(1 - Math.abs(a * 2 - 1), 1 - Math.abs(b * 2 - 1))
    }, 4)
}

export const createRadialTexture = (stops: GradientStop[], size = 256): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas')

    canvas.width = size
    canvas.height = size

    const context = canvas.getContext('2d')

    if (context) {
        const half = size / 2
        const gradient = context.createRadialGradient(half, half, 0, half, half, half)

        for (const [offset, color] of stops) gradient.addColorStop(offset, color)

        context.fillStyle = gradient
        context.fillRect(0, 0, size, size)
    }

    const texture = new THREE.CanvasTexture(canvas)

    texture.colorSpace = THREE.SRGBColorSpace

    return texture
}

export const createDialTexture = (): THREE.CanvasTexture => {
    const size = 1024
    const canvas = document.createElement('canvas')

    canvas.width = size
    canvas.height = size

    const context = canvas.getContext('2d')

    if (context) {
        const half = size / 2

        context.translate(half, half)
        context.strokeStyle = 'rgb(24, 22, 20)'
        context.lineCap = 'round'

        context.lineWidth = 2
        context.globalAlpha = 0.9
        context.beginPath()
        context.arc(0, 0, half * 0.965, 0, Math.PI * 2)
        context.stroke()

        for (let index = 0; index < 180; index++) {
            const angle = (index / 180) * Math.PI * 2
            const major = index % 15 === 0
            const minor = index % 5 === 0
            const inner = half * (major ? 0.855 : minor ? 0.895 : 0.925)
            const outer = half * 0.948

            context.lineWidth = major ? 3.2 : minor ? 2 : 1.2
            context.globalAlpha = major ? 1 : minor ? 0.7 : 0.42
            context.beginPath()
            context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner)
            context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer)
            context.stroke()
        }

        context.globalAlpha = 0.32
        context.lineWidth = 1.5
        context.beginPath()
        context.arc(0, 0, half * 0.62, 0, Math.PI * 2)
        context.stroke()

        context.globalAlpha = 1
    }

    const texture = new THREE.CanvasTexture(canvas)

    texture.colorSpace = THREE.SRGBColorSpace

    return texture
}
