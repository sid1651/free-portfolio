import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'

type EstateShellProps = { children: ReactNode, home?: boolean }
const links = [{ label: 'Overview', href: '/#overview' }, { label: 'Residences', href: '/#residences' }, { label: 'Lifestyle', href: '/#lifestyle' }, { label: 'Location', href: '/#location' }]

export const EstateShell = ({ children, home = false }: EstateShellProps) => {
    const [menuOpen, setMenuOpen] = useState(false)
    return <div className={`estate-app ${home ? 'estate-app--home' : 'estate-app--inner'}`}>
        <header className='estate-header'><div className='estate-container estate-header__inner'>
            <Link href='/' className='estate-brand' aria-label='Godrej Properties, home' onClick={() => setMenuOpen(false)}><span className='estate-brand__mark' aria-hidden='true'>G</span><span className='estate-brand__word'>GODREJ<span>PROPERTIES</span></span></Link>
            <nav className={`estate-nav ${menuOpen ? 'estate-nav--open' : ''}`} aria-label='Main navigation'>{links.map(link => <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</Link>)}<Link href='/contact' className='estate-nav__mobile-contact' onClick={() => setMenuOpen(false)}>Contact us</Link></nav>
            <Link href='/contact' className='estate-header__contact'>Contact us <ArrowUpRight size={17} aria-hidden='true' /></Link>
            <button type='button' className='estate-header__menu' aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={25} /> : <Menu size={25} />}</button>
        </div></header>
        {children}
        <footer className='estate-footer'><div className='estate-container'><div className='estate-footer__top'><div><p className='estate-footer__brand'>GODREJ PROPERTIES</p><p>Space for a life well lived.</p></div><div className='estate-footer__links'><Link href='/'>Home</Link><Link href='/contact'>Contact</Link></div></div><div className='estate-footer__bottom'><span>© {new Date().getFullYear()} Godrej Properties</span><span>Independent concept site. Details and imagery are illustrative.</span></div></div></footer>
    </div>
}
