import type { Project } from '@/types'

const portfolio = (name: string): string => `/images/portfolio/${name}`
const hitha = (name: string): string => `/images/hitha/${name}`

export const projects: readonly Project[] = [
    {
        slug: 'hitha', index: '001', titleLines: ['Hitha', 'Portfolio'], title: 'Hitha',
        subtitle: 'An editorial portfolio for Akhivaashna Hitha.',
        clientName: 'Akhivaashna Hitha', clientType: 'Fashion & editorial model',
        date: '2026', released: 'Oct 2026', timeframe: 'Live portfolio', category: 'Portfolio',
        liveUrl: 'https://selora-psi.vercel.app/',
        description: 'A digital stage for runway, couture, editorial and studio work.',
        hero: hitha('hero-portrait.jpg'), tags: ['Portfolio', 'Editorial', 'Motion'],
        summary: 'An image-led portfolio that gives Hitha’s work the space and presence it deserves.',
        introduction: 'Hitha works across runway, couture, beauty and editorial shoots. The website needed to hold that range without turning the work into a crowded grid. The result is a considered sequence of images, stories and direct contact paths.',
        approach: [
            'The opening frame introduces Hitha through one portrait and a short statement, letting the photography set the tone.',
            'Individual series have their own pages so collaborators can explore context and images at a natural pace.',
            'The navigation and contact path stay simple even while the visual experience is expressive.'
        ],
        approachImage: { src: hitha('intro-lamp.jpg'), alt: 'Hitha in a couture editorial portrait', caption: 'A portfolio led by the work' },
        approachNote: 'Photography, type and motion held in balance.',
        challengeHeadline: 'A wide range of work needs one clear voice.',
        challengeBody: 'Runway, beauty and studio portraits each have a different energy. The portfolio brings them together through consistent typography, pacing and navigation while keeping the individuality of each series.',
        challengeImages: [
            { src: hitha('gallery-vogue.jpg'), alt: 'Hitha fashion editorial portrait', caption: 'Editorial' },
            { src: hitha('gallery-lehenga.jpg'), alt: 'Hitha in bridal couture', caption: 'Couture' },
            { src: hitha('runway-lfw-front.jpg'), alt: 'Hitha on a runway', caption: 'Runway' }
        ],
        solution: [
            'The site moves from a cinematic introduction into galleries, project stories, an about page and a direct contact route.',
            'Animations reveal and connect the imagery without changing the underlying clarity of the page.'
        ],
        solutionImages: [
            { src: hitha('mono-crouch.jpg'), alt: 'Black and white studio portrait of Hitha', caption: 'Monochrome series' },
            { src: hitha('about-wide.jpg'), alt: 'Wide editorial portrait of Hitha', caption: 'About Hitha' }
        ],
        solutionClose: 'The original Hitha site remains unchanged. This project page introduces the work and links to the complete live experience.',
        achievements: 'A live, image-led portfolio.',
        achievementsBody: 'The published site brings Hitha’s runway, campaign and studio imagery into one editorial home with individual project pages and contact information.',
        testimonial: { quote: '“The strongest part of this build is that the photography is always the lead.”', name: 'Siddharth', company: 'Design note', photo: hitha('og-cover.jpg') },
        highlights: [
            { title: 'Experience', body: 'An editorial journey through imagery, motion and clear typography.' },
            { title: 'Work', body: 'Runway, couture, campaigns and studio series in a single portfolio.' },
            { title: 'Explore', body: 'Open the original live Hitha website to see the complete experience.' }
        ]
    },
    {
        slug: 'arden-halo', index: '002', titleLines: ['Arden', 'Halo'], title: 'Arden Halo',
        subtitle: 'A premium headphone product experience.',
        clientName: 'Independent concept', clientType: 'Product website',
        date: '2026', released: 'Oct 2026', timeframe: 'Concept build', category: 'Product',
        liveUrl: 'https://onde-one-three.vercel.app/',
        description: 'A launch page built around material detail, sound and movement.',
        hero: portfolio('arden.jpg'), tags: ['Product', '3D', 'Interaction'],
        summary: 'A product story that makes the form and features of wireless headphones easy to explore.',
        introduction: 'Arden Halo is a premium headphones concept. The website presents its sculpted form, finishes, sound features and specifications as one paced product journey.',
        approach: [
            'Studio imagery establishes the silhouette and materials before the page moves into technical detail.',
            'A 3D stage lets visitors inspect the product from different angles.',
            'Feature sections connect visual detail with sound, comfort, controls and battery information.'
        ],
        approachImage: { src: portfolio('arden-detail.jpg'), alt: 'Close-up of Arden Halo earcup', caption: 'Material and form' },
        approachNote: 'The product stays at the centre of the story.',
        challengeHeadline: 'Premium detail has to feel tangible on screen.',
        challengeBody: 'The concept balances tactile product imagery with enough practical information to help a visitor understand the headphones, rather than relying on atmosphere alone.',
        challengeImages: [
            { src: portfolio('arden-lifestyle.jpg'), alt: 'Arden Halo headphones in a city setting', caption: 'Everyday setting' },
            { src: portfolio('arden-controls.jpg'), alt: 'Arden Halo headphone controls', caption: 'Controls' },
            { src: portfolio('arden-flight.jpg'), alt: 'Arden Halo headphones in a travel setting', caption: 'Travel' }
        ],
        solution: [
            'The experience moves from hero product imagery into interactive product exploration and focused feature sections.',
            'Finishes and specifications appear as part of the journey, with a clear reserve section at the end.'
        ],
        solutionImages: [
            { src: portfolio('arden.jpg'), alt: 'Arden Halo studio product image', caption: 'Studio view' },
            { src: portfolio('arden-lifestyle.jpg'), alt: 'Arden Halo lifestyle image', caption: 'In context' }
        ],
        solutionClose: 'The published concept demonstrates a complete visual and interactive product presentation.',
        achievements: 'A published product concept.',
        achievementsBody: 'The live concept includes an interactive 3D showcase, finish selection, feature storytelling and specifications.',
        testimonial: { quote: '“A product page should help you understand the object, not only admire it.”', name: 'Siddharth', company: 'Design note', photo: portfolio('arden-detail.jpg') },
        highlights: [
            { title: '3D', body: 'An interactive stage reveals the form from more than one view.' },
            { title: 'Story', body: 'Sound, comfort and materials are introduced in a deliberate sequence.' },
            { title: 'Decision', body: 'Finishes and specifications support comparison.' }
        ]
    },
    {
        slug: 'kuro-coffee', index: '003', titleLines: ['Kuro', 'Coffee'], title: 'Kuro Coffee',
        subtitle: 'A small-batch iced latte storefront concept.',
        clientName: 'Independent concept', clientType: 'Coffee storefront',
        date: '2026', released: 'Oct 2026', timeframe: 'Concept build', category: 'Commerce',
        liveUrl: 'https://kuro-coffee-dusky.vercel.app/',
        description: 'Six signature flavours, each with its own appetite and atmosphere.',
        hero: portfolio('kuro.jpg'), tags: ['Commerce', 'Product', 'Brand'],
        summary: 'A visually rich storefront concept that makes each Kuro flavour feel distinct.',
        introduction: 'Kuro is a concept for a small-batch iced latte brand. The experience combines product scenes, ingredients and a fluid menu so visitors can understand the flavours and the brand in one place.',
        approach: [
            'A consistent visual system gives all six flavours a shared identity while preserving what makes each one different.',
            'Ingredient still lifes add texture and context to the product descriptions.',
            'Story, menu and bag panels keep exploration focused without breaking the page’s rhythm.'
        ],
        approachImage: { src: portfolio('kuro-ingredients.jpg'), alt: 'Kuro flavour ingredients arranged in a grid', caption: 'The flavour palette' },
        approachNote: 'Product imagery carries the flavour story.',
        challengeHeadline: 'Six flavours need more than six names.',
        challengeBody: 'The storefront gives each latte a clear visual identity and enough ingredient detail to make the menu useful without becoming a dense catalogue.',
        challengeImages: [
            { src: portfolio('kuro-caramel.jpg'), alt: 'Kuro caramel iced latte', caption: 'Salted caramel' },
            { src: portfolio('kuro-mocha.jpg'), alt: 'Kuro mocha iced latte', caption: 'Dark mocha' },
            { src: portfolio('kuro-pour.jpg'), alt: 'Iced latte being poured', caption: 'The process' }
        ],
        solution: [
            'The concept pairs a bold flavour-led hero with a menu, brand story, process and origins.',
            'Interactive panels let visitors move between flavours and a bag interface while staying in the visual world of the brand.'
        ],
        solutionImages: [
            { src: portfolio('kuro.jpg'), alt: 'Kuro original iced latte', caption: 'The original' },
            { src: portfolio('kuro-ingredients.jpg'), alt: 'Kuro coffee ingredients', caption: 'Ingredients' }
        ],
        solutionClose: 'The published site is a storefront concept; checkout and persistence are not presented as a live commerce service.',
        achievements: 'A published storefront concept.',
        achievementsBody: 'The live site shows six flavour scenes, ingredient storytelling, a menu and an interactive bag interface.',
        testimonial: { quote: '“The goal was to make choosing a flavour feel like part of the brand experience.”', name: 'Siddharth', company: 'Design note', photo: portfolio('kuro-caramel.jpg') },
        highlights: [
            { title: 'Menu', body: 'Six signature iced latte flavours in a consistent system.' },
            { title: 'Imagery', body: 'Product and ingredient scenes make the flavour differences visible.' },
            { title: 'Interface', body: 'A fluid menu and bag panel support exploration.' }
        ]
    },
    {
        slug: 'novair-studio', index: '004', titleLines: ['NOVAIR', 'Studio'], title: 'NOVAIR Studio',
        subtitle: 'A cinematic creative studio website concept.',
        clientName: 'Independent concept', clientType: 'Creative studio website',
        date: '2026', released: 'Oct 2026', timeframe: 'Concept build', category: 'Studio',
        liveUrl: 'https://novair-studio-iota.vercel.app/',
        description: 'An expressive digital home for visual production and art direction.',
        hero: portfolio('novair.jpg'), tags: ['Studio', 'Editorial', 'Visuals'],
        summary: 'A dark editorial website presenting a visual studio through imagery, projects and perspective.',
        introduction: 'NOVAIR Studio is a concept for a visual production studio. Its website makes the imagery the first argument, then gives visitors clear paths into projects, services, studio information and enquiry.',
        approach: [
            'The opening visual sets a strong studio identity before copy explains the offer.',
            'Projects and services have distinct paths so a visitor can explore either the work or the capability.',
            'The journal adds a place for process and point of view beyond the project archive.'
        ],
        approachImage: { src: portfolio('novair-portrait.jpg'), alt: 'NOVAIR fashion portrait concept', caption: 'A visual first impression' },
        approachNote: 'Editorial imagery gives the site its character.',
        challengeHeadline: 'A visual studio has to show range and direction.',
        challengeBody: 'The concept keeps the imagery ambitious while organising projects, services and studio information into a site that remains easy to navigate.',
        challengeImages: [
            { src: portfolio('novair-campaign.jpg'), alt: 'NOVAIR campaign image', caption: 'Campaign' },
            { src: portfolio('novair-coffee.jpg'), alt: 'NOVAIR coffee product visual', caption: 'Product' },
            { src: portfolio('novair-studio.jpg'), alt: 'NOVAIR studio team visual', caption: 'Studio' }
        ],
        solution: [
            'The website uses a cinematic introduction, project archive, services and studio pages to build a complete picture of the concept.',
            'A journal and contact path let interested visitors go deeper or start a conversation.'
        ],
        solutionImages: [
            { src: portfolio('novair.jpg'), alt: 'NOVAIR veil portrait', caption: 'The opening image' },
            { src: portfolio('novair-portrait.jpg'), alt: 'NOVAIR portrait study', caption: 'Portrait study' }
        ],
        solutionClose: 'The published concept presents the studio’s visual language and site structure; service and form backends may require configuration.',
        achievements: 'A published studio concept.',
        achievementsBody: 'The live site combines projects, services, studio content, journal and contact pages in one editorial visual system.',
        testimonial: { quote: '“The imagery needed to make the first impression; the structure needed to carry the rest.”', name: 'Siddharth', company: 'Design note', photo: portfolio('novair-campaign.jpg') },
        highlights: [
            { title: 'Work', body: 'Project imagery and an archive make the studio’s range visible.' },
            { title: 'Context', body: 'Services, studio content and a journal explain the point of view.' },
            { title: 'Enquiry', body: 'A direct contact path connects the visual story to a next step.' }
        ]
    }
]

export const getProject = (slug: string): Project | undefined =>
    projects.find((project) => project.slug === slug)

export const getOtherProjects = (slug: string): readonly Project[] =>
    projects.filter((project) => project.slug !== slug)
