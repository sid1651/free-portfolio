import type { FC, ReactNode } from 'react'
import type { LegalSection } from '@/components/generals/legal-page'

import { LegalPage } from '@/components/generals/legal-page'
import { studio } from '@/constants/site'

const sections: readonly LegalSection[] = [
    {
        heading: 'Contact',
        paragraphs: [
            `The contact form opens an email draft addressed to ${studio.email}. It does not submit your message to this website or store it in a site database.`,
            'Your email app handles the message after you choose to send it. You can also write to the address shown on the contact page.'
        ]
    },
    {
        heading: 'Browsing',
        paragraphs: [
            'This portfolio does not intentionally set advertising cookies or run an analytics script.',
            'The hosting provider may process basic request information needed to deliver the site.'
        ]
    },
    {
        heading: 'Other sites',
        paragraphs: [
            'Project links open separately published websites. Their own privacy information applies when you visit them.',
            `For questions about this portfolio, email ${studio.email}.`
        ]
    }
]

const PrivacyPolicyPage: FC = (): ReactNode => (
    <LegalPage
        title='Privacy policy'
        updated='22 October 2026'
        intro='What this portfolio does with information you choose to share.'
        sections={sections}
    />
)

export default PrivacyPolicyPage
