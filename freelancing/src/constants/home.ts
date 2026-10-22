const img = (name: string): string => `/images/portfolio/${name}`

export const hero = {
    wordmark: 'Alchemy',
    statement: ['I turn ideas', 'into', 'DIGITAL WORK'],
    image: img('hero-art.jpg'),
    explore: 'explore',
    phases: [
        { index: '001', label: 'WORK/', value: 'DESIGN', fill: 0.62 },
        { index: '002', label: 'WORK/', value: 'BUILD', fill: 0.84 },
        { index: '003', label: 'WORK/', value: 'SYSTEMS', fill: 0.48 },
        { index: '004', label: 'WORK/', value: 'LAUNCH', fill: 0.36 }
    ],
    skills: ['WEBSITES', 'INTERFACES', 'FULL STACK', 'MOTION', 'PRODUCT THINKING']
}

export const intro = {
    image: img('depth-art.jpg'),
    caption: 'An idea, given direction',
    captionLabel: 'Alchemy',
    title: ['THE IDEA IS', 'JUST THE START'],
    subtitle: 'I AM SIDDHARTH, AN INDEPENDENT FULL STACK DEVELOPER. I DESIGN AND BUILD DISTINCTIVE WEBSITES AND USEFUL APPLICATIONS, FROM THE FIRST SCREEN TO THE SYSTEMS BEHIND IT.',
    note: 'A strong visual idea deserves an equally strong build.',
    footnote: 'A selection of websites, experiments and software I have built.'
}

export const gallery = [
    { src: img('hitha.jpg'), caption: 'Editorial presence, made digital', label: 'Hitha', place: 'Live portfolio' },
    { src: img('arden.jpg'), caption: 'Product form in focus', label: 'Arden Halo', place: 'Product concept' },
    { src: img('kuro.jpg'), caption: 'A flavour with its own world', label: 'Kuro Coffee', place: 'Storefront concept' },
    { src: img('novair.jpg'), caption: 'An image that holds attention', label: 'NOVAIR', place: 'Studio concept' },
    { src: img('arden-lifestyle.jpg'), caption: 'A product in real life', label: 'Arden Halo', place: 'Lifestyle' },
    { src: img('kuro-caramel.jpg'), caption: 'Small details, strong appetite', label: 'Kuro Coffee', place: 'Product study' }
] as const

export const concept = {
    image: img('hitha.jpg'),
    imageTitle: 'HITHA',
    kicker: '// APPROACH',
    revision: 'DESIGN × DEVELOPMENT',
    title: ['THE WORK', 'SPEAKS', 'FIRST'],
    description: 'A portfolio has seconds to make its point. I use structure, imagery and motion to reveal the strongest work immediately, then give people a clear path to explore.',
    strapline: ['PRESENCE', 'WITH PURPOSE'],
    catalog: [
        { code: 'DESIGN — 01', body: 'Give the idea a visual language that feels specific to the person or product behind it.' },
        { code: 'BUILD — 02', body: 'Make the experience responsive, accessible and practical to use, even when the visual treatment is ambitious.' }
    ]
}

export const process = {
    label: 'THE BUILD',
    title: ['Some ideas arrive clear.', 'Others take shape.'],
    subtitle: 'The same disciplined process gets both into the browser.',
    source: 'SOURCE',
    sourceNote: '— WORKING NOTES',
    background: img('depth-art.jpg'),
    modules: [
        { code: 'STEP — 01', body: 'Find the useful idea: audience, purpose, and the action the experience should make easier.' },
        { code: 'STEP — 02', body: 'Set the visual direction with hierarchy, type, imagery, and a clear content structure.' },
        { code: 'STEP — 03', body: 'Build the interface and underlying logic with React, TypeScript, APIs, and the right data model.' },
        { code: 'STEP — 04', body: 'Test across screens, refine the details, and bring the finished work online.' }
    ]
}

export const featured = {
    marquee: 'DIGITAL CRAFT',
    study: 'SELECTED BUILDS',
    kicker: 'SELECTED WORK',
    headline: ['IDEAS', 'BECOME', 'FORM.'],
    headlineTwo: ['FORM', 'BECOMES', 'FUNCTION.'],
    artistDescription: 'THE BEST DIGITAL WORK FEELS CONSIDERED AT FIRST GLANCE AND EFFORTLESS IN USE.',
    editorial: 'VISUAL IMPACT IS ONLY THE BEGINNING. THE DETAILS MAKE IT WORK.',
    connected: '[DETAIL]',
    thumbnails: [
        { src: img('arden-detail.jpg'), caption: 'DETAIL—I' },
        { src: img('kuro-ingredients.jpg'), caption: 'DETAIL—II' },
        { src: img('novair-coffee.jpg'), caption: 'DETAIL—III' }
    ],
    wideTop: img('arden.jpg'),
    wideBottom: img('novair-portrait.jpg')
}

