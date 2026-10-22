import * as THREE from 'three'

export interface StudioEnvironment {
    texture: THREE.Texture
    dispose: () => void
}

type Vec3 = [number, number, number]

/**
 * Builds a procedural photo-studio light environment (softboxes, strip lights, a warm sweep floor)
 * and prefilters it for image-based lighting. Nothing is fetched over the network.
 */
export const createStudioEnvironment = (renderer: THREE.WebGLRenderer): StudioEnvironment => {
    const scene = new THREE.Scene()
    const disposables: Array<THREE.BufferGeometry | THREE.Material> = []

    const roomGeometry = new THREE.SphereGeometry(30, 48, 24)
    const position = roomGeometry.getAttribute('position')
    const colors: number[] = []

    for (let index = 0; index < position.count; index++) {
        const height = position.getY(index) / 30
        const tone = height > 0
            ? THREE.MathUtils.lerp(0.32, 0.16, height)
            : THREE.MathUtils.lerp(0.32, 0.66, -height)

        colors.push(tone * 1.02, tone, tone * 0.96)
    }

    roomGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    const roomMaterial = new THREE.MeshBasicMaterial({ side: THREE.BackSide, vertexColors: true })

    scene.add(new THREE.Mesh(roomGeometry, roomMaterial))
    disposables.push(roomGeometry, roomMaterial)

    const addPanel = (width: number, height: number, at: Vec3, intensity: number, tint: Vec3 = [1, 1, 1]): void => {
        const geometry = new THREE.PlaneGeometry(width, height)
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(tint[0] * intensity, tint[1] * intensity, tint[2] * intensity),
            side: THREE.DoubleSide
        })
        const panel = new THREE.Mesh(geometry, material)

        panel.position.set(at[0], at[1], at[2])
        panel.lookAt(0, 0, 0)
        scene.add(panel)
        disposables.push(geometry, material)
    }

    addPanel(9, 7, [0, 12, 1.5], 5.2)
    addPanel(2.4, 14, [-11, 1.5, 3.5], 7.5, [1, 0.97, 0.92])
    addPanel(1.6, 12, [11, 0.5, -2], 4, [0.92, 0.96, 1])
    addPanel(14, 2.2, [0, 3.5, -12], 4.2)
    addPanel(8, 3, [2, -1, 12], 1.3)
    addPanel(4, 1.2, [7, -3.5, 7], 2.4, [1, 0.95, 0.9])

    const generator = new THREE.PMREMGenerator(renderer)
    const target = generator.fromScene(scene, 0.035)

    generator.dispose()
    disposables.forEach((item) => item.dispose())

    return {
        texture: target.texture,
        dispose: () => target.dispose()
    }
}
