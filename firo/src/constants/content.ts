import type { MediaAsset } from '@/constants/media'

import { media } from '@/constants/media'

export type Service = {
    index: string
    title: string
    filter: string
    description: string
    deliverables: string[]
    image: MediaAsset
}

export type Pillar = {
    title: string
    description: string
    image: MediaAsset
}

export type Review = {
    metric: string
    metricValue: number
    metricSuffix: string
    metricLabel: string
    result: string
    quote: string
    name: string
    avatar: MediaAsset
}

export type ProcessStep = {
    index: string
    phase: string
    title: string
    description: string
}

export type Stat = {
    value: number
    suffix: string
    label: string
}

export type Award = {
    title: string
    organisation: string
    year: string
    image: MediaAsset
}

export type TeamMember = {
    name: string
    role: string
    focus: string
    image: MediaAsset
}

export const heroContent = {
    eyebrow: 'Human × AI',
    lines: ['Generative', 'Creative', 'Studio'],
    kicker: 'Visual Stories',
    description: 'Creative studio merging human art direction with generative imagery, video, and motion.',
    badge: 'Brand Campaigns'
}

export const manifestoContent = {
    label: 'Why NOVAIR Studio',
    statement: [
        { text: 'Skip traditional' },
        { image: media.whyFaster },
        { text: 'photoshoots.' },
        { text: 'Premium product visuals' },
        { image: media.whyArtDirection },
        { text: 'delivered in days' },
        { image: media.whyConsistency },
        { text: 'for brands.' }
    ] as { text?: string, image?: MediaAsset }[],
    description: 'Creating scalable AI visuals that reduce production costs, accelerate campaigns.'
}

export const pillars: Pillar[] = [
    {
        title: 'Faster Production',
        description: 'Concepts move to finished frames in days, without location scouting, set builds or reshoots.',
        image: media.whyFaster
    },
    {
        title: 'Human Art Direction',
        description: 'Every frame is directed, curated and finished by people with an eye for your brand.',
        image: media.whyArtDirection
    },
    {
        title: 'Brand Asset Consistency',
        description: 'One visual language carried across every campaign, product page and channel.',
        image: media.whyConsistency
    }
]

export const servicesContent = {
    label: '02 Services',
    title: 'Generative Services',
    since: 'Since 2025',
    kicker: 'Visuals',
    description: 'AI-generated imagery, product visuals, video, and creative content.'
}

export const services: Service[] = [
    {
        index: '01',
        title: 'Campaign Imagery',
        filter: 'campaign-imagery',
        description: 'Art-directed key visuals for launches, seasons and always-on brand campaigns.',
        deliverables: ['Key visuals', 'Lookbooks', 'Out of home'],
        image: media.serviceCampaign
    },
    {
        index: '02',
        title: 'Product Visuals',
        filter: 'product-visuals',
        description: 'Studio-grade product imagery without the studio, built for ecommerce and retail.',
        deliverables: ['Packshots', 'Lifestyle scenes', 'Detail shots'],
        image: media.serviceProduct
    },
    {
        index: '03',
        title: 'Social Content',
        filter: 'social',
        description: 'Platform-native stills and edits sized for every feed, story and placement.',
        deliverables: ['Feed series', 'Stories', 'Paid social'],
        image: media.serviceSocial
    },
    {
        index: '04',
        title: 'AI Video',
        filter: 'ai-videos',
        description: 'Short-form motion and film, from first concept frames to the final cut.',
        deliverables: ['Short form', 'Product motion', 'Brand films'],
        image: media.serviceVideo
    }
]

export const selectedWorkContent = {
    label: '03 Projects',
    title: 'Featured Portfolio Collection',
    description: 'Selected AI visual projects created for modern brands and campaigns.',
    kicker: 'Case studies'
}

export const partnersContent = {
    label: 'Creative Partners',
    title: 'Trusted by modern brands.',
    statement: 'Creating premium AI visuals, campaigns, and social content through creative partnerships.',
    description: 'Partnering with ambitious brands to create distinctive visuals for campaigns and platforms.'
}

export const reviewsContent = {
    label: '04 Reviews',
    title: 'Real World',
    subtitle: 'From Clients',
    description: 'Trusted by brands for premium AI visuals and creative quality.',
    showreel: 'Show Reel'
}

export const reviews: Review[] = [
    {
        metric: '3X',
        metricValue: 3,
        metricSuffix: 'X',
        metricLabel: 'Faster',
        result: 'Delivered 100+ campaign assets in record time.',
        quote: 'Beautiful visuals delivered with remarkable speed.',
        name: 'Tracy Manhattan',
        avatar: media.avatarTracy
    },
    {
        metric: '45%',
        metricValue: 45,
        metricSuffix: '%',
        metricLabel: 'More Engagement',
        result: 'Increased 45% social engagement after launch.',
        quote: 'Premium visuals created with great attention.',
        name: 'John Berlin',
        avatar: media.avatarJohn
    },
    {
        metric: '60%',
        metricValue: 60,
        metricSuffix: '%',
        metricLabel: 'Faster Production',
        result: 'Reduced 60% creative production time overall.',
        quote: 'Stunning creatives delivered ahead of schedule.',
        name: 'Andrew Amsterdam',
        avatar: media.avatarAndrew
    }
]

export const processContent = {
    label: 'Creative Process',
    title: 'From brief to delivery.',
    subtitle: 'A streamlined creative process built for speed and quality.',
    description: 'We move from discovery to delivery through a focused AI creative process.'
}

