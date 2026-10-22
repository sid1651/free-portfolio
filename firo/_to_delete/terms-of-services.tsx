import type { FC, ReactNode } from 'react'
import type { LegalSection } from '@/components/generals/legal-page'

import { LegalPage } from '@/components/generals/legal-page'
import { siteConfig } from '@/constants/site'

const sections: LegalSection[] = [
    {
        title: 'About these terms',
        paragraphs: [
            `These terms apply to your use of the ${siteConfig.name} website. By browsing the site you agree to them. Project work is governed by the separate proposal or agreement we sign with each client.`
        ]
    },
    {
        title: 'Our work and imagery',
        paragraphs: [
            'All imagery, video, text and design on this website are owned by NOVAIR Studio or used with permission of our clients. You may share links to our pages, but you may not copy, download for reuse or republish our work without written consent.',
            'Many of the visuals shown were created with generative AI under human art direction. Rights to commissioned work are transferred to clients as set out in their project agreement.'
        ]
    },
    {
        title: 'Inquiries and proposals',
        paragraphs: [
            'Sending an inquiry does not create a contract. Any quote, timeline or budget we share becomes binding only once both parties confirm it in writing.'
        ]
    },
    {
        title: 'Acceptable use',
        paragraphs: [
            'Please do not misuse this website, attempt to access it in ways it was not designed for, or submit content that is unlawful, misleading or harmful.'
        ]
    },
    {
        title: 'Liability',
        paragraphs: [
            'We take care to keep the information on this site accurate and current, but it is provided as is. To the extent permitted by law, we are not liable for loss arising from the use of this website or from websites we link to.'
        ]
    },
    {
        title: 'Governing law',
        paragraphs: [
            'These terms are governed by Dutch law. Any dispute will be handled by the competent court in Amsterdam, unless mandatory consumer law gives you another option.',
            `Questions about these terms can be sent to ${siteConfig.email}.`
        ]
    }
]

const TermsPage: FC = (): ReactNode => {
    return (
        <LegalPage
            title='Terms of Service'
            seoTitle='Terms of service'
            description='The terms that apply when you use the NOVAIR Studio website.'
            updated='October 6, 2026'
            intro='The short version: enjoy the work, talk to us before you use it, and know that every project is covered by its own agreement.'
            sections={sections}
        />
    )
}

export default TermsPage
