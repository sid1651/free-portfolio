import type { FC, ReactNode } from 'react'

import { createContext, useContext } from 'react'

const ReadyContext = createContext<boolean>(false)

export const useSiteReady = (): boolean => useContext(ReadyContext)

interface ReadyProviderProps {
    ready: boolean
    children: ReactNode
}

/**
 * Broadcasts "the entry curtain has lifted" to every load-triggered animation
 * on the page, so hero sequences start in step with the page transition
 * instead of racing it.
 */
export const ReadyProvider: FC<ReadyProviderProps> = ({
    ready,
    children
}): ReactNode => {
    return (
        <ReadyContext.Provider value={ready}>
            {children}
        </ReadyContext.Provider>
    )
}
