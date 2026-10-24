import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight, MoveUpRight } from 'lucide-react'
import { Seo } from '@/components/generals/seo'
import { EstateShell } from '@/components/estate/estate-shell'

const highlights = [
    { number: '01', title: 'Room to unwind', description: 'Generous interiors imagined around light, ease and everyday rituals.' },
    { number: '02', title: 'Closer to nature', description: 'A landscape led vision that makes a quieter moment part of every day.' },
    { number: '03', title: 'Made to belong', description: 'Places to gather, connect and feel at home beyond your front door.' }
]

const homeOptions = [
    { type: 'One bedroom', title: 'A place to begin', description: 'A compact home idea with room for the essentials and an easy daily routine.' },
    { type: 'Two bedrooms', title: 'Room to grow', description: 'A flexible arrangement for shared moments, quiet work and personal space.' },
    { type: 'Three bedrooms', title: 'Space for everyone', description: 'A larger home idea that brings private corners and gathering spaces together.' }
]

const amenityIdeas = [
    { title: 'Rest & recharge', items: ['A calm lounge', 'Places to pause', 'Space for wellbeing'] },
    { title: 'Move your way', items: ['Fitness spaces', 'Walking routes', 'Open air activity'] },
    { title: 'Come together', items: ['Shared gathering areas', 'Room for celebrations', 'Family friendly corners'] },
    { title: 'Step outside', items: ['Landscaped gardens', 'Shaded seating', 'Green views'] }
]

const connections = [
    { title: 'The daily journey', description: 'Understand routes to work, transport links and the time a typical commute could take.' },
    { title: 'Everyday essentials', description: 'Look at access to shops, schools, healthcare and the places you visit most often.' },
    { title: 'The wider neighbourhood', description: 'See how the address fits into the surrounding area as it grows over time.' }
]

const specifications = [
    { title: 'Structure & safety', description: 'Ask for the approved structural system, safety provisions and supporting documents.' },
    { title: 'Materials & finishes', description: 'Review the final schedule for flooring, doors, windows and everyday surfaces.' },
    { title: 'Kitchen & bathrooms', description: 'Compare the stated fittings, provisions and finish level for each residence type.' },
    { title: 'Services & comfort', description: 'Check electrical, water, ventilation, accessibility and shared building services.' }
]

const reasons = [
    { title: 'Choose for your life', description: 'Start with how you live now, then consider how your rooms may need to change.' },
    { title: 'Look beyond the front door', description: 'Outdoor areas, shared spaces and neighbourhood access shape the whole experience.' },
    { title: 'Ask for the full picture', description: 'Plans, specifications, approvals and total costs deserve a careful review.' }
]

const questions = [
    { question: 'Is this an official project website?', answer: 'No. This is an independent design concept using the Godrej Properties name. Images and descriptions illustrate a possible residential experience.' },
    { question: 'Are the home types available to buy?', answer: 'The one, two and three bedroom examples are design ideas. They do not represent confirmed inventory.' },
    { question: 'Where can I see exact sizes and prices?', answer: 'Verified unit sizes, availability and pricing have not been supplied for this concept. Request current official documents before making a decision.' },
    { question: 'Can I see a master plan or floor plan?', answer: 'The final master plan and unit floor plans are not included here. Ask for approved plans that match the residence you are considering.' },
    { question: 'Are the amenities and specifications final?', answer: 'No. These sections are a guide to what to explore and verify. The final details must come from project documents.' },
    { question: 'Is the location and registration confirmed?', answer: 'This concept does not claim a specific project address or registration number. Confirm both through official project and regulatory sources.' }
]

