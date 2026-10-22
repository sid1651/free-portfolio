import type { CSSProperties, FC, ReactNode } from 'react'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface MediaProps {
    src: string
    alt: string
    sizes: string
    className?: string
    imageClassName?: string
    preload?: boolean
    reveal?: boolean
    parallax?: number
    position?: string
    children?: ReactNode
}

/**
 * Image frame used across the site. `reveal` wipes the frame open when it scrolls into view,
 * `parallax` lets the picture drift inside the frame (value in percent).
 */
export const Media: FC<MediaProps> = ({
    src,
    alt,
    sizes,
    className,
    imageClassName,
    preload = false,
    reveal = false,
    parallax,
    position,
    children
}): ReactNode => {
    const overhang = parallax ? Math.ceil(parallax * 1.35) : 0
    const innerStyle: CSSProperties = overhang ? { top: `-${overhang}%`, bottom: `-${overhang}%` } : { top: 0, bottom: 0 }

    return (
        <div
            className={cn('relative overflow-hidden bg-ink-raised', className)}
            data-reveal={reveal ? 'image' : undefined}
            data-parallax={parallax ? String(parallax) : undefined}
        >
            <div
                className='absolute inset-x-0'
                style={innerStyle}
                data-parallax-inner={parallax ? '' : undefined}
                data-reveal-inner={reveal ? '' : undefined}
            >
                {src && (
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        sizes={sizes}
                        preload={preload}
                        className={cn('object-cover', imageClassName)}
                        style={position ? { objectPosition: position } : undefined}
                    />
                )}
            </div>

            {children}
        </div>
    )
}
