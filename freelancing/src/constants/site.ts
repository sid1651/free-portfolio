import type { SiteConfig } from '@/types'
import { getOrigin } from '@/lib/window'

export const siteConfig: SiteConfig = {
    name: 'Alchemy — Siddharth',
    description: 'Narava Venkat Siddharth is an independent full stack developer building distinctive websites and useful applications with React, TypeScript and Node.js.',
    placeholder: '',
    url: getOrigin(),
    ogImage: '/images/portfolio/hero-art.jpg'
}

export const studio = {
    brand: 'Alchemy',
    artist: 'Narava Venkat Siddharth',
    role: 'Full Stack Developer',
    initials: 'NVS',
    yearFrom: '2025',
    yearTo: '2026',
    handle: '@sid1651',
    instagram: 'https://github.com/sid1651',
    email: 'siddharthnarva@gmail.com',
    address: ['BASED IN', 'India', 'Available remotely', 'Open to freelance projects'],
    copyright: '© 2026 Narava Venkat Siddharth. Project imagery belongs to its respective owners.'
} as const