const Home = () => <EstateShell home>
    <Seo title='A considered way to live' description='Explore a Godrej Properties inspired concept for contemporary living, with home ideas, lifestyle spaces and a guide to the details that matter.' ogImage='/images/estate/residences-hero.jpg' />
    <main>
        <section className='estate-hero' aria-labelledby='hero-title'>
            <Image src='/images/estate/residences-hero.jpg' alt='Illustrative contemporary residences surrounded by greenery beside a reflecting pool' fill priority sizes='100vw' className='estate-hero__image' />
            <div className='estate-hero__shade' />
            <div className='estate-container estate-hero__content'>
                <div className='estate-hero__copy'>
                    <p className='estate-kicker estate-kicker--light'>A more considered way to live</p>
                    <h1 id='hero-title'>Come home<br />to <em>more.</em></h1>
                    <p className='estate-hero__lead'>A residential vision shaped around the moments that matter most.</p>
                    <Link href='/contact' className='estate-button estate-button--light'>Enquire now <ArrowRight size={18} aria-hidden='true' /></Link>
                </div>
                <a className='estate-hero__scroll' href='#overview'>Explore the vision <ArrowDown size={16} aria-hidden='true' /></a>
            </div>
            <div className='estate-hero__corner'>A new vision of home</div>
        </section>

        <section className='estate-intro estate-section' id='overview' aria-labelledby='overview-title'>
            <div className='estate-container estate-intro__grid'>
                <div><p className='estate-kicker'>The living experience</p><h2 id='overview-title' className='estate-display'>Life feels different<br />when it has <em>space.</em></h2></div>
                <div className='estate-intro__aside'><p>Imagine a home that gives you more than somewhere to be. A place for slow mornings, lively evenings and everything in between.</p><p className='estate-small-note'>This website is an illustrative concept. Project details will be added only when verified.</p><Link href='/contact' className='estate-text-link'>Share what you are looking for <MoveUpRight size={18} aria-hidden='true' /></Link></div>
            </div>
            <div className='estate-container estate-intro__divider'><span>Designed for living well</span><span>Explore the possibilities</span></div>
        </section>

        <section className='estate-image-story' id='residences' aria-labelledby='residences-title'>
            <div className='estate-image-story__visual'><Image src='/images/estate/residence-interior.jpg' alt='Illustrative sunlit residence living room opening onto a planted terrace' fill sizes='(max-width: 800px) 100vw, 60vw' /></div>
            <div className='estate-image-story__body'><p className='estate-kicker'>The residences</p><h2 id='residences-title' className='estate-display'>Every detail,<br /><em>in its place.</em></h2><p>Light-filled rooms, natural textures and an easy flow from inside to out. Spaces imagined to make the ordinary feel exceptional.</p><div className='estate-image-story__rule' /><div className='estate-image-story__features'><span>Thoughtful layouts</span><span>Natural light</span><span>Timeless materials</span></div><Link href='/contact' className='estate-text-link'>Ask about the residences <MoveUpRight size={18} aria-hidden='true' /></Link></div>
        </section>

        <section className='estate-gallery estate-section' id='gallery' aria-labelledby='gallery-title'><div className='estate-container'>
            <div className='estate-section-heading'><div><p className='estate-kicker'>Visual gallery</p><h2 id='gallery-title' className='estate-display'>A closer look at<br /><em>the feeling of home.</em></h2></div><p>Architecture, interiors and landscape come together in this visual study. All images are illustrative.</p></div>
            <div className='estate-gallery__grid'>
                <figure className='estate-gallery__item estate-gallery__item--1'><Image src='/images/estate/residences-hero.jpg' alt='Illustrative contemporary residential exterior beside a reflecting pool' fill sizes='(max-width: 700px) 100vw, 50vw' /><figcaption>The arrival <span>01 / 03</span></figcaption></figure>
                <figure className='estate-gallery__item estate-gallery__item--2'><Image src='/images/estate/residence-interior.jpg' alt='Illustrative sunlit living room with natural materials' fill sizes='(max-width: 700px) 100vw, 50vw' /><figcaption>The residence <span>02 / 03</span></figcaption></figure>
                <figure className='estate-gallery__item estate-gallery__item--3'><Image src='/images/estate/garden-courtyard.jpg' alt='Illustrative landscaped courtyard and water feature' fill sizes='(max-width: 700px) 100vw, 50vw' /><figcaption>The outdoors <span>03 / 03</span></figcaption></figure>
            </div>
        </div></section>

        <section className='estate-options estate-section' id='home-options' aria-labelledby='options-title'><div className='estate-container'>
            <div className='estate-section-heading'><div><p className='estate-kicker'>Explore the possibilities</p><h2 id='options-title' className='estate-display'>A home for<br /><em>every chapter.</em></h2></div><p>Three illustrative ways to think about space. Actual configurations, areas and availability need project confirmation.</p></div>
            <div className='estate-options__grid'>{homeOptions.map((option, index) => <article className='estate-option' key={option.type}><span className='estate-option__number'>0{index + 1} / HOME IDEA</span><div><p className='estate-option__type'>{option.type}</p><h3>{option.title}</h3><p>{option.description}</p></div><Link href='/contact' aria-label={`Ask about ${option.type.toLowerCase()} layouts`}><MoveUpRight size={19} aria-hidden='true' /></Link></article>)}</div>
            <p className='estate-disclaimer'>Illustrative home categories only. No unit type, size or price is represented as available for sale.</p>
        </div></section>

        <section className='estate-highlights estate-section' id='lifestyle' aria-labelledby='lifestyle-title'><div className='estate-container'><p className='estate-kicker'>Beyond your front door</p><h2 id='lifestyle-title' className='estate-display'>A little more room<br />for <em>everything.</em></h2><div className='estate-highlights__grid'>{highlights.map(item => <article className='estate-highlight' key={item.number}><span className='estate-highlight__number'>{item.number}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></div></section>

        <section className='estate-amenities estate-section' id='amenities' aria-labelledby='amenities-title'><div className='estate-container'>
            <div className='estate-section-heading'><div><p className='estate-kicker'>The lifestyle vision</p><h2 id='amenities-title' className='estate-display'>Space to do<br /><em>what moves you.</em></h2></div><p>A considered mix of shared spaces can make every day feel richer. These are ideas to explore, not a confirmed amenity list.</p></div>
            <div className='estate-amenities__grid'>{amenityIdeas.map((group, index) => <article className='estate-amenity' key={group.title}><span>0{index + 1}</span><h3>{group.title}</h3><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></article>)}</div>
        </div></section>

        <section className='estate-garden' aria-labelledby='garden-title'><Image src='/images/estate/garden-courtyard.jpg' alt='Illustrative landscaped garden courtyard and calm reflecting pool' fill sizes='100vw' /><div className='estate-garden__overlay' /><div className='estate-container estate-garden__content'><p className='estate-kicker estate-kicker--light'>Nature in every day</p><h2 id='garden-title'>Find your<br /><em>own pace.</em></h2><p>Green spaces, open air and places to pause bring balance to the rhythm of city life.</p></div></section>

        <section className='estate-plans estate-section' id='plans' aria-labelledby='plans-title'><div className='estate-container estate-plans__grid'>
            <div><p className='estate-kicker'>Master and floor plans</p><h2 id='plans-title' className='estate-display'>See how a home<br /><em>could work for you.</em></h2><p>Room sizes, circulation and outlook can change how a residence feels. Review the latest approved plan before choosing a home.</p><Link href='/contact' className='estate-text-link'>Request verified details <MoveUpRight size={18} aria-hidden='true' /></Link></div>
            <div className='estate-plans__panel'><span className='estate-plans__eyebrow'>A useful plan review</span><div><span>01</span><p>Compare room proportions and furniture space.</p></div><div><span>02</span><p>Check light, ventilation and balcony orientation.</p></div><div><span>03</span><p>Match the plan to approved project documents.</p></div><p className='estate-plans__note'>No project floor plan is published on this concept site.</p></div>
        </div></section>

        <section className='estate-location estate-section' id='location' aria-labelledby='location-title'><div className='estate-container estate-location__grid'><div><p className='estate-kicker'>The address</p><h2 id='location-title' className='estate-display'>At the centre of<br /><em>your world.</em></h2></div><div className='estate-location__copy'><p>The right address makes room for both the energy of the city and the comfort of coming home.</p><p className='estate-location__note'>A specific project location and map will be shown only when confirmed.</p><Link href='/contact' className='estate-text-link'>Ask about the location <MoveUpRight size={18} aria-hidden='true' /></Link></div></div></section>

        <section className='estate-connectivity estate-section' id='connectivity' aria-labelledby='connectivity-title'><div className='estate-container'>
            <div className='estate-section-heading'><div><p className='estate-kicker'>Connected living</p><h2 id='connectivity-title' className='estate-display'>Close to what<br /><em>matters to you.</em></h2></div><p>When an address is confirmed, these are the connections worth checking in person and on a current map.</p></div>
            <div className='estate-connectivity__grid'>{connections.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
        </div></section>

        <section className='estate-specs estate-section' id='specifications' aria-labelledby='specs-title'><div className='estate-container'>
            <div className='estate-section-heading'><div><p className='estate-kicker'>The details that matter</p><h2 id='specs-title' className='estate-display'>Built around<br /><em>better questions.</em></h2></div><p>Specifications shape long term comfort. Use these topics to compare the final, published schedule for any home you consider.</p></div>
            <div className='estate-specs__grid'>{specifications.map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div>
        </div></section>

        <section className='estate-reasons estate-section' id='reasons' aria-labelledby='reasons-title'><div className='estate-container'>
            <p className='estate-kicker estate-kicker--light'>A considered choice</p><h2 id='reasons-title'>A good home starts<br />with <em>the right questions.</em></h2>
            <div className='estate-reasons__grid'>{reasons.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
        </div></section>

        <section className='estate-checklist estate-section' id='before-you-decide' aria-labelledby='checklist-title'><div className='estate-container estate-checklist__grid'><div><p className='estate-kicker'>Before you decide</p><h2 id='checklist-title' className='estate-display'>Know the details.<br /><em>Feel at home.</em></h2></div><div><p>For any property, ask for the current project brochure, exact address, approved plans, registration details, payment schedule and complete cost sheet. Compare them with the home shown to you.</p><p>Images on this site are illustrative and cannot replace those documents.</p><Link href='/contact' className='estate-text-link'>Start with a question <MoveUpRight size={18} aria-hidden='true' /></Link></div></div></section>

        <section className='estate-faq estate-section' id='faq' aria-labelledby='faq-title'><div className='estate-container estate-faq__grid'><div><p className='estate-kicker'>Frequently asked questions</p><h2 id='faq-title' className='estate-display'>Good questions,<br /><em>clear answers.</em></h2><p>Important details should be easy to find and easy to verify.</p></div><div className='estate-faq__list'>{questions.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden='true'>+</span></summary><p>{item.answer}</p></details>)}</div></div></section>

        <section className='estate-cta' aria-labelledby='cta-title'><div className='estate-container estate-cta__inner'><div><p className='estate-kicker estate-kicker--light'>Start a conversation</p><h2 id='cta-title'>Your next chapter<br /><em>starts here.</em></h2></div><Link href='/contact' className='estate-button estate-button--light'>Contact us <ArrowRight size={18} aria-hidden='true' /></Link></div></section>
    </main>
</EstateShell>

export default Home
