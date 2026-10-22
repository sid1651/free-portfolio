export interface NavLink {
    label: string
    href: string
}

export const primaryNav: readonly NavLink[] = [
    { label: 'Work', href: '/work' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
]

export const overlayNav: readonly NavLink[] = [
    { label: 'Home', href: '/' },
    { label: 'Work', href: '/work' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
]

export const secondaryNav: readonly NavLink[] = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms Of Use', href: '/terms-of-use' }
]

export const footerNav: readonly NavLink[] = [
    { label: 'Home', href: '/' },
    { label: 'Work', href: '/work' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms Of Use', href: '/terms-of-use' }
]

export const socialLinks: readonly NavLink[] = [
    { label: 'GitHub', href: 'https://github.com/sid1651' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/narva-siddharth' },
    { label: 'Email', href: 'mailto:siddharthnarva@gmail.com' }
]
