import type { Post, PostSummary, Project } from '@/types'

import { query } from '@/lib/db'

const PROJECT_COLUMNS = [
    'id',
    'slug',
    'title',
    'tagline',
    'client',
    'category',
    'industry',
    'services',
    'format',
    'project_date',
    'budget',
    'ai_tech',
    'cover',
    'cover_alt',
    'logo',
    'logo_alt',
    'video',
    'overview',
    'challenge',
    'process',
    'achievement',
    'result_metric',
    'result_label',
    'result_summary',
    'review_quote',
    'reviewer_name',
    'reviewer_role',
    'detail_image_1',
    'detail_image_1_alt',
    'detail_image_2',
    'detail_image_2_alt',
    'detail_image_3',
    'detail_image_3_alt',
    'featured',
    'sort_order'
].join(', ')

const POST_SUMMARY_COLUMNS = [
    'id',
    'slug',
    'title',
    'excerpt',
    'category',
    'cover',
    'cover_alt',
    'author',
    'published_at',
    'reading_time',
    'featured',
    'sort_order',
    'length(body) AS body_length'
].join(', ')

const normalizeProject = (row: Project): Project => ({
    ...row,
    featured: Number(row.featured) || 0,
    sort_order: Number(row.sort_order) || 0
})

const normalizePost = <T extends PostSummary>(row: T): T => ({
    ...row,
    featured: Number(row.featured) || 0,
    sort_order: Number(row.sort_order) || 0,
    body_length: row.body_length === null || row.body_length === undefined ? null : Number(row.body_length)
})

export const getProjects = async (): Promise<Project[]> => {
    const rows = await query<Project>(`SELECT ${PROJECT_COLUMNS} FROM projects ORDER BY sort_order ASC, created_at ASC`)
    return rows.map(normalizeProject)
}

export const getFeaturedProjects = async (limit = 4): Promise<Project[]> => {
    const rows = await query<Project>(
        `SELECT ${PROJECT_COLUMNS} FROM projects WHERE featured = 1 ORDER BY sort_order ASC, created_at ASC LIMIT ?`,
        [limit]
    )

    if (rows.length > 0) return rows.map(normalizeProject)

    const fallback = await query<Project>(`SELECT ${PROJECT_COLUMNS} FROM projects ORDER BY sort_order ASC, created_at ASC LIMIT ?`, [limit])
    return fallback.map(normalizeProject)
}

export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
    const rows = await query<Project>(`SELECT ${PROJECT_COLUMNS} FROM projects WHERE slug = ? LIMIT 1`, [slug])
    return rows[0] ? normalizeProject(rows[0]) : null
}

export const getProjectSlugs = async (): Promise<string[]> => {
    const rows = await query<{ slug: string }>('SELECT slug FROM projects ORDER BY sort_order ASC')
    return rows.map(row => row.slug)
}

export const getPosts = async (limit?: number): Promise<PostSummary[]> => {
    const rows = typeof limit === 'number'
        ? await query<PostSummary>(`SELECT ${POST_SUMMARY_COLUMNS} FROM posts ORDER BY featured DESC, sort_order ASC, published_at DESC LIMIT ?`, [limit])
        : await query<PostSummary>(`SELECT ${POST_SUMMARY_COLUMNS} FROM posts ORDER BY featured DESC, sort_order ASC, published_at DESC`)

    return rows.map(normalizePost)
}

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
    const rows = await query<Post>(`SELECT ${POST_SUMMARY_COLUMNS}, body FROM posts WHERE slug = ? LIMIT 1`, [slug])
    return rows[0] ? normalizePost(rows[0]) : null
}

export const getPostSlugs = async (): Promise<string[]> => {
    const rows = await query<{ slug: string }>('SELECT slug FROM posts ORDER BY sort_order ASC')
    return rows.map(row => row.slug)
}
