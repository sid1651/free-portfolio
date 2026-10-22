import type { ReactNode } from 'react'

export type SiteConfig = {
    name: string
    description: string
    url: string
    ogImage?: string
    links?: {
        twitter?: string
        github?: string
    }
}

export type LayoutProps = {
    children: ReactNode
}

export type SeoProps = {
    title?: string
    description?: string
    ogImage?: string
}

export type FinishId = 'midnight' | 'pearl' | 'slate'

export type Finish = {
    id: FinishId
    name: string
    swatch: string
    accent: string
}

export type NavLink = {
    id: string
    label: string
    href: string
}
