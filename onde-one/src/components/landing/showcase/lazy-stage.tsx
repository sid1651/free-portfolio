import dynamic from 'next/dynamic'
import { StagePlaceholder } from '@/components/landing/showcase/stage-placeholder'

// WebGL cannot render on the server, so the 3D stage (and three.js) loads in the browser only.
export const LazyHeadphonesStage = dynamic(
    () => import('@/components/landing/showcase/headphones-stage').then((module) => module.HeadphonesStage),
    {
        ssr: false,
        loading: () => <StagePlaceholder />
    }
)
