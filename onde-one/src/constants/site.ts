import type { Finish, NavLink, SiteConfig } from '@/types'

import { getOrigin } from '@/lib/window'

export const siteConfig: SiteConfig = {
    name: 'Arden Halo',
    description: 'Arden Halo wireless headphones. Sculpted aluminum, intelligent noise cancelling, sixty hours of battery and immersive spatial sound. Quiet, refined.',
    url: getOrigin(),
    ogImage: '/images/product-studio.jpg'
}

export const NAV_LINKS: NavLink[] = [
    { id: 'design', label: 'Design', href: '#design' },
    { id: 'sound', label: 'Sound', href: '#sound' },
    { id: 'noise-control', label: 'Noise control', href: '#noise-control' },
    { id: 'features', label: 'Features', href: '#battery' },
    { id: 'specs', label: 'Specs', href: '#specs' }
]

export const FINISHES: Finish[] = [
    { id: 'midnight', name: 'Midnight', swatch: '#272d3c', accent: '#c29a5b' },
    { id: 'pearl', name: 'Pearl', swatch: '#e2ded6', accent: '#d6bf8f' },
    { id: 'slate', name: 'Slate', swatch: '#5d6670', accent: '#d8dce1' }
]

export const PRICE = '$549'
