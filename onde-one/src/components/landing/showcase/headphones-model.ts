import type { FinishId } from '@/types'

import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { createKnitNormalMap, createKnurlNormalMap, createLeatherNormalMap, createRadialTexture } from '@/components/landing/showcase/textures'

interface Palette {
    shell: string
    face: string
    band: string
    steel: string
    chamfer: string
    cushion: string
    knit: string
    cloth: string
    led: string
}

interface ProfilePoint {
    u: number
    v: number
    nu: number
    nv: number
}

interface SweepFrame {
    point: THREE.Vector3
    normal: THREE.Vector3
    binormal: THREE.Vector3
}

interface SurfaceFrame {
    position: THREE.Vector3
    normal: THREE.Vector3
    tangent: THREE.Vector3
}

export interface HotspotAnchor {
    id: string
    object: THREE.Object3D
    normal: THREE.Vector3
}

export interface HeadphonesRig {
    root: THREE.Group
    crown: THREE.Object3D
    anchors: HotspotAnchor[]
    setFinish: (finish: FinishId, immediate?: boolean) => void
    updateFinish: (delta: number) => void
    setLedLevel: (level: number) => void
    dispose: () => void
}

interface HeadphonesOptions {
    anisotropy: number
    finish: FinishId
}

type Profile = Array<[number, number]>

export const FINISH_PALETTES: Record<FinishId, Palette> = {
    midnight: {
        shell: '#272d3b',
        face: '#3a4152',
        band: '#30364a',
        steel: '#cfd3da',
        chamfer: '#c29a5b',
        cushion: '#1f2430',
        knit: '#252b39',
        cloth: '#121621',
        led: '#ffb347'
    },
    pearl: {
        shell: '#d9d5cc',
        face: '#e6e2da',
        band: '#cdc8bd',
        steel: '#e4e3e0',
        chamfer: '#d9c08f',
        cushion: '#a49d90',
        knit: '#b1aa9d',
        cloth: '#5a554c',
        led: '#ffb347'
    },
    slate: {
        shell: '#5d6670',
        face: '#727b85',
        band: '#545d67',
        steel: '#dde0e4',
        chamfer: '#e2e5e8',
        cushion: '#3c434b',
        knit: '#464e57',
        cloth: '#20252b',
        led: '#7cc8ff'
    }
}

const BAND = { a: 0.82, b: 0.7, cy: 0.33, start: 0.057, halfThickness: 0.017, halfWidth: 0.145 }
const CUP = { x: 0.76, y: -0.37, sx: 0.44, sz: 0.34 }
const YOKE = { x: 0.82, by: 0.501, bz: 0.398, halfThickness: 0.012, halfWidth: 0.036 }

const X_AXIS = new THREE.Vector3(1, 0, 0)
const Y_AXIS = new THREE.Vector3(0, 1, 0)
const Z_AXIS = new THREE.Vector3(0, 0, 1)

const SHELL_PROFILE: Profile = [
    [0.955, -0.004],
    [1, 0],
    [1.022, 0.018],
    [1.034, 0.048],
    [1.037, 0.088],
    [1.033, 0.128],
    [1.02, 0.162],
    [0.998, 0.19],
    [0.97, 0.206],
    [0.938, 0.213]
]

const CHAMFER_PROFILE: Profile = [
    [0.938, 0.213],
    [0.906, 0.234]
]

const FACE_PROFILE: Profile = [
    [0.906, 0.234],
    [0.9, 0.2345],
    [0.7, 0.2385],
    [0.45, 0.2412],
    [0.2, 0.2424],
    [0, 0.2428]
]

const smoothstep = (edge0: number, edge1: number, value: number): number => {
    const t = Math.min(Math.max((value - edge0) / (edge1 - edge0), 0), 1)

    return t * t * (3 - 2 * t)
}

const toVectors = (profile: Profile): THREE.Vector2[] => profile.map(([radius, height]) => new THREE.Vector2(radius, height))

const cushionProfile = (): Profile => {
    const points: Profile = []
    const segments = 56
    const exponent = 2 / 3

    for (let index = 0; index <= segments; index++) {
        const theta = Math.PI / 2 + (index / segments) * Math.PI * 2
        const cos = Math.cos(theta)
        const sin = Math.sin(theta)

        points.push([
            0.8 + 0.205 * Math.sign(cos) * Math.pow(Math.abs(cos), exponent),
            -0.066 + 0.07 * Math.sign(sin) * Math.pow(Math.abs(sin), exponent)
        ])
    }

    return points
}

