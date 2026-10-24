import Link from 'next/link'
import { Seo } from '@/components/generals/seo'
import { EstateShell } from '@/components/estate/estate-shell'

export default function NotFound() { return <EstateShell><Seo title='Page not found' /><main className='estate-message-page estate-container'><p className='estate-kicker'>404 / Page not found</p><h1>This place isn’t<br /><em>quite ready.</em></h1><p>The page you’re looking for is unavailable.</p><Link href='/' className='estate-button estate-button--green'>Back to home</Link></main></EstateShell> }
