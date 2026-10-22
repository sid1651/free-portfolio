import type { DependencyList, RefObject } from 'react'

import { useRef } from 'react'

import { gsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect'

type ContextCallback = (context: gsap.Context) => void

/**
 * Runs a GSAP setup callback inside a scoped `gsap.context`, so every tween
 * and ScrollTrigger created inside is reverted automatically on unmount or
 * when the dependencies change. Scoping to a ref also lets selector strings
 * resolve relative to the component instead of the whole document.
 */
export const useGsapContext = <T extends HTMLElement>(
    callback: ContextCallback,
    dependencies: DependencyList = []
): RefObject<T | null> => {
    const scope = useRef<T | null>(null)

    useIsomorphicLayoutEffect(() => {
        if (!scope.current) return

        const context = gsap.context(callback, scope)

        return () => context.revert()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies)

    return scope
}
