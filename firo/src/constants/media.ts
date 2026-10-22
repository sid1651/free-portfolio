import { CDN_URL } from '@/constants/site'

const image = (file: string): string => `${CDN_URL}/images/${file}`
const video = (file: string): string => `${CDN_URL}/videos/${file}`

export type MediaAsset = {
    src: string
    alt: string
}

export const media = {
    heroPortrait: { src: image('hero-portrait-red.png'), alt: 'Woman with a dark bob and red lips in a red turtleneck sweater' },
    heroVeil: { src: image('hero-veil-mono.png'), alt: 'Black and white portrait of a woman whose eyes look out through a sheer veil' },
    brandCoffee: { src: image('brand-coffee-cup.png'), alt: 'Hand holding a dewy coffee cup in front of a red storefront sign' },
    brandWhiteCoat: { src: image('brand-white-coat.png'), alt: 'Woman in a white double-breasted coat crossing a city street' },
    brandSunglasses: { src: image('brand-sunglasses.png'), alt: 'Clear sunglasses resting on a pink marble table in front of a red booth' },
    brandJuice: { src: image('brand-juice.png'), alt: 'Young man in a white cap sipping orange juice against a blue wall' },
    brandCurly: { src: image('brand-curly-red.png'), alt: 'Man with curly dark hair in a white tee against a red wall' },
    whyFaster: { src: image('why-faster-production.jpg'), alt: 'Model in a pale suit surrounded by camera operators' },
    whyArtDirection: { src: image('why-art-direction.jpg'), alt: 'Woman with a sharp bob and long earrings in teal light' },
    whyConsistency: { src: image('why-brand-consistency.jpg'), alt: 'Young man in a white cap drinking juice against a blue wall' },
    serviceCampaign: { src: image('service-campaign-imagery.jpg'), alt: 'Woman in a black coat in profile against a red background' },
    serviceProduct: { src: image('service-product-visuals.jpg'), alt: 'Hand holding a dewy coffee cup in front of a red storefront' },
    serviceSocial: { src: image('service-social-content.jpg'), alt: 'Hands holding a stacked burger against a black shirt' },
    serviceVideo: { src: image('service-ai-video.jpg'), alt: 'Tennis player in white mid swing with motion blur on a blue court' },
    avatarTracy: { src: image('avatar-tracy-manhattan.jpg'), alt: 'Portrait of Tracy Manhattan' },
    avatarJohn: { src: image('avatar-john-berlin.jpg'), alt: 'Portrait of John Berlin' },
    avatarAndrew: { src: image('avatar-andrew-amsterdam.jpg'), alt: 'Portrait of Andrew Amsterdam' },
    resultShirt: { src: image('result-white-shirt.jpg'), alt: 'Man in a white shirt and glasses standing against a red backdrop' },
    resultLamp: { src: image('result-red-lamp.jpg'), alt: 'Woman with a bob haircut beneath a red pendant lamp on a blue background' },
    teamTracy: { src: image('showcase-laughing-motion.jpg'), alt: 'Portrait of Tracy Newyork laughing with her hair in motion' },
    teamAlex: { src: image('team-alex-frankfurt.jpg'), alt: 'Portrait of Alex Frankfurt in a dark coat with red motion blur' },
    teamAndrew: { src: image('brand-curly-red.png'), alt: 'Portrait of Andrew Rotterdam against a red wall' },
    redLips: { src: image('team-tracy-newyork.jpg'), alt: 'Close portrait with red lips and a red turtleneck against a blue sky' },
    showcaseCheers: { src: image('showcase-cheers.png'), alt: 'Friends raising cans and a cocktail in late afternoon sun' },
    showcaseMotionOrange: { src: image('showcase-motion-orange.jpg'), alt: 'Young man in an orange knit caught in motion blur against a blue sky' },
    showcaseRedBar: { src: image('showcase-red-bar.jpg'), alt: 'Friends laughing together in a red-lit restaurant' },
    showcaseMotionRed: { src: image('showcase-motion-red.jpg'), alt: 'Young man in a dark coat glancing back through red light trails' },
    studioTeamRed: { src: image('studio-team-red.jpg'), alt: 'Creative team in red outfits around a table under pendant lamps' },
    studioCafeBlue: { src: image('studio-cafe-blue.jpg'), alt: 'Sunlit studio space with a blue wall and a person walking past' },
    studioCafeWhite: { src: image('studio-cafe-white.jpg'), alt: 'Bright studio kitchen with pendant lights and plants' },
    aboutPortrait: { src: image('about-portrait-glasses.png'), alt: 'Man with glasses and grey curls against blue and orange walls' },
    aboutFriendsSky: { src: image('about-friends-sky.png'), alt: 'Two friends laughing together under a clear blue sky' },
    aboutFriendsPhone: { src: image('about-friends-phone.png'), alt: 'Two friends smiling at a phone in front of a terracotta wall' },
    aboutTeamTable: { src: image('about-team-table.png'), alt: 'Team working at a table under white pendant lamps against a blue wall' },
    aboutStudioDesk: { src: image('about-studio-desk.png'), alt: 'Two colleagues reviewing work at a desk in warm light' },
    projectsHero: { src: image('projects-hero-neon.png'), alt: 'Woman standing at night beside a passing car under red and teal neon light' },
    contactHero: { src: image('contact-red-fur.png'), alt: 'Woman in a red fur jacket with her hands on her head against a blue sky' },
    showreel: video('showreel-night-drive.mp4'),
    showreelPoster: image('project-time-travel.jpg')
} satisfies Record<string, MediaAsset | string>

export const brandAvatars: MediaAsset[] = [
    media.brandCoffee,
    media.brandWhiteCoat,
    media.brandSunglasses,
    media.brandJuice,
    media.brandCurly
]

export const filmStrip: MediaAsset[] = [
    media.studioTeamRed,
    media.studioCafeBlue,
    media.teamTracy,
    media.studioCafeWhite,
    media.showcaseMotionOrange,
    media.showcaseRedBar,
    media.showcaseMotionRed
]
