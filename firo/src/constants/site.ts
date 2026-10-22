import type { NavItem, SiteConfig } from '@/types'

import { getOrigin } from '@/lib/window'

export const CDN_URL = 'https://novair-template.cdn.modulify.website'

export const siteConfig: SiteConfig = {
    name: 'NOVAIR Studio',
    shortName: 'NOVAIR',
    description: 'NOVAIR Studio is a premium AI visual production studio merging human art direction with generative imagery, video and motion for modern brands.',
    url: getOrigin(),
    ogImage: `${CDN_URL}/images/hero-veil-mono.png`,
    email: 'hello@novair.studio',
    phone: '(1300) 410 965',
    phoneHref: 'tel:+1300410965',
    hours: 'Available from Mon - Fri',
    founded: '2025',
    address: {
        street: 'Keizersgracht 241',
        city: '1016 EA Amsterdam',
        country: 'Netherlands'
    },
    socials: [
        { label: 'Instagram', href: 'https://www.instagram.com/' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
        { label: 'X', href: 'https://x.com/' },
        { label: 'YouTube', href: 'https://www.youtube.com/' },
        { label: 'Facebook', href: 'https://www.facebook.com/' }
    ]
}

export const navigation: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
    { label: 'Journal', href: '/blog' },
    { label: 'Contact', href: '/contact' }
]

export const categories = ['Product Visuals', 'Campaign Imagery', 'Social', 'AI Videos'] as const