export const processSteps: ProcessStep[] = [
    { index: '01', phase: 'Discovery', title: 'Vision', description: 'Share your brand and goals.' },
    { index: '02', phase: 'Direction', title: 'Strategy', description: 'Define the creative approach.' },
    { index: '03', phase: 'Creation', title: 'Production', description: 'AI-generated visual content.' },
    { index: '04', phase: 'Handoff', title: 'Delivery', description: 'Assets for every platform.' }
]

export const studioContent = {
    label: 'The Studio',
    title: 'NOVAIR Studio',
    since: 'Since 2025',
    statement: 'Boutique creative studio for AI-generated imagery, video, and visual storytelling.',
    description: 'Creating premium AI visuals for brands across fashion, beauty, lifestyle, and ecommerce.'
}

export const insightsContent = {
    label: 'Journal',
    title: 'AI Creative Insights',
    description: 'Notes from the studio on generative imagery, product storytelling and building brands with AI.'
}

export const ctaContent = {
    label: '05 Contact',
    eyebrow: 'Creative',
    title: 'Start your next project with our AI creative studio.',
    kicker: 'Anytime',
    action: 'Get in touch'
}

export const aboutContent = {
    eyebrow: 'Human × AI',
    kicker: 'Generative Creative Studio',
    description: 'Boutique creative studio for AI-generated imagery, video, and visual storytelling.',
    whyLabel: 'Why NOVAIR Studio',
    whyStatement: 'Skip traditional photoshoots. Premium product visuals delivered in days for brands.',
    whyDescription: 'Creating premium AI visuals for brands across fashion, beauty, lifestyle, and ecommerce.',
    storyLabel: 'Our Story',
    story: [
        "NOVAIR Studio was founded in 2025 on a simple belief: generative tools are only as good as the eye that directs them.",
        "Our art directors, image makers and editors work as one small team, shaping every campaign from the first moodboard to the final frame. We bring the speed of AI and the judgement of people to brands that want visuals no one else has."
    ],
    teamLabel: 'Creative Team',
    teamTitle: 'The people behind the frames.',
    awardsLabel: 'Awards',
    awardsTitle: 'AI, recognized.',
    awardsStatement: 'Generative creative work made for ambitious modern brands.',
    awardsDescription: 'Recognized for creative excellence, innovation, and standout visual work.'
}

export const stats: Stat[] = [
    { value: 300, suffix: '%', label: 'Faster Production' },
    { value: 45, suffix: '%', label: 'Higher Engagement' },
    { value: 200, suffix: '%', label: 'More Deliverables' },
    { value: 60, suffix: '%', label: 'Lower Expenditure' }
]

export const team: TeamMember[] = [
    {
        name: 'Tracy Newyork',
        role: 'Creative Director',
        focus: 'Sets the visual direction and keeps every frame on brand.',
        image: media.teamTracy
    },
    {
        name: 'Alex Frankfurt',
        role: 'AI Art Director',
        focus: 'Builds the image systems, lighting and casting behind each campaign.',
        image: media.teamAlex
    },
    {
        name: 'Andrew Rotterdam',
        role: 'Motion and Video Lead',
        focus: 'Turns stills into short-form motion and finished brand films.',
        image: media.teamAndrew
    }
]

export const awards: Award[] = [
    { title: 'Web Design Agency', organisation: 'Framer Awards', year: '2026', image: media.serviceCampaign },
    { title: 'Agency of the Year', organisation: '99 Awards', year: '2025', image: media.resultShirt },
    { title: 'Agency of the Month', organisation: 'Clutch Agencies', year: '2024', image: media.brandWhiteCoat },
    { title: 'Agency of the Year', organisation: 'Web Awards', year: '2023', image: media.resultLamp }
]

export const projectsPageContent = {
    eyebrow: 'Selected Work',
    title: 'Creative Portfolio',
    ideasLabel: 'Have Ideas',
    ideasText: "Tell us about your brand, campaign, or vision, and let's create something distinctive.",
    ideasAction: 'Say Hello',
    label: '03 Projects',
    collectionTitle: 'Featured Portfolio Collection',
    collectionDescription: 'Selected AI visual projects created for modern brands and campaigns.',
    kicker: 'Case studies'
}

export const journalPageContent = {
    eyebrow: 'Human × AI',
    title: 'AI Creative Insights',
    kicker: 'Recent Articles',
    description: 'Boutique creative studio for AI-generated imagery, video, and visual storytelling.'
}

export const contactPageContent = {
    eyebrow: 'Human × AI',
    lines: ['Imagine', 'Collaboratively'],
    ideasLabel: 'Have Ideas',
    ideasText: "Tell us about your brand, campaign, or vision, and let's create something distinctive.",
    ideasAction: 'Say Hello',
    whyLabel: 'Why NOVAIR Studio',
    whyStatement: 'Every great campaign starts with a conversation.',
    whySubtitle: 'Tell us about your brand and creative vision.',
    whyDescription: 'Creating premium AI visuals for brands across fashion, beauty, lifestyle, and ecommerce.',
    interests: ['Images', 'Videos', 'Product visuals', 'Short-form videos'],
    submit: 'Get in Touch',
    replyNote: 'Expect a reply in 48 hours',
    channels: [
        { label: 'Call', description: 'Set up an online call to discuss your vision' },
        { label: 'Email', description: 'Message us anytime for any inquiry or support' },
        { label: 'Office', description: 'Visit the studio in Amsterdam' }
    ]
}
