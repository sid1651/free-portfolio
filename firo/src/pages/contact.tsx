import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Seo } from '@/components/generals/seo'
import { EstateShell } from '@/components/estate/estate-shell'
import { EstateContactForm } from '@/components/estate/estate-contact-form'

const Contact = () => <EstateShell>
    <Seo title='Contact' description='Contact the Godrej Properties concept site to share what you are looking for in a new home.' ogImage='/images/estate/residences-hero.jpg' />
    <main className='estate-contact-page'><section className='estate-contact-hero estate-container' aria-labelledby='contact-title'>
        <div className='estate-contact-hero__intro'><Link href='/' className='estate-back'><ArrowLeft size={16} aria-hidden='true' /> Back to home</Link><p className='estate-kicker'>Begin your journey</p><h1 id='contact-title'>Let’s find<br /><em>your place.</em></h1><p>Tell us a little about what you’re looking for. We’ll be in touch when the project details are ready to share.</p><div className='estate-contact-hero__image'><Image src='/images/estate/garden-courtyard.jpg' alt='Green courtyard beside a reflecting pool' fill sizes='(max-width: 900px) 100vw, 40vw' /></div></div>
        <div className='estate-contact-hero__form'><p className='estate-kicker'>Contact us</p><h2>Start a conversation</h2><p className='estate-contact-hero__form-lead'>Share your details and we’ll get back to you.</p><EstateContactForm /></div>
    </section></main>
</EstateShell>

export default Contact
