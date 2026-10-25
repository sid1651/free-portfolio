import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight, MoveUpRight } from 'lucide-react'
import { Seo } from '@/components/generals/seo'
import { EstateShell } from '@/components/estate/estate-shell'

const pillars = [
    { title: 'Industry & enterprise', body: 'Manufacturing, services, research and commercial activity shape the business city vision.' },
    { title: 'Movement & logistics', body: 'Road, rail and proposed multimodal connections form part of the wider township story.' },
    { title: 'A complete city', body: 'Residential areas, open space, utilities and places to work appear together in the land use material.' }
]
const landUses = [
    { title: 'Places to work', body: 'Industrial, research, technology and commercial uses appear in the presentation legend.' },
    { title: 'Places to live', body: 'The land use diagrams also mark residential and group housing areas.' },
    { title: 'Space between', body: 'Open spaces, utilities and internal roads connect different parts of the plan.' }
]
const homeTypes = [
    { type: '1 BHK', title: 'A place to begin', body: 'The housing schedule includes Grande and Luxe one bedroom typologies.' },
    { type: '2 BHK', title: 'Room for more', body: 'Two bedroom and two bedroom plus study typologies appear in the presentation.' },
    { type: '3 BHK', title: 'Space to grow', body: 'The schedule lists multiple three bedroom configurations, including study options.' }
]
const connections = [
    { title: 'The regional road network', body: 'The deck places the township in a Greater Noida and Eastern Peripheral Expressway context. Check a current map for your route.' },
    { title: 'Rail & transit proposals', body: 'The presentations discuss Boraki, rail, metro and a multimodal transport hub. Confirm the current status of each.' },
    { title: 'Freight & logistics', body: 'A multimodal logistics hub and freight corridors are featured in the supplied DMIC story.' }
]
const questions = [
    { question: 'Is this an official Godrej Properties project website?', answer: 'This is an independent website concept using the brand name provided for this build. The two supplied Global Business City presentations are the source of the project story and imagery. Confirm any project association through official channels.' },
    { question: 'Are the images of the exact property?', answer: 'The decks contain location diagrams, photographs and illustrative city imagery. They do not establish the appearance of a particular home or finished development.' },
    { question: 'Are the home types available now?', answer: 'The presentations include one, two and three bedroom typologies. Availability, approved plans, final areas and specifications have not been independently confirmed.' },
    { question: 'Where are the prices and payment details?', answer: 'The decks include a price and cheque amount table, but its date and current validity are unconfirmed. Ask for a current official cost sheet and payment schedule.' },
    { question: 'Is the transport infrastructure complete?', answer: 'The decks combine existing images with proposed and planned infrastructure. Check present status and travel time using current official sources and a site visit.' },
    { question: 'What should I verify before enquiring?', answer: 'Ask for the project legal name, developer association, exact site, RERA registration, approved plans, current availability, total price and payment terms.' }
]
const plans = [
    'Match the exact unit type and area.',
    'Check orientation, circulation and access.',
    'Compare drawings with approvals and the cost sheet.'
]

