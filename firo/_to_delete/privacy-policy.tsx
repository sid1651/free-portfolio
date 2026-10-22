import type { FC, ReactNode } from 'react'
import type { LegalSection } from '@/components/generals/legal-page'

import { LegalPage } from '@/components/generals/legal-page'
import { siteConfig } from '@/constants/site'

const sections: LegalSection[] = [
    {
        title: 'Who we are',
        paragraphs: [
            `${siteConfig.name} is a creative studio based at ${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.country}. We are responsible for the personal data described in this policy.`,
            `If you have any question about your data, write to ${siteConfig.email} and we will reply within 48 hours on working days.`
        ]
    },
    {
        title: 'What we collect',
        paragraphs: [
            'When you send an inquiry through our contact form we receive your name, email address, phone number if you share it, the services you selected and your message.',
            'We do not ask for payment details on this website and we do not create user accounts.'
        ]
    },
    {
        title: 'How we use it',
        paragraphs: [
            'We use your inquiry only to reply to you, prepare a proposal and run the project you ask us about. Inquiries are stored securely and forwarded to our team by email.',
            'Emails we send from this website include open and click measurement, which tells us whether a message was opened and which links were used. We use this only to make sure our replies arrive.'
        ]
    },
    {
        title: 'Analytics',
        paragraphs: [
            'We measure visits with privacy-friendly, cookieless analytics. It counts pages viewed, the country and the type of device in aggregate, and it never identifies you personally or follows you across other websites.'
        ]
    },
    {
        title: 'Sharing and storage',
        paragraphs: [
            'We never sell your data. We only share it with the service providers that host this website, store our files and deliver our email, and only as far as needed to provide those services.',
            'We keep inquiries for as long as needed to answer them and manage any project that follows, and for no longer than two years after our last contact unless the law requires otherwise.'
        ]
    },
    {
        title: 'Your rights',
        paragraphs: [
            'You can ask us to see, correct, export or delete the personal data we hold about you, or object to how we use it. Send your request to the email address above.',
            'You also have the right to complain to your local data protection authority. In the Netherlands this is the Autoriteit Persoonsgegevens.'
        ]
    },
    {
        title: 'Changes',
        paragraphs: [
            'We may update this policy when our services change. The date at the top of this page always shows the latest version.'
        ]
    }
]

const PrivacyPolicyPage: FC = (): ReactNode => {
    return (
        <LegalPage
            title='Privacy Policy'
            seoTitle='Privacy policy'
            description='How NOVAIR Studio collects, uses and protects the information you share through this website.'
            updated='October 6, 2026'
            intro='Your trust matters as much as our visuals. This policy explains what we collect when you use this website, why we collect it and how you stay in control.'
            sections={sections}
        />
    )
}

export default PrivacyPolicyPage
