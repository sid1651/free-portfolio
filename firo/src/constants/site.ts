import type { NavItem, SiteConfig } from '@/types'

import { getOrigin } from '@/lib/window'

export const CDN_URL = ''

export const siteConfig: SiteConfig = {
    name: 'Godrej Properties',
    shortName: 'Godrej',
    description: 'A considered vision for contemporary residential living.',
    url: getOrigin(),
    ogImage: '/images/estate/residences-hero.jpg',
    email: '',
    phone: '',
    phoneHref: '',
    hours: '',
    founded: '',
    address: {
        street: '',
        city: '',
        country: ''
    },
    socials: []
}

export const navigation: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Contact', href: '/contact' }
]

export const categories = ['Product Visuals', 'Campaign Imagery', 'Social', 'AI Videos'] as const
