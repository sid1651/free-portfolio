import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Seo } from '@/components/generals/seo'
import { EstateShell } from '@/components/estate/estate-shell'
import { EstateContactForm } from '@/components/estate/estate-contact-form'

const Contact = () => <EstateShell>
    <Seo title='Contact' description='Ask about Global Business City, Greater Noida, through the Godrej Properties concept website.' ogImage='/images/estate/gbc-aerial.webp' />
    <main className='estate-contact-page'><section className='estate-contact-hero estate-container' aria-labelledby='contact-title'>
        <div className='estate-contact-hero__intro'><Link href='/' className='estate-back'><ArrowLeft size={16} aria-hidden='true' /> Back to home</Link><p className='estate-kicker'>Global Business City · Greater Noida</p><h1 id='contact-title'>Let’s talk<br /><em>about your plans.</em></h1><p>Share what you would like to know about the township vision or housing typologies. Ask for current official documents before making a property decision.</p><p className='estate-contact-hero__direct'>Email directly: <a href='mailto:salesOfficial@gmail.com'>salesOfficial@gmail.com</a></p><div className='estate-contact-hero__image'><Image src='/images/estate/gbc-industry.webp' alt='Aerial district image from the Global Business City presentation' fill sizes='(max-width: 900px) 100vw, 40vw' /></div></div>
        <div className='estate-contact-hero__form'><p className='estate-kicker'>Contact us</p><h2>Start a conversation</h2><p className='estate-contact-hero__form-lead'>Share your details and we’ll get back to you.</p><EstateContactForm /></div>
    </section></main>
</EstateShell>

export default Contact
