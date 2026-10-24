import { useState, type FormEvent, type ChangeEvent } from 'react'
import { ArrowRight } from 'lucide-react'

type FormState = { name: string, email: string, phone: string, interest: string, message: string, company: string }
const initial: FormState = { name: '', email: '', phone: '', interest: '', message: '', company: '' }

export const EstateContactForm = () => {
    const [form, setForm] = useState<FormState>(initial)
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
    const [error, setError] = useState('')
    const update = (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { setForm(previous => ({ ...previous, [field]: event.target.value })); if (status === 'error') setStatus('idle') }

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); setStatus('sending'); setError('')
        try {
            const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
            const result = await response.json()
            if (!response.ok || !result.ok) throw new Error(result.message || 'Your enquiry could not be sent. Please try again.')
            setForm(initial); setStatus('sent')
        } catch (cause) { setError(cause instanceof Error ? cause.message : 'Your enquiry could not be sent. Please try again.'); setStatus('error') }
    }

    return <form className='estate-form' onSubmit={submit}>
        <div className='estate-form__row'><label>Full name <span>*</span><input name='name' type='text' autoComplete='name' required maxLength={120} value={form.name} onChange={update('name')} placeholder='Your name' /></label><label>Email address <span>*</span><input name='email' type='email' autoComplete='email' required maxLength={200} value={form.email} onChange={update('email')} placeholder='you@example.com' /></label></div>
        <div className='estate-form__row'><label>Phone number <span>*</span><input name='phone' type='tel' autoComplete='tel' required maxLength={40} pattern='[0-9+().\-\s]{7,40}' value={form.phone} onChange={update('phone')} placeholder='+91 98765 43210' /></label><label>Interested in <select name='interest' value={form.interest} onChange={update('interest')}><option value=''>Select an option</option><option value='A new home'>A new home</option><option value='Project information'>Project information</option><option value='A conversation'>A conversation</option></select></label></div>
        <label>Your message <textarea name='message' rows={4} maxLength={2000} value={form.message} onChange={update('message')} placeholder='Tell us what you’re looking for...' /></label>
        <label className='estate-form__honeypot' aria-hidden='true'>Company<input name='company' tabIndex={-1} autoComplete='off' value={form.company} onChange={update('company')} /></label>
        <p className='estate-form__privacy'>We’ll use your details only to respond to your enquiry.</p>
        {status === 'sent' && <p className='estate-form__feedback estate-form__feedback--success' role='status'>Thank you. Your enquiry has been sent.</p>}
        {status === 'error' && <p className='estate-form__feedback estate-form__feedback--error' role='alert'>{error}</p>}
        <button className='estate-button estate-button--green' type='submit' disabled={status === 'sending'}>{status === 'sending' ? 'Sending...' : 'Send enquiry'} <ArrowRight size={18} aria-hidden='true' /></button>
    </form>
}
