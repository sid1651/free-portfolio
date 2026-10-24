import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight, MoveUpRight } from 'lucide-react'
import { Seo } from '@/components/generals/seo'
import { EstateShell } from '@/components/estate/estate-shell'

const highlights = [
    { number: '01', title: 'Room to unwind', description: 'Generous interiors planned around light, ease and everyday rituals.' },
    { number: '02', title: 'Closer to nature', description: 'Landscaped spaces make a quieter moment part of every day.' },
    { number: '03', title: 'Made to belong', description: 'Places to gather, connect and feel at home beyond your front door.' }
]

const Home = () => <EstateShell home>
    <Seo title='A considered way to live' description='Explore a Godrej Properties inspired concept for contemporary living with thoughtful homes, natural spaces and an effortless sense of belonging.' ogImage='/images/estate/residences-hero.jpg' />
    <main>
        <section className='estate-hero' aria-labelledby='hero-title'>
            <Image src='/images/estate/residences-hero.jpg' alt='Contemporary residences surrounded by greenery beside a reflecting pool' fill priority sizes='100vw' className='estate-hero__image' />
            <div className='estate-hero__shade' />
            <div className='estate-container estate-hero__content'>
                <div className='estate-hero__copy'>
                    <p className='estate-kicker estate-kicker--light'>A more considered way to live</p>
                    <h1 id='hero-title'>Come home<br />to <em>more.</em></h1>
                    <p className='estate-hero__lead'>Contemporary residences shaped around the moments that matter most.</p>
                    <Link href='/contact' className='estate-button estate-button--light'>Enquire now <ArrowRight size={18} aria-hidden='true' /></Link>
                </div>
                <a className='estate-hero__scroll' href='#overview'>Explore the residences <ArrowDown size={16} aria-hidden='true' /></a>
            </div>
            <div className='estate-hero__corner'>A new vision of home</div>
        </section>

        <section className='estate-intro estate-section' id='overview' aria-labelledby='overview-title'>
            <div className='estate-container estate-intro__grid'>
                <div><p className='estate-kicker'>The living experience</p><h2 id='overview-title' className='estate-display'>Life feels different<br />when it has <em>space.</em></h2></div>
                <div className='estate-intro__aside'><p>Imagine a home that gives you more than somewhere to be. A place for slow mornings, lively evenings and everything in between.</p><Link href='/contact' className='estate-text-link'>Discover your next home <MoveUpRight size={18} aria-hidden='true' /></Link></div>
            </div>
            <div className='estate-container estate-intro__divider'><span>Designed for living well</span><span>01 / 04</span></div>
        </section>

        <section className='estate-image-story' id='residences' aria-labelledby='residences-title'>
            <div className='estate-image-story__visual'><Image src='/images/estate/residence-interior.jpg' alt='Sunlit residence living room opening onto a planted terrace' fill sizes='(max-width: 800px) 100vw, 60vw' /></div>
            <div className='estate-image-story__body'><p className='estate-kicker'>The residences</p><h2 id='residences-title' className='estate-display'>Every detail,<br /><em>in its place.</em></h2><p>Light-filled rooms, natural textures and an easy flow from inside to out. Spaces designed to make the ordinary feel exceptional.</p><div className='estate-image-story__rule' /><div className='estate-image-story__features'><span>Thoughtful layouts</span><span>Natural light</span><span>Timeless materials</span></div><Link href='/contact' className='estate-text-link'>Ask about the residences <MoveUpRight size={18} aria-hidden='true' /></Link></div>
        </section>

        <section className='estate-highlights estate-section' id='lifestyle' aria-labelledby='lifestyle-title'><div className='estate-container'><p className='estate-kicker'>Beyond your front door</p><h2 id='lifestyle-title' className='estate-display'>A little more room<br />for <em>everything.</em></h2><div className='estate-highlights__grid'>{highlights.map(item => <article className='estate-highlight' key={item.number}><span className='estate-highlight__number'>{item.number}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></div></section>

        <section className='estate-garden' aria-labelledby='garden-title'><Image src='/images/estate/garden-courtyard.jpg' alt='Landscaped garden courtyard and calm reflecting pool' fill sizes='100vw' /><div className='estate-garden__overlay' /><div className='estate-container estate-garden__content'><p className='estate-kicker estate-kicker--light'>Nature in every day</p><h2 id='garden-title'>Find your<br /><em>own pace.</em></h2><p>Green spaces, open air and places to pause bring balance to the rhythm of city life.</p></div></section>

        <section className='estate-location estate-section' id='location' aria-labelledby='location-title'><div className='estate-container estate-location__grid'><div><p className='estate-kicker'>Connected living</p><h2 id='location-title' className='estate-display'>At the centre of<br /><em>your world.</em></h2></div><div className='estate-location__copy'><p>Close to the energy of the city, with the comfort of a retreat to return to. This vision of home brings both within reach.</p><p className='estate-location__note'>Project location and connectivity details will be added when confirmed.</p><Link href='/contact' className='estate-text-link'>Speak with us <MoveUpRight size={18} aria-hidden='true' /></Link></div></div></section>

        <section className='estate-cta' aria-labelledby='cta-title'><div className='estate-container estate-cta__inner'><div><p className='estate-kicker estate-kicker--light'>Start a conversation</p><h2 id='cta-title'>Your next chapter<br /><em>starts here.</em></h2></div><Link href='/contact' className='estate-button estate-button--light'>Contact us <ArrowRight size={18} aria-hidden='true' /></Link></div></section>
    </main>
</EstateShell>

export default Home
