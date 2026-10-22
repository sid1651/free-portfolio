import type Lenis from 'lenis'

let instance: Lenis | null = null

export const setLenis = (lenis: Lenis | null): void => {
    instance = lenis
}

export const getLenis = (): Lenis | null => instance

export const scrollToTop = (immediate = true): void => {
    if (instance) {
        instance.scrollTo(0, { immediate, force: true })
        return
    }

    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
}

export const stopScroll = (): void => {
    instance?.stop()
}

export const startScroll = (): void => {
    instance?.start()
}
