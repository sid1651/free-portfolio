import Link from 'next/link'
import { Seo } from '@/components/generals/seo'
import { EstateShell } from '@/components/estate/estate-shell'

export default function ServerError() { return <EstateShell><Seo title='Something went wrong' /><main className='estate-message-page estate-container'><p className='estate-kicker'>A temporary issue</p><h1>Let’s try<br /><em>that again.</em></h1><p>We couldn’t load this page right now.</p><Link href='/' className='estate-button estate-button--green'>Back to home</Link></main></EstateShell> }
