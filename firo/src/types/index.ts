import type { ReactNode } from 'react'

export type SocialLink = {
    label: string
    href: string
}

export type NavItem = {
    label: string
    href: string
}

export type SiteConfig = {
    name: string
    shortName: string
    description: string
    url: string
    ogImage?: string
    email: string
    phone: string
    phoneHref: string
    hours: string
    founded: string
    address: {
        street: string
        city: string
        country: string
    }
    socials: SocialLink[]
}

export type LayoutProps = {
    children: ReactNode
    showCta?: boolean
}

export type SeoProps = {
    title?: string
    description?: string
    ogImage?: string
    type?: 'website' | 'article'
}

/** One row of the projects collection, keyed by its real column names. */
export type Project = {
    id: string
    slug: string
    title: string
    tagline: string | null
    client: string | null
    category: string | null
    industry: string | null
    services: string | null
    format: string | null
    project_date: string | null
    budget: string | null
    ai_tech: string | null
    cover: string | null
    cover_alt: string | null
    logo: string | null
    logo_alt: string | null
    video: string | null
    overview: string | null
    challenge: string | null
    process: string | null
    achievement: string | null
    result_metric: string | null
    result_label: string | null
    result_summary: string | null
    review_quote: string | null
    reviewer_name: string | null
    reviewer_role: string | null
    detail_image_1: string | null
    detail_image_1_alt: string | null
    detail_image_2: string | null
    detail_image_2_alt: string | null
    detail_image_3: string | null
    detail_image_3_alt: string | null
    featured: number
    sort_order: number
}

/** A post as listed on the journal pages (no body). */
export type PostSummary = {
    id: string
    slug: string
    title: string
    excerpt: string | null
    category: string | null
    cover: string | null
    cover_alt: string | null
    author: string | null
    published_at: string | null
    reading_time: string | null
    featured: number
    sort_order: number
    body_length: number | null
}

export type Post = PostSummary & {
    body: string | null
}
