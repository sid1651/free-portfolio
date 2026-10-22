import type { Thought } from '@/types'

const img = (name: string): string => `/images/portfolio/${name}`

export const thoughts: readonly Thought[] = [
    {
        slug: 'what-an-editorial-portfolio-needs-to-do',
        date: '2026-10-22', dateLabel: 'October 22, 2026',
        title: 'What an Editorial Portfolio Needs to Do',
        excerpt: 'A strong image opens the door. Structure and pacing help the visitor stay with the work.',
        author: 'Alchemy', authorPhoto: img('hero-art.jpg'), authorRole: 'Project notes',
        image: img('hitha.jpg'), readMinutes: '3', topic: 'Portfolio',
        body: [
            { paragraphs: [
                'The first screen of an editorial portfolio has a simple job: make the work impossible to miss. A photograph can do that faster than a paragraph of introduction.',
                'The more difficult part comes after the first impression. A visitor needs to understand the range of the work and find a way to make contact without losing the atmosphere that drew them in.'
            ] },
            { heading: 'Give each series its own space', paragraphs: [
                'Hitha’s portfolio brings runway, couture and studio imagery together. Separate project pages let each series have a clear beginning, context and sequence of images.',
                'That structure also makes the archive easier to navigate. The visitor can follow one story at a time instead of scanning an endless image grid.'
            ] },
            { heading: 'Motion should serve the images', paragraphs: [
                'Transitions can make a portfolio feel alive, but they should reveal the work rather than compete with it.',
                'The strongest moments use movement to guide attention, then give the photograph time to be seen.'
            ] }
        ]
    },
    {
        slug: 'making-a-product-feel-tangible-online',
        date: '2026-10-22', dateLabel: 'October 22, 2026',
        title: 'Making a Product Feel Tangible Online',
        excerpt: 'A product page works when material detail and useful information arrive together.',
        author: 'Alchemy', authorPhoto: img('hero-art.jpg'), authorRole: 'Project notes',
        image: img('arden.jpg'), readMinutes: '3', topic: 'Product',
        body: [
            { paragraphs: [
                'A premium product site needs more than a polished hero image. The visitor wants to understand the object: its form, finish, controls and the way it might fit into everyday life.',
                'Arden Halo started from that question. The design moves from studio imagery to close detail, lifestyle context and specifications.'
            ] },
            { heading: 'Show the form from more than one angle', paragraphs: [
                'A 3D stage gives the visitor a more direct way to inspect the headphones. The interaction has a clear purpose: reveal shape and material.',
                'The supporting sections connect those visual details to comfort, sound and controls so the site stays useful.'
            ] },
            { heading: 'Make comparison easy', paragraphs: [
                'Finishes and specifications are most helpful when they appear in the same journey as the product story.',
                'The page should make the decision feel simpler by the end than it did at the beginning.'
            ] }
        ]
    },
    {
        slug: 'a-storefront-with-a-point-of-view',
        date: '2026-10-22', dateLabel: 'October 22, 2026',
        title: 'A Storefront with a Point of View',
        excerpt: 'Distinct product imagery can turn a menu into a brand experience.',
        author: 'Alchemy', authorPhoto: img('hero-art.jpg'), authorRole: 'Project notes',
        image: img('kuro.jpg'), readMinutes: '3', topic: 'Commerce',
        body: [
            { paragraphs: [
                'A flavour list is useful, but it rarely gives someone a reason to remember a brand. Kuro Coffee treats each iced latte as a small visual world within one consistent storefront.',
                'The imagery carries the appetite while the menu and ingredient details make the options understandable.'
            ] },
            { heading: 'Give variety a system', paragraphs: [
                'The six flavours share type, layout and interaction patterns, then change colour, imagery and detail as each product needs.',
                'That balance gives the visitor a sense of variety without making the site feel like six unrelated pages.'
            ] },
            { heading: 'Keep the journey honest', paragraphs: [
                'The published Kuro site is a storefront concept. Its menu and bag interface demonstrate how exploration could work; live checkout and order persistence require a commerce backend.',
                'A clear portfolio should show the strength of the idea and be equally clear about what has actually been built.'
            ] }
        ]
    }
]

export const getThought = (slug: string): Thought | undefined =>
    thoughts.find((thought) => thought.slug === slug)

export const getOtherThoughts = (slug: string): readonly Thought[] =>
    thoughts.filter((thought) => thought.slug !== slug)
