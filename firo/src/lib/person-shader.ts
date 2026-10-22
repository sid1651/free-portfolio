import type { PersonFrame, PersonLayer } from '@/lib/person-blur'

import { PERSON_EFFECT } from '@/lib/person-blur'

/**
 * Chromatic lens blur for people, the same effect as the reference hero.
 *
 * Around the pointer (a soft gaussian "lens") the person cutout is smeared outwards
 * and split into a red, green and blue spectrum, which reads as a premium optical blur.
 * Only the cutout is sampled, so the background stays sharp. One shared WebGL 2 canvas
 * renders every frame and the result is copied into the hovered image's overlay canvas.
 */

const VERTEX = `#version 300 es
in vec2 a_position;
out vec2 v_uv;

void main() {
    v_uv = vec2(a_position.x * 0.5 + 0.5, 0.5 - a_position.y * 0.5);
    gl_Position = vec4(a_position, 0.0, 1.0);
}`

const FRAGMENT = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_media;
uniform vec2 u_box;
uniform vec2 u_drawn;
uniform vec2 u_offset;
uniform vec2 u_mouse;
uniform float u_hover;
uniform float u_size;
uniform float u_strength;
uniform float u_opacity;

vec3 spectrum(float p) {
    return 2.6 * vec3(
        smoothstep(0.54, 0.24, p),
        smoothstep(0.38, 0.0, abs(p - 0.5)),
        smoothstep(0.47, 0.82, p)
    );
}

vec4 sampleMedia(vec2 t) {
    vec4 s = texture(u_media, clamp(t, 0.0, 1.0));
    return vec4(s.rgb * s.a, s.a);
}

vec2 toAspect(vec2 uv, float aspect) {
    return (uv * 2.0 - 1.0) * vec2(aspect, 1.0) / max(aspect, 1.0);
}