export const workTypes = {
    headline: ['every brief needs', 'its own answer.'],
    storage: 'ALCHEMY / PORTFOLIO',
    years: '2025-2026',
    archive: 'DESIGN · CODE · LAUNCH',
    features: [
        { mod: 'MOD — I/AL', title: 'WEBSITES', number: '001', body: 'Expressive portfolios and business sites with clear navigation, responsive layouts and a strong first impression.' },
        { mod: 'MOD — II/AL', title: 'INTERFACES', number: '002', body: 'Product experiences that help people understand features, compare options and take a useful next step.' },
        { mod: 'MOD — III/AL', title: 'FULL STACK', number: '003', body: 'Application logic, REST APIs, authentication and data workflows built to support the interface.' },
        { mod: 'MOD — IV/AL', title: 'MOTION', number: '004', body: 'Animation used to guide attention, reveal detail and make a page feel alive without slowing it down.' },
        { mod: 'MOD — V/AL', title: 'LAUNCH', number: '005', body: 'Testing, performance work and deployment so the experience works beyond the design preview.' }
    ]
}

export const statement = {
    imageTop: img('arden-lifestyle.jpg'),
    imageBottom: img('novair-campaign.jpg'),
    messageOne: 'CLARITY MOVES.',
    messageTwo: 'DETAILS MATTER.',
    lines: 'A good idea becomes useful when every part works together.',
    features: ['STRUCTURE', 'MOTION', 'SYSTEMS', 'CARE'],
    headline: ['BEYOND', 'THE FIRST FRAME'],
    subtitle: 'A website can be striking and still be fast, clear and easy to use.',
    footnote: 'I work across visual design and engineering, shaping each project around what its audience actually needs.',
    image: img('hero-art.jpg'),
    imageCaption: 'Design and development, together',
    imageLabel: 'THE APPROACH'
}

export const philosophy = {
    left: 'WHAT WORKS IS WHAT LASTS.',
    leftNote: 'Clarity in the idea. Care in the build.',
    right: 'I treat every project as a collaboration between the visual idea and the technical system. Each needs to support the other for the finished experience to feel complete.',
    rabbit: '/images/butterfly-mark.png',
    circularText: 'DESIGN · CODE · CLARITY · CRAFT · DESIGN · CODE · ',
    headline: 'BEHIND THE SCREEN*',
    signatureText: 'I enjoy the moment a loose brief becomes a working page. The composition settles, the interaction feels right, the data flows where it should. That is where the idea stops being a mockup and starts helping someone.',
    signature: 'Siddharth.',
    tag: 'ALCHEMY',
    name: ['Narava Venkat', 'SIDDHARTH'],
    cards: [
        { title: 'DESIGN', body: 'Type, imagery, layout and motion shaped around a clear message.' },
        { title: 'DEVELOPMENT', body: 'React, TypeScript and dependable frontend architecture.' },
        { title: 'SYSTEMS', body: 'APIs, databases and workflows that make the interface useful.' }
    ]
}

export const showcase = {
    quote: '“The best part of a build is when the visual idea and the working product finally feel like one thing.”',
    quoteAuthor: '— SIDDHARTH',
    image: img('depth-art.jpg'),
    imageCaption: 'From complexity to clarity',
    imageLabel: 'Process',
    title: 'THE WORK BEHIND THE WORK',
    subtitle: 'A little about the decisions, systems and details behind each finished experience.',
    recorded: 'Independent development, 2026',
    duration: 'From concept to launch',
    format: 'Design & code'
}

export const exhibition = {
    image: img('hitha.jpg'),
    wideImage: '/images/hitha/about-wide.jpg',
    title: 'Hitha',
    author: 'for Akhivaashna Hitha',
    description: 'An editorial portfolio where photography leads and every interaction gives the work room to breathe.',
    showing: 'Live portfolio, 2026',
    venue: 'Fashion and editorial',
    location: 'Runway · Couture · Studio',
    button: 'VIEW WORK',
    number: 'PORTFOLIO / 2026',
    kicker: 'LATEST / PORTFOLIO',
    conceptTitle: 'THE IDEA',
    conceptBody: 'Build a digital space that gives Hitha’s image making the same presence it has in print, while keeping the work easy to explore and the contact path direct.',
    yearFrom: '2025',
    yearTo: '2026',
    code: 'HITHA',
    projectCode: 'AL.26.001',
    projectName: 'HITHA',
    version: 'LIVE',
    details: ['PORTFOLIO — HITHA', 'DESIGN — EDITORIAL', 'BUILD — NEXT.JS', 'DEVELOPMENT — SIDDHARTH']
}

export const about = {
    index: 'IDX — AL',
    intro: 'I’m',
    name: 'Narava Venkat Siddharth',
    subtitle: 'Independent full stack developer and design-minded builder.',
    role: 'Full Stack Developer',
    quote: '“Great things are done by a series of small things brought together.”',
    quoteAuthor: '— Vincent van Gogh',
    summary: 'I build websites and applications from interface to infrastructure.',
    summaryNote: 'Good work starts with a clear purpose and gets better through the details.',
    image: img('hero-art.jpg'),
    profile: 'I’m an India-based developer.',
    profileNote: 'I work with React, TypeScript, Node.js and the tools a project actually needs. Open to freelance website and application builds.',
    skillsLabel: 'WHAT I DO',
    skills: ['WEB DESIGN', 'REACT', 'TypeScript', 'Node.js', 'REST APIs', 'Databases', 'Motion', 'Deployment'],
    cta: 'VIEW THE WORK'
}