const superellipse = (a: number, b: number, exponent: number, segments: number, offset = 0): ProfilePoint[] => {
    const points: ProfilePoint[] = []
    const e = 2 / exponent

    for (let index = 0; index < segments; index++) {
        const theta = (index / segments) * Math.PI * 2
        const cos = Math.cos(theta)
        const sin = Math.sin(theta)
        const nu = (Math.sign(cos) * Math.pow(Math.abs(cos), 2 - e)) / a
        const nv = (Math.sign(sin) * Math.pow(Math.abs(sin), 2 - e)) / b
        const length = Math.hypot(nu, nv) || 1

        points.push({
            u: a * Math.sign(cos) * Math.pow(Math.abs(cos), e) + offset,
            v: b * Math.sign(sin) * Math.pow(Math.abs(sin), e),
            nu: nu / length,
            nv: nv / length
        })
    }

    return points
}

const orientWinding = (geometry: THREE.BufferGeometry): void => {
    const index = geometry.getIndex()
    const position = geometry.getAttribute('position')
    const normal = geometry.getAttribute('normal')

    if (!index) return

    const a = new THREE.Vector3()
    const b = new THREE.Vector3()
    const c = new THREE.Vector3()
    const n = new THREE.Vector3()
    let score = 0

    for (let i = 0; i < index.count; i += 3) {
        a.fromBufferAttribute(position, index.getX(i))
        b.fromBufferAttribute(position, index.getX(i + 1))
        c.fromBufferAttribute(position, index.getX(i + 2))
        b.sub(a)
        c.sub(a)
        b.cross(c)

        if (b.lengthSq() < 1e-14) continue

        n.fromBufferAttribute(normal, index.getX(i))
        score += Math.sign(b.dot(n))
    }

    if (score >= 0) return

    const array = index.array

    for (let i = 0; i < array.length; i += 3) {
        const swap = array[i + 1]

        array[i + 1] = array[i + 2]
        array[i + 2] = swap
    }

    index.needsUpdate = true
}

const buildSweep = (frames: SweepFrame[], profileAt: (t: number) => ProfilePoint[]): THREE.BufferGeometry => {
    const rings = frames.length
    const positions: number[] = []
    const normals: number[] = []
    const uvs: number[] = []
    const indices: number[] = []
    const vertex = new THREE.Vector3()
    const direction = new THREE.Vector3()
    let travelled = 0
    let count = 0

    for (let ring = 0; ring < rings; ring++) {
        const { point, normal, binormal } = frames[ring]
        const profile = profileAt(rings > 1 ? ring / (rings - 1) : 0)

        count = profile.length

        if (ring > 0) travelled += point.distanceTo(frames[ring - 1].point)

        for (let j = 0; j <= count; j++) {
            const sample = profile[j % count]

            vertex.copy(point).addScaledVector(normal, sample.u).addScaledVector(binormal, sample.v)
            direction.copy(normal).multiplyScalar(sample.nu).addScaledVector(binormal, sample.nv).normalize()
            positions.push(vertex.x, vertex.y, vertex.z)
            normals.push(direction.x, direction.y, direction.z)
            uvs.push(travelled, j / count)
        }
    }

    for (let ring = 0; ring < rings - 1; ring++) {
        for (let j = 0; j < count; j++) {
            const a = ring * (count + 1) + j
            const b = (ring + 1) * (count + 1) + j

            indices.push(a, b, a + 1, b, b + 1, a + 1)
        }
    }

    const geometry = new THREE.BufferGeometry()

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    geometry.setIndex(indices)
    orientWinding(geometry)

    return geometry
}

const sampleShell = (height: number): { radius: number; slope: number } => {
    for (let index = 1; index < SHELL_PROFILE.length; index++) {
        const [r0, y0] = SHELL_PROFILE[index - 1]
        const [r1, y1] = SHELL_PROFILE[index]

        if (y1 > y0 && height >= y0 && height <= y1) {
            const t = (height - y0) / (y1 - y0)

            return { radius: r0 + (r1 - r0) * t, slope: (r1 - r0) / (y1 - y0) }
        }
    }

    return { radius: 1, slope: 0 }
}

/**
 * A point on the outside of an earcup shell, in the cup's local space.
 * `up` and `front` describe the direction in world terms (up = +Y, front = +Z).
 */
