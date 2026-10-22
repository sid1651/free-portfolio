import type { FC, ReactNode } from 'react'
import type { PostSummary } from '@/types'

import { cms } from '@/lib/cms'
import { estimateReadingMinutes, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

interface PostMetaProps {
    post: Pick<PostSummary, 'id' | 'category' | 'published_at' | 'reading_time' | 'body_length'>
    className?: string
    showCategory?: boolean
}

/** Category, date and reading time line used on every journal card. */
export const PostMeta: FC<PostMetaProps> = ({ post, className, showCategory = true }): ReactNode => {
    return (
        <p className={cn('eyebrow flex flex-wrap items-center gap-x-3 gap-y-1', className)}>
            {showCategory && post.category && (
                <>
                    <span className='text-flare' data-mdlfy-cms={cms('posts', post.id, 'category')}>{post.category}</span>
                    <span aria-hidden='true'>/</span>
                </>
            )}

            {post.published_at && (
                <time dateTime={post.published_at}>
                    {formatDate(post.published_at)}
                </time>
            )}

            <span aria-hidden='true'>/</span>

            <span>
                {post.reading_time
                    ? <span data-mdlfy-cms={cms('posts', post.id, 'reading_time')}>{post.reading_time}</span>
                    : <span>{estimateReadingMinutes(post.body_length)}</span>}
                {' '}min read
            </span>
        </p>
    )
}