const Home = () => <EstateShell home>
    <Seo title='Global Business City, Greater Noida' description='Explore the Global Business City vision in Greater Noida through the supplied presentations: township planning, connectivity, business ecosystem and indicative home typologies.' ogImage='/images/estate/gbc-aerial.webp' />
    <main>
        <section className='estate-hero gbc-hero' aria-labelledby='hero-title'>
            <Image src='/images/estate/gbc-aerial.webp' alt='Aerial industrial district image from the supplied master presentation' fill priority sizes='100vw' className='estate-hero__image' />
            <div className='estate-hero__shade' />
            <div className='estate-container estate-hero__content'><div className='estate-hero__copy'>
                <p className='estate-kicker estate-kicker--light'>Greater Noida · DMIC corridor</p>
                <h1 id='hero-title'>Global<br />Business <em>City.</em></h1>
                <p className='estate-hero__lead'>A presentation led look at a district imagined for enterprise, connection and life.</p>
                <Link href='/contact' className='estate-button estate-button--light'>Enquire now <ArrowRight size={18} aria-hidden='true' /></Link>
            </div><a className='estate-hero__scroll' href='#overview'>Explore the vision <ArrowDown size={16} aria-hidden='true' /></a></div>
            <div className='estate-hero__corner'>Greater Noida, Uttar Pradesh</div>
        </section>

        <section className='estate-intro estate-section' id='overview' aria-labelledby='overview-title'><div className='estate-container estate-intro__grid'>
            <div><p className='estate-kicker'>The big picture</p><h2 id='overview-title' className='estate-display'>A city shaped<br />around <em>possibility.</em></h2></div>
            <div className='estate-intro__aside'><p>Global Business City is presented as a modern business ecosystem within the Greater Noida and DMIC landscape, bringing commercial activity, infrastructure and urban life into one larger vision.</p><p className='estate-small-note'>This independent concept draws from the two presentations supplied for the site. Maps, imagery and proposals need current official confirmation.</p><Link href='/contact' className='estate-text-link'>Ask for project details <MoveUpRight size={18} aria-hidden='true' /></Link></div>
        </div><div className='estate-container estate-intro__divider'><span>Business · infrastructure · community</span><span>Source: supplied presentations</span></div></section>

        <section className='estate-image-story' id='vision' aria-labelledby='vision-title'><div className='estate-image-story__visual'><Image src='/images/estate/gbc-district.webp' alt='Business district illustration from the supplied master presentation' fill sizes='(max-width: 800px) 100vw, 55vw' /></div><div className='estate-image-story__body'><p className='estate-kicker'>The township vision</p><h2 id='vision-title' className='estate-display'>Made for<br /><em>what comes next.</em></h2><p>The master presentation connects manufacturing and services with planned urban development. It describes a place where working, moving and living can grow together.</p><div className='estate-image-story__rule' /><div className='estate-image-story__features'><span>Enterprise</span><span>Urban planning</span><span>Everyday life</span></div><Link href='#ecosystem' className='estate-text-link'>Explore the ecosystem <MoveUpRight size={18} aria-hidden='true' /></Link></div></section>

        <section className='estate-highlights estate-section' id='ecosystem' aria-labelledby='ecosystem-title'><div className='estate-container'><p className='estate-kicker'>One connected ecosystem</p><h2 id='ecosystem-title' className='estate-display'>More than a<br /><em>single address.</em></h2><div className='estate-highlights__grid'>{pillars.map((item, index) => <article className='estate-highlight' key={item.title}><span className='estate-highlight__number'>0{index + 1}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></div></section>

        <section className='gbc-map-section estate-section' id='master-plan' aria-labelledby='master-title'><div className='estate-container'><div className='estate-section-heading'><div><p className='estate-kicker'>The wider plan</p><h2 id='master-title' className='estate-display'>See the city<br /><em>in context.</em></h2></div><p>The supplied deck maps the township against nearby roads, rail and industrial parcels. Request a current approved plan for exact boundaries.</p></div><figure className='gbc-slide'><Image src='/images/estate/gbc-location-map.webp' alt='Location diagram from the supplied deck, with its original contact watermark' width={1800} height={1013} sizes='(max-width: 800px) 100vw, 88vw' /><figcaption>Presentation location diagram · original slide watermark retained</figcaption></figure></div></section>

        <section className='estate-location estate-section' id='location' aria-labelledby='location-title'><div className='estate-container estate-location__grid'><div><p className='estate-kicker'>Greater Noida</p><h2 id='location-title' className='estate-display'>An address in<br /><em>motion.</em></h2></div><div className='estate-location__copy'><p>The presentations position Global Business City within the Delhi–Mumbai Industrial Corridor conversation and Greater Noida’s expanding industrial landscape.</p><p className='estate-location__note'>A marketing map is a guide, not a surveyed site boundary or proof of access.</p><Link href='/contact' className='estate-text-link'>Request the exact location <MoveUpRight size={18} aria-hidden='true' /></Link></div></div></section>

        <section className='gbc-land-use estate-section' id='land-use' aria-labelledby='land-use-title'><div className='estate-container'><div className='estate-section-heading'><div><p className='estate-kicker'>A mixed use vision</p><h2 id='land-use-title' className='estate-display'>Designed as<br /><em>a whole city.</em></h2></div><p>The deck’s land use legend brings work, housing, green space and essential services into the same planning story.</p></div><div className='gbc-land-use__grid'><figure className='gbc-slide'><Image src='/images/estate/gbc-land-use.webp' alt='Land use diagram from the supplied deck, with original contact watermark' width={1800} height={1013} sizes='(max-width: 800px) 100vw, 60vw' /><figcaption>Presentation land use diagram · confirm with the latest approved plan</figcaption></figure><div className='gbc-land-use__list'>{landUses.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></div></div></section>

        <section className='estate-gallery estate-section' id='gallery' aria-labelledby='gallery-title'><div className='estate-container'><div className='estate-section-heading'><div><p className='estate-kicker'>From the presentations</p><h2 id='gallery-title' className='estate-display'>A closer look<br /><em>at the vision.</em></h2></div><p>Selected visuals from the supplied files. These include illustrative district imagery and a deck photograph; they are not a verified gallery of the proposed homes.</p></div><div className='estate-gallery__grid'><figure className='estate-gallery__item estate-gallery__item--1'><Image src='/images/estate/gbc-industry.webp' alt='Aerial industrial district image from the master presentation' fill sizes='(max-width: 700px) 100vw, 50vw' /><figcaption>Industry <span>01 / 03</span></figcaption></figure><figure className='estate-gallery__item estate-gallery__item--2'><Image src='/images/estate/gbc-tower.webp' alt='Glass office tower image from the master presentation' fill sizes='(max-width: 700px) 100vw, 40vw' /><figcaption>Commerce <span>02 / 03</span></figcaption></figure><figure className='estate-gallery__item estate-gallery__item--3'><Image src='/images/estate/gbc-road.webp' alt='Road infrastructure slide from the supplied deck with original watermark' fill sizes='(max-width: 700px) 100vw, 40vw' /><figcaption>Connection <span>03 / 03</span></figcaption></figure></div></div></section>

        <section className='estate-amenities estate-section' id='infrastructure' aria-labelledby='infrastructure-title'><div className='estate-container'><div className='estate-section-heading'><div><p className='estate-kicker'>Infrastructure themes</p><h2 id='infrastructure-title' className='estate-display'>Built around<br /><em>the essentials.</em></h2></div><p>The master presentation highlights the systems a functioning township needs. These are themes in the material, not completion claims.</p></div><div className='estate-amenities__grid'>{[['Power & utilities','Capacity for a working district'],['Water & services','The foundations of daily life'],['Transport links','Movement within the wider region'],['Skills & jobs','A workforce close to opportunity']].map(([title,detail], index) => <article className='estate-amenity' key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{detail}</p></article>)}</div></div></section>

        <section className='gbc-photo-band' aria-labelledby='photo-title'><Image src='/images/estate/gbc-haier.webp' alt='Haier facility slide supplied in the deck, with original contact watermark and caption' fill sizes='100vw' /><div className='gbc-photo-band__shade' /><div className='estate-container gbc-photo-band__content'><p className='estate-kicker estate-kicker--light'>An industrial landscape</p><h2 id='photo-title'>Where enterprise<br /><em>takes shape.</em></h2><p>Photograph as supplied in the deck. Its site and acreage claims have not been independently verified.</p></div></section>

        <section className='estate-connectivity estate-section' id='connectivity' aria-labelledby='connectivity-title'><div className='estate-container'><div className='estate-section-heading'><div><p className='estate-kicker'>Movement & access</p><h2 id='connectivity-title' className='estate-display'>Connected to<br /><em>the bigger picture.</em></h2></div><p>Roads, transport proposals and logistics connections feature throughout both presentations. Their current status should be checked before relying on them.</p></div><div className='estate-connectivity__grid'>{connections.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></div></section>

        <section className='estate-options estate-section' id='home-options' aria-labelledby='options-title'><div className='estate-container'><div className='estate-section-heading'><div><p className='estate-kicker'>Housing in the supplied deck</p><h2 id='options-title' className='estate-display'>Room for<br /><em>every chapter.</em></h2></div><p>The decks include a housing schedule alongside the business city story. Treat it as indicative until a current official brochure confirms the project and inventory.</p></div><div className='estate-options__grid'>{homeTypes.map((option,index) => <article className='estate-option' key={option.type}><span className='estate-option__number'>0{index + 1} / PRESENTATION TYPE</span><div><p className='estate-option__type'>{option.type}</p><h3>{option.title}</h3><p>{option.body}</p></div><Link href='/contact' aria-label={`Ask about ${option.type} availability`}><MoveUpRight size={19} aria-hidden='true' /></Link></article>)}</div><p className='estate-disclaimer'>Typologies appear in the supplied presentations. Availability, sizes, plans and prices require current official confirmation.</p></div></section>

        <section className='estate-plans estate-section' id='plans' aria-labelledby='plans-title'><div className='estate-container estate-plans__grid'><div><p className='estate-kicker'>Before choosing a home</p><h2 id='plans-title' className='estate-display'>The plan matters<br /><em>as much as the place.</em></h2><p>A township diagram shows context. A unit floor plan shows the home. Ask for both in their approved, current versions before comparing options.</p><Link href='/contact' className='estate-text-link'>Request verified plans <MoveUpRight size={18} aria-hidden='true' /></Link></div><div className='estate-plans__panel'><span className='estate-plans__eyebrow'>A useful plan review</span>{plans.map((plan,index) => <div key={plan}><span>0{index + 1}</span><p>{plan}</p></div>)}<p className='estate-plans__note'>No approved residential floor plan was included in the supplied decks.</p></div></div></section>

        <section className='estate-checklist estate-section' id='before-you-decide' aria-labelledby='checklist-title'><div className='estate-container estate-checklist__grid'><div><p className='estate-kicker'>A clear next step</p><h2 id='checklist-title' className='estate-display'>Know the facts.<br /><em>Then decide.</em></h2></div><div><p>Ask for the legal project name, developer association, exact address, RERA registration, approved site and floor plans, available inventory, current cost sheet and payment schedule.</p><p>Both decks introduce the vision. Their projections and marketing figures do not replace those documents.</p><Link href='/contact' className='estate-text-link'>Make an enquiry <MoveUpRight size={18} aria-hidden='true' /></Link></div></div></section>

        <section className='estate-faq estate-section' id='faq' aria-labelledby='faq-title'><div className='estate-container estate-faq__grid'><div><p className='estate-kicker'>Frequently asked questions</p><h2 id='faq-title' className='estate-display'>Good questions,<br /><em>clear answers.</em></h2><p>What the supplied material shows, and what still needs confirmation.</p></div><div className='estate-faq__list'>{questions.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden='true'>+</span></summary><p>{item.answer}</p></details>)}</div></div></section>

        <section className='estate-cta' aria-labelledby='cta-title'><div className='estate-container estate-cta__inner'><div><p className='estate-kicker estate-kicker--light'>Start a conversation</p><h2 id='cta-title'>Explore what<br /><em>comes next.</em></h2></div><Link href='/contact' className='estate-button estate-button--light'>Contact us <ArrowRight size={18} aria-hidden='true' /></Link></div></section>
    </main>
</EstateShell>

export default Home
