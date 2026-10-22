import type { ReactNode } from 'react'

export type SiteConfig = {
    name: string
    description: string
    placeholder: string
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

export type CaptionedImage = {
    src: string
    alt: string
    caption: string
}

export type ProjectHighlight = {
    title: string
    body: string
}

export type Project = {
    slug: string
    index: string
    titleLines: [string, string]
    title: string
    subtitle: string
    clientName: string
    clientType: string
    date: string
    released: string
    timeframe: string
    category: string
    liveUrl: string
    description: string
    hero: string
    /** Only the motion project ships a looping clip instead of a still. */
    heroVideo?: string
    tags: readonly string[]
    summary: string
    introduction: string
    approach: readonly string[]
    approachImage: CaptionedImage
    approachNote: string
    challengeHeadline: string
    challengeBody: string
    challengeImages: readonly CaptionedImage[]
    solution: readonly string[]
    solutionImages: readonly CaptionedImage[]
    solutionClose: string
    achievements: string
    achievementsBody: string
    testimonial: {
        quote: string
        name: string
        company: string
        photo: string
    }
    highlights: readonly ProjectHighlight[]
}

export type Thought = {
    slug: string
    date: string
    dateLabel: string
    title: string
    excerpt: string
    author: string
    authorPhoto: string
    authorRole: string
    image: string
    readMinutes: string
    topic: string
    body: readonly { heading?: string; paragraphs: readonly string[] }[]
}
