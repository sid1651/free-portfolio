import type { FC, ReactNode } from 'react'
import type { LegalSection } from '@/components/generals/legal-page'

import { LegalPage } from '@/components/generals/legal-page'
import { studio } from '@/constants/site'

const sections: readonly LegalSection[] = [
    {
        heading: 'About this portfolio',
        paragraphs: [
            `This site presents work by ${studio.artist} under the name ${studio.brand}.`,
            'Hitha is shown as a live portfolio. Arden Halo, Kuro Coffee and NOVAIR Studio are independent concept builds.'
        ]
    },
    {
        heading: 'Images and project sites',
        paragraphs: [
            'Project images and brand names belong to their respective owners. Portfolio presentation and generated Alchemy artwork are used here to show the work.',
            'Links to published projects open those original experiences. Their content and operation are separate from this portfolio.'
        ]
    },
    {
        heading: 'Enquiries',
        paragraphs: [
            'Sending an email starts a conversation. Scope, timing and fees for any new work are agreed separately.',
            `Questions about this site can be sent to ${studio.email}.`
        ]
    }
]

const TermsOfUsePage: FC = (): ReactNode => (
    <LegalPage
        title='Terms of use'
        updated='22 October 2026'
        intro='A short explanation of the projects and material shown here.'
        sections={sections}
    />
)

export default TermsOfUsePage