const shellFrame = (side: 1 | -1, up: number, front: number, height: number, inset = 0): SurfaceFrame => {
    const length = Math.hypot(up, front) || 1
    const cos = (-side * up) / length
    const sin = front / length
    const { radius, slope } = sampleShell(height)
    const scale = Math.hypot(cos * CUP.sx, sin * CUP.sz)
    const r = radius - inset

    return {
        position: new THREE.Vector3(r * cos * CUP.sx, height, r * sin * CUP.sz),
        normal: new THREE.Vector3(cos / CUP.sx, 0, sin / CUP.sz).normalize().add(new THREE.Vector3(0, -slope * scale, 0)).normalize(),
        tangent: new THREE.Vector3(-sin * CUP.sx, 0, cos * CUP.sz).normalize()
    }
}

const basisFrom = (along: THREE.Vector3, normal: THREE.Vector3): THREE.Matrix4 => {
    const z = normal.clone().normalize()
    const x = new THREE.Vector3().crossVectors(along, z).normalize()
    const y = new THREE.Vector3().crossVectors(z, x).normalize()

    return new THREE.Matrix4().makeBasis(x, y, z)
}

export const createHeadphones = ({ anisotropy, finish }: HeadphonesOptions): HeadphonesRig => {
    const root = new THREE.Group()
    const geometries = new Set<THREE.BufferGeometry>()
    const textures: THREE.Texture[] = []
    const anchors: HotspotAnchor[] = []

    const knitBase = createKnitNormalMap()
    const leatherBase = createLeatherNormalMap()
    const knurlBase = createKnurlNormalMap()
    const glowTexture = createRadialTexture([
        [0, 'rgba(255, 255, 255, 1)'],
        [0.22, 'rgba(255, 255, 255, 0.5)'],
        [1, 'rgba(255, 255, 255, 0)']
    ], 128)

    textures.push(knitBase, leatherBase, knurlBase, glowTexture)

    const withRepeat = (texture: THREE.Texture, x: number, y: number): THREE.Texture => {
        const copy = texture.clone()

        copy.repeat.set(x, y)
        copy.anisotropy = anisotropy
        copy.needsUpdate = true
        textures.push(copy)

        return copy
    }

    const materials = {
        shell: new THREE.MeshPhysicalMaterial({ metalness: 0.78, roughness: 0.42, clearcoat: 0.22, clearcoatRoughness: 0.32 }),
        face: new THREE.MeshPhysicalMaterial({ metalness: 0.9, roughness: 0.27, anisotropy: 0.75, clearcoat: 0.2, clearcoatRoughness: 0.16 }),
        band: new THREE.MeshPhysicalMaterial({ metalness: 0.78, roughness: 0.36, clearcoat: 0.3, clearcoatRoughness: 0.24 }),
        steel: new THREE.MeshPhysicalMaterial({ metalness: 1, roughness: 0.2, anisotropy: 0.55 }),
        knurl: new THREE.MeshPhysicalMaterial({
            metalness: 1,
            roughness: 0.3,
            normalMap: withRepeat(knurlBase, 3.25, 0.62),
            normalScale: new THREE.Vector2(0.9, 0.9)
        }),
        chamfer: new THREE.MeshPhysicalMaterial({ metalness: 1, roughness: 0.12 }),
        cushion: new THREE.MeshPhysicalMaterial({
            metalness: 0,
            roughness: 0.58,
            sheen: 0.5,
            sheenRoughness: 0.4,
            sheenColor: new THREE.Color('#8b8b90'),
            clearcoat: 0.08,
            clearcoatRoughness: 0.6,
            normalMap: withRepeat(leatherBase, 14, 2.5),
            normalScale: new THREE.Vector2(0.28, 0.28)
        }),
        knit: new THREE.MeshPhysicalMaterial({
            metalness: 0,
            roughness: 0.9,
            sheen: 1,
            sheenRoughness: 0.55,
            sheenColor: new THREE.Color('#9a9aa0'),
            normalMap: withRepeat(knitBase, 4.6, 2.6),
            normalScale: new THREE.Vector2(0.85, 0.85)
        }),
        cloth: new THREE.MeshStandardMaterial({
            metalness: 0,
            roughness: 0.95,
            normalMap: withRepeat(knitBase, 9, 9),
            normalScale: new THREE.Vector2(0.6, 0.6)
        }),
        dark: new THREE.MeshPhysicalMaterial({ color: '#0d0d0f', metalness: 0.3, roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.2 }),
        led: new THREE.MeshBasicMaterial({ color: '#ff7a2e', toneMapped: false })
    }

    const glowMaterial = new THREE.SpriteMaterial({
        map: glowTexture,
        color: '#ff7a2e',
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        toneMapped: false
    })

    const colorTargets: Array<[keyof Palette, THREE.MeshStandardMaterial[]]> = [
        ['shell', [materials.shell]],
        ['face', [materials.face]],
        ['band', [materials.band]],
        ['steel', [materials.steel, materials.knurl]],
        ['chamfer', [materials.chamfer]],
        ['cushion', [materials.cushion]],
        ['knit', [materials.knit]],
        ['cloth', [materials.cloth]]
    ]

    const targets = new Map<keyof Palette, THREE.Color>()
    const ledColor = new THREE.Color()
    const ledTarget = new THREE.Color()
    let ledLevel = 1

    const setFinish = (id: FinishId, immediate = false): void => {
        const palette = FINISH_PALETTES[id]

        for (const [key, list] of colorTargets) {
            const target = new THREE.Color(palette[key])

            targets.set(key, target)

            if (immediate) list.forEach((material) => material.color.copy(target))
        }

        ledTarget.set(palette.led)

        if (immediate) ledColor.copy(ledTarget)
    }

    const updateFinish = (delta: number): void => {
        const blend = 1 - Math.exp(-delta * 4.5)

        for (const [key, list] of colorTargets) {
            const target = targets.get(key)

            if (target) list.forEach((material) => material.color.lerp(target, blend))
        }

        ledColor.lerp(ledTarget, blend)
        materials.led.color.copy(ledColor).multiplyScalar(0.6 + ledLevel * 1.6)
        glowMaterial.color.copy(ledColor)
        glowMaterial.opacity = Math.min(0.18 + ledLevel * 0.34, 0.95)
    }

    const setLedLevel = (level: number): void => {
        ledLevel = level
    }

    const addMesh = (geometry: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Object3D, shadows = true): THREE.Mesh => {
        const mesh = new THREE.Mesh(geometry, material)

        mesh.castShadow = shadows
        mesh.receiveShadow = shadows
        geometries.add(geometry)
        parent.add(mesh)

        return mesh
    }

    const addAnchor = (id: string, parent: THREE.Object3D, position: THREE.Vector3, normal: THREE.Vector3): void => {
        const object = new THREE.Object3D()

        object.position.copy(position)
        parent.add(object)
        anchors.push({ id, object, normal: normal.clone().normalize() })
    }

    // Headband: a sculpted aluminum band with a pillowy knit canopy beneath it.
    const bandFrames = (count: number, from: number, to: number): SweepFrame[] => {
        const frames: SweepFrame[] = []

        for (let index = 0; index < count; index++) {
            const t = from + (to - from) * (index / (count - 1))
            const phi = BAND.start + (Math.PI - BAND.start * 2) * t

            frames.push({
                point: new THREE.Vector3(BAND.a * Math.cos(phi), BAND.cy + BAND.b * Math.sin(phi), 0),
                normal: new THREE.Vector3(BAND.b * Math.cos(phi), BAND.a * Math.sin(phi), 0).normalize(),
                binormal: Z_AXIS
            })
        }

        return frames
    }

    addMesh(buildSweep(bandFrames(180, 0, 1), () => superellipse(BAND.halfThickness, BAND.halfWidth, 8, 40)), materials.band, root)

    addMesh(buildSweep(bandFrames(160, 0.07, 0.93), (t) => {
        const ends = smoothstep(0, 0.14, t) * smoothstep(0, 0.14, 1 - t)
        const thickness = 0.03 * (0.1 + 0.9 * ends)
        const width = 0.128 * (0.88 + 0.12 * ends)

        return superellipse(thickness, width, 2.6, 40, -(BAND.halfThickness + thickness * 0.92))
    }), materials.knit, root)

    const knitPhi = BAND.start + (Math.PI - BAND.start * 2) * 0.3
    const knitNormal = new THREE.Vector3(BAND.b * Math.cos(knitPhi), BAND.a * Math.sin(knitPhi), 0).normalize()
    const knitPoint = new THREE.Vector3(BAND.a * Math.cos(knitPhi), BAND.cy + BAND.b * Math.sin(knitPhi), 0)
        .addScaledVector(knitNormal, -(BAND.halfThickness + 0.03))
        .add(new THREE.Vector3(0, 0, 0.12))

    addAnchor('knit', root, knitPoint, Z_AXIS.clone().addScaledVector(knitNormal, -0.35))

    // Shared geometry for both sides.
    const shellGeometry = new THREE.LatheGeometry(toVectors(SHELL_PROFILE), 128)
    const chamferGeometry = new THREE.LatheGeometry(toVectors(CHAMFER_PROFILE), 128)
    const faceGeometry = new THREE.LatheGeometry(toVectors(FACE_PROFILE), 128)
    const cushionGeometry = new THREE.LatheGeometry(toVectors(cushionProfile()), 128)
    const clothGeometry = new THREE.CircleGeometry(0.64, 64)
    const holeGeometry = new THREE.CircleGeometry(0.0055, 16)
    const blockGeometry = new RoundedBoxGeometry(0.075, 0.15, 0.31, 4, 0.028)
    const collarGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.05, 40)
    const pinGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.07, 28)
    const capGeometry = new THREE.LatheGeometry(toVectors([[0.034, 0], [0.034, 0.007], [0.031, 0.012], [0, 0.0135]]), 40)
    const crownCollarGeometry = new THREE.CylinderGeometry(0.036, 0.036, 0.008, 48)
    const crownSideGeometry = new THREE.CylinderGeometry(0.033, 0.033, 0.04, 64, 1, true)
    const crownCapGeometry = new THREE.LatheGeometry(toVectors([[0.033, 0], [0.031, 0.004], [0.02, 0.0055], [0, 0.006]]), 48)
    const buttonGeometry = new THREE.CapsuleGeometry(0.011, 0.045, 6, 16)
    const portGeometry = new RoundedBoxGeometry(0.012, 0.034, 0.012, 2, 0.0055)
    const ledGeometry = new THREE.SphereGeometry(0.0055, 16, 12)

    let crown: THREE.Object3D = new THREE.Object3D()

    const createCup = (side: 1 | -1, parent: THREE.Object3D): void => {
        const cup = new THREE.Group()

        cup.position.set(side * CUP.x, CUP.y, 0)
        cup.rotation.z = -side * Math.PI / 2
        parent.add(cup)

        const layers: Array<[THREE.BufferGeometry, THREE.Material]> = [
            [shellGeometry, materials.shell],
            [chamferGeometry, materials.chamfer],
            [faceGeometry, materials.face],
            [cushionGeometry, materials.cushion]
        ]

        for (const [geometry, material] of layers) {
            addMesh(geometry, material, cup).scale.set(CUP.sx, 1, CUP.sz)
        }

        const cloth = addMesh(clothGeometry, materials.cloth, cup, false)

        cloth.rotation.x = Math.PI / 2
        cloth.position.y = -0.012
        cloth.scale.set(CUP.sx, CUP.sz, 1)

        const holes: Array<[number, number, number]> = [
            [0.35, 0.94, 0.2],
            [0.55, 0.83, 0.2],
            [-0.62, 0.78, 0.19]
        ]

        for (const [up, front, height] of holes) {
            const frame = shellFrame(side, up, front, height)
            const hole = addMesh(holeGeometry, materials.dark, cup, false)

            hole.position.copy(frame.position).addScaledVector(frame.normal, 0.0012)
            hole.quaternion.setFromUnitVectors(Z_AXIS, frame.normal)
        }

        if (side === -1) {
            addAnchor('cushion', cup, new THREE.Vector3(0, -0.136, 0.8 * CUP.sz), new THREE.Vector3(0, -1, 0))
            return
        }

        const chamferLength = Math.hypot(0.5, 0.87)
        const chamferCos = -0.5 / chamferLength
        const chamferSin = 0.87 / chamferLength
        const chamferRadial = new THREE.Vector3(chamferCos / CUP.sx, 0, chamferSin / CUP.sz).normalize()

        addAnchor(
            'chamfer',
            cup,
            new THREE.Vector3(0.922 * chamferCos * CUP.sx, 0.224, 0.922 * chamferSin * CUP.sz),
            chamferRadial.multiplyScalar(0.55).add(new THREE.Vector3(0, 0.83, 0))
        )

        // Digital crown on the upper rear shoulder, spins as the headphones turn.
        const crownFrame = shellFrame(side, 0.82, -0.57, 0.175)
        const crownMount = new THREE.Group()

        crownMount.position.copy(crownFrame.position).addScaledVector(crownFrame.normal, 0.004)
        crownMount.quaternion.setFromUnitVectors(Y_AXIS, crownFrame.normal)
        cup.add(crownMount)
        addMesh(crownCollarGeometry, materials.dark, crownMount).position.y = 0.002

        const spinner = new THREE.Group()

        crownMount.add(spinner)
        addMesh(crownSideGeometry, materials.knurl, spinner).position.y = 0.024
        addMesh(crownCapGeometry, materials.steel, spinner).position.y = 0.044
        crown = spinner
        addAnchor('crown', crownMount, new THREE.Vector3(0, 0.05, 0), Y_AXIS)

        // Noise control button, USB-C port and status light on the lower front rim.
        const buttonFrame = shellFrame(side, -0.28, 0.96, 0.125)
        const button = addMesh(buttonGeometry, materials.steel, cup)

        button.position.copy(buttonFrame.position).addScaledVector(buttonFrame.normal, 0.003)
        button.quaternion.setFromRotationMatrix(basisFrom(buttonFrame.tangent, buttonFrame.normal))
        button.scale.set(1, 1, 0.55)

        const portFrame = shellFrame(side, -0.62, 0.78, 0.1)
        const port = addMesh(portGeometry, materials.dark, cup, false)

        port.position.copy(portFrame.position).addScaledVector(portFrame.normal, -0.001)
        port.quaternion.setFromRotationMatrix(basisFrom(portFrame.tangent, portFrame.normal))

        const ledFrame = shellFrame(side, -0.12, 0.99, 0.165)

        addMesh(ledGeometry, materials.led, cup, false).position.copy(ledFrame.position).addScaledVector(ledFrame.normal, 0.0008)

        const glow = new THREE.Sprite(glowMaterial)

        glow.position.copy(ledFrame.position).addScaledVector(ledFrame.normal, 0.012)
        glow.scale.set(0.085, 0.085, 1)
        cup.add(glow)
    }

    for (const side of [1, -1] as const) {
        const group = new THREE.Group()

        root.add(group)
        addMesh(blockGeometry, materials.band, group).position.set(side * BAND.a, 0.335, 0)

        const sliderFrames: SweepFrame[] = [0.27, 0.13].map((y) => ({
            point: new THREE.Vector3(side * YOKE.x, y, 0),
            normal: X_AXIS,
            binormal: Z_AXIS
        }))

        addMesh(buildSweep(sliderFrames, () => superellipse(0.012, 0.034, 6, 28)), materials.steel, group)
        addMesh(collarGeometry, materials.steel, group).position.set(side * YOKE.x, 0.14, 0)

        const yokeFrames: SweepFrame[] = []

        for (let index = 0; index < 120; index++) {
            const theta = (index / 119) * Math.PI

            yokeFrames.push({
                point: new THREE.Vector3(side * YOKE.x, CUP.y + YOKE.by * Math.sin(theta), YOKE.bz * Math.cos(theta)),
                normal: new THREE.Vector3(0, YOKE.bz * Math.sin(theta), YOKE.by * Math.cos(theta)).normalize(),
                binormal: X_AXIS
            })
        }

        addMesh(buildSweep(yokeFrames, () => superellipse(YOKE.halfThickness, YOKE.halfWidth, 6, 28)), materials.steel, group)

        for (const end of [1, -1] as const) {
            const pin = addMesh(pinGeometry, materials.steel, group)

            pin.rotation.x = Math.PI / 2
            pin.position.set(side * YOKE.x, CUP.y, end * 0.378)

            const cap = addMesh(capGeometry, materials.steel, group)

            cap.rotation.x = end * Math.PI / 2
            cap.position.set(side * YOKE.x, CUP.y, end * (YOKE.bz + YOKE.halfThickness - 0.002))
        }

        if (side === 1) {
            addAnchor(
                'yoke',
                group,
                new THREE.Vector3(YOKE.x + YOKE.halfWidth, CUP.y + YOKE.by * Math.sin(Math.PI / 3), YOKE.bz * Math.cos(Math.PI / 3)),
                X_AXIS
            )
        } else {
            addAnchor('pivot', group, new THREE.Vector3(-YOKE.x, CUP.y, YOKE.bz + YOKE.halfThickness + 0.012), Z_AXIS)
        }

        createCup(side, group)
    }

    setFinish(finish, true)
    updateFinish(0)

    const dispose = (): void => {
        geometries.forEach((geometry) => geometry.dispose())
        Object.values(materials).forEach((material) => material.dispose())
        glowMaterial.dispose()
        textures.forEach((texture) => texture.dispose())
    }

    return {
        root,
        crown,
        anchors,
        setFinish,
        updateFinish,
        setLedLevel,
        dispose
    }
}
