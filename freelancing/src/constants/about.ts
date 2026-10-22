const img = (name: string): string => `/images/portfolio/${name}`

export const aboutPage = {
    kicker: 'IDX — AL / PROFILE',
    name: 'Narava Venkat Siddharth',
    role: 'Full Stack Developer',
    lede: ['I design the surface,', 'and build what powers it.'],
    portrait: img('depth-art.jpg'),
    portraitCaption: 'The idea takes shape',
    portraitLabel: 'AL / 2026',

    biography: {
        label: 'BIOGRAPHY',
        statement: 'THE BEST DIGITAL EXPERIENCES MAKE AN AMBITIOUS IDEA FEEL SIMPLE TO USE.',
        paragraphs: [
            'I am a full stack developer and 2026 Computer Science graduate from Bennett University. I work across React, TypeScript, Node.js, APIs and databases, with a strong interest in the visual side of the web.',
            'My internship work has included streaming media, ecommerce workflows and automated order dispatch. Those engineering problems taught me to value reliability as much as the first impression.',
            'Under the name Alchemy, I build expressive portfolios, product sites and practical applications. I enjoy taking a brief from loose idea to working launch.'
        ]
    },

    practice: {
        label: 'WORK',
        title: ['WHAT I', 'ACTUALLY DO'],
        disciplines: [
            { code: 'I / AL', title: 'Websites', body: 'Distinctive portfolios, landing pages and business sites with clear structure and responsive detail.' },
            { code: 'II / AL', title: 'Interfaces', body: 'Product experiences that help visitors understand, explore and act.' },
            { code: 'III / AL', title: 'Full stack', body: 'React and TypeScript on the surface, with APIs, authentication and data workflows underneath.' },
            { code: 'IV / AL', title: 'Motion', body: 'Animation that reveals content, gives feedback and supports the story.' }
        ]
    },

    shows: {
        label: 'SELECTED WORK',
        title: 'WHERE THE WORK HAS BEEN',
        entries: [
            { year: '2026', title: 'Hitha', venue: 'Editorial portfolio', city: 'Live' },
            { year: '2026', title: 'Arden Halo', venue: 'Product experience', city: 'Concept' },
            { year: '2026', title: 'Kuro Coffee', venue: 'Storefront experience', city: 'Concept' },
            { year: '2026', title: 'NOVAIR Studio', venue: 'Creative studio site', city: 'Concept' },
            { year: '2026', title: 'Kodikos', venue: 'Collaborative code editor', city: 'Application' },
            { year: '2026', title: 'Settlers 3D', venue: 'Multiplayer strategy game', city: 'Application' }
        ]
    },

    closing: {
        title: ['LET’S', 'BUILD'],
        body: 'A portfolio, product launch or application idea. Send the brief and I will help turn it into a clear plan and a working experience.',
        cta: 'START A PROJECT',
        marquee: 'AVAILABLE FOR WEBSITES, INTERFACES & FULL STACK BUILDS'
    }
}
