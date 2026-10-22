import type { AnchorHTMLAttributes, FC, MouseEvent, ReactNode } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'
import { scrollToTop } from '@/lib/motion/lenis'
import { usePageTransition } from '@/components/generals/page-transition'

interface TransitionLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    href: string
    children: ReactNode
    prefetch?: boolean
}

const stripHash = (value: string): string => value.split('#')[0].split('?')[0] || '/'

/** Internal link that plays the page transition before changing route. */
export const TransitionLink: FC<TransitionLinkProps> = ({ href, onClick, children, prefetch, ...rest }): ReactNode => {
    const router = useRouter()
    const { navigate } = usePageTransition()

    const handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
        onClick?.(event)

        if (event.defaultPrevented) return
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        if (rest.target && rest.target !== '_self') return
        if (!href.startsWith('/') || href.startsWith('//')) return

        const targetPath = stripHash(href)
        const currentPath = stripHash(router.asPath)

        if (href.includes('#') && targetPath === currentPath) return

        event.preventDefault()

        if (targetPath === currentPath) {
            scrollToTop(false)
            return
        }

        navigate(href)
    }

    return (
        <Link href={href} onClick={handleClick} prefetch={prefetch} {...rest}>
            {children}
        </Link>
    )
}