void main() {
    vec2 t = v_uv;
    vec2 b = (t * u_drawn + u_offset) / u_box;
    float aspect = u_box.x / u_box.y;

    vec2 relM = toAspect(b, aspect) - toAspect(u_mouse, aspect);
    float sigma = max(u_size * 0.5, 0.02);
    float fall = exp(-dot(relM, relM) / (2.0 * sigma * sigma));

    float weight = u_hover * smoothstep(0.02, 0.35, fall) * u_opacity;
    if (weight < 0.002) {
        fragColor = vec4(0.0);
        return;
    }

    vec2 dispBox = relM * fall * u_hover * u_strength / 1600.0;
    vec2 disp = dispBox * u_box / u_drawn;

    vec3 color = vec3(0.0);
    vec3 total = vec3(0.0);
    float alpha = 0.0;
    float taps = 0.0;

    for (int j = 0; j < 34; j++) {
        float i = float(j) * 0.03;
        if (i >= 1.0) break;
        vec4 s = sampleMedia(t + disp * i);
        vec3 w = spectrum(i);
        color += s.rgb * w;
        total += w;
        alpha += s.a;
        taps += 1.0;
    }

    color /= max(total, vec3(1e-4));
    alpha = min(alpha / max(taps, 1.0), 1.0);

    fragColor = vec4(clamp(color, 0.0, 1.0) * weight, alpha * weight);
}`

const MAX_TEXTURES = 6

type Uniform =
    | 'u_media'
    | 'u_box'
    | 'u_drawn'
    | 'u_offset'
    | 'u_mouse'
    | 'u_hover'
    | 'u_size'
    | 'u_strength'
    | 'u_opacity'

interface Renderer {
    canvas: HTMLCanvasElement
    gl: WebGL2RenderingContext
    program: WebGLProgram
    vao: WebGLVertexArrayObject
    uniforms: Record<Uniform, WebGLUniformLocation | null>
    textures: Map<PersonLayer, WebGLTexture>
}

let renderer: Renderer | null = null
let unsupported = false

const compile = (gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type)
    if (!shader) return null

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        return null
    }

    return shader
}

const createRenderer = (): Renderer | null => {
    if (unsupported) return null

    const canvas = document.createElement('canvas')
    canvas.width = 2
    canvas.height = 2

    const gl = canvas.getContext('webgl2', {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: true
    })

    if (!gl) {
        unsupported = true
        return null
    }

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX)
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
    const program = gl.createProgram()

    if (!vertex || !fragment || !program) {
        unsupported = true
        return null
    }

    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        unsupported = true
        return null
    }

    // One triangle that covers the whole viewport.
    const vao = gl.createVertexArray()
    const buffer = gl.createBuffer()
    if (!vao || !buffer) {
        unsupported = true
        return null
    }

    gl.bindVertexArray(vao)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)

    const position = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    gl.bindVertexArray(null)

    const names: Uniform[] = ['u_media', 'u_box', 'u_drawn', 'u_offset', 'u_mouse', 'u_hover', 'u_size', 'u_strength', 'u_opacity']
    const uniforms = Object.fromEntries(names.map(name => [name, gl.getUniformLocation(program, name)])) as Record<Uniform, WebGLUniformLocation | null>

    canvas.addEventListener('webglcontextlost', event => {
        event.preventDefault()
        renderer = null
    })

    return {
        canvas,
        gl,
        program,
        vao,
        uniforms,
        textures: new Map()
    }
}

const textureFor = (current: Renderer, layer: PersonLayer): WebGLTexture | null => {
    const { gl, textures } = current
    const cached = textures.get(layer)

    if (cached) {
        textures.delete(layer)
        textures.set(layer, cached)
        return cached
    }

    const texture = gl.createTexture()
    if (!texture) return null

    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, layer.cutout)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    textures.set(layer, texture)

    while (textures.size > MAX_TEXTURES) {
        const oldest = textures.keys().next().value
        if (!oldest) break
        const stale = textures.get(oldest)
        if (stale) gl.deleteTexture(stale)
        textures.delete(oldest)
    }

    return texture
}

/** True when this browser can draw the shader version of the effect. */
export const canRenderPersonShader = (): boolean => {
    if (!renderer) renderer = createRenderer()
    return Boolean(renderer)
}

/**
 * Draws one frame of the lens blur into `target` (a 2d canvas sized layer.width x layer.height).
 * Returns false when WebGL 2 is not available, so the caller can use the fallback.
 */
export const renderPersonShader = (target: CanvasRenderingContext2D, layer: PersonLayer, frame: PersonFrame): boolean => {
    if (!renderer) renderer = createRenderer()
    const current = renderer
    if (!current) return false

    const { gl, canvas, uniforms } = current

    if (gl.isContextLost()) {
        renderer = null
        return false
    }

    // The shared canvas only ever grows, so switching between images never reallocates it.
    if (canvas.width < layer.width) canvas.width = layer.width
    if (canvas.height < layer.height) canvas.height = layer.height

    const texture = textureFor(current, layer)
    if (!texture) return false

    gl.viewport(0, 0, layer.width, layer.height)
    gl.disable(gl.BLEND)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(current.program)
    gl.bindVertexArray(current.vao)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)

    gl.uniform1i(uniforms.u_media, 0)
    gl.uniform2f(uniforms.u_box, Math.max(1, frame.box[0]), Math.max(1, frame.box[1]))
    gl.uniform2f(uniforms.u_drawn, Math.max(1, frame.drawn[0]), Math.max(1, frame.drawn[1]))
    gl.uniform2f(uniforms.u_offset, frame.offset[0], frame.offset[1])
    gl.uniform2f(uniforms.u_mouse, frame.mouse[0], frame.mouse[1])
    gl.uniform1f(uniforms.u_hover, frame.hover)
    gl.uniform1f(uniforms.u_size, PERSON_EFFECT.size)
    gl.uniform1f(uniforms.u_strength, PERSON_EFFECT.strength * frame.boost)
    gl.uniform1f(uniforms.u_opacity, PERSON_EFFECT.opacity)

    gl.drawArrays(gl.TRIANGLES, 0, 3)
    gl.bindVertexArray(null)

    // WebGL draws from the bottom left, so the frame sits at the bottom of the shared canvas.
    target.clearRect(0, 0, layer.width, layer.height)
    target.drawImage(canvas, 0, canvas.height - layer.height, layer.width, layer.height, 0, 0, layer.width, layer.height)

    return true
}
