import type { ChangeEvent, FC, FormEvent, ReactNode } from 'react'

import { ArrowUpRight, Check, Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '@/lib/motion/gsap'
import { cn } from '@/lib/utils'
import { Magnetic } from '@/components/generals/magnetic'
import { contactPageContent } from '@/constants/content'
import { siteConfig } from '@/constants/site'

type Status = 'idle' | 'submitting' | 'success' | 'error'

type FormState = {
    name: string
    email: string
    phone: string
    message: string
    interests: string[]
    company: string
}

const emptyForm: FormState = {
    name: '',
    email: '',
    phone: '',
    message: '',
    interests: [],
    company: ''
}

const inlineField = 'mx-1 inline-block max-w-full border-0 border-b-2 border-ink/25 bg-transparent px-1 pb-1 align-baseline font-serif italic text-ink placeholder:text-ink/30 focus:border-ink focus:outline-none focus-visible:outline-none'

/**
 * The inquiry form written as a letter: visitors fill in the blanks of a sentence.
 * Submissions are stored and forwarded to the studio by email.
 */
export const InquiryForm: FC = (): ReactNode => {
    const [form, setForm] = useState<FormState>(emptyForm)
    const [status, setStatus] = useState<Status>('idle')
    const [error, setError] = useState('')
    const successRef = useRef<HTMLDivElement>(null)

    const update = (field: keyof Omit<FormState, 'interests'>) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setForm(current => ({ ...current, [field]: event.target.value }))
    }

    const toggleInterest = (interest: string): void => {
        setForm(current => ({
            ...current,
            interests: current.interests.includes(interest)
                ? current.interests.filter(item => item !== interest)
                : [...current.interests, interest]
        }))
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        if (!form.name.trim()) {
            setStatus('error')
            setError('Please tell us your name.')
            return
        }

        if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(form.email.trim())) {
            setStatus('error')
            setError('Please enter a valid email address.')
            return
        }

        setStatus('submitting')
        setError('')

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })

            const result = (await response.json().catch(() => null)) as { ok?: boolean, message?: string } | null

            if (!response.ok || !result?.ok) {
                setStatus('error')
                setError(result?.message ?? 'Something went wrong. Please try again.')
                return
            }

            setStatus('success')
            setForm(emptyForm)

            requestAnimationFrame(() => {
                const success = successRef.current
                if (!success) return

                success.focus()

                if (!prefersReducedMotion()) {
                    gsap.from(success.querySelectorAll('[data-success-line]'), { yPercent: 110, duration: 1.2, stagger: 0.08, ease: 'expo.out' })
                }
            })
        }
        catch {
            setStatus('error')
            setError(`We could not reach the studio. Please email ${siteConfig.email} instead.`)
        }
    }

    if (status === 'success') {
        return (
            <div ref={successRef} tabIndex={-1} className='flex flex-col items-start gap-10 py-10 outline-none' role='status'>
                <span className='flex size-16 items-center justify-center rounded-full bg-ink text-bone'>
                    <Check className='size-7' aria-hidden='true' />
                </span>

                <h3 className='font-wide text-[clamp(2.4rem,6vw,6rem)] font-semibold uppercase leading-[0.88] tracking-[-0.05em]'>
                    <span className='block overflow-hidden'>
                        <span className='block' data-success-line=''>Message</span>
                    </span>
                    <span className='block overflow-hidden'>
                        <span className='block font-serif font-normal normal-case italic tracking-[-0.02em]' data-success-line=''>received.</span>
                    </span>
                </h3>

                <p className='max-w-lg text-lead text-ink/80'>
                    Thank you for reaching out. A producer from the studio will reply within 48 hours, Monday to Friday.
                </p>

                <button
                    type='button'
                    onClick={() => setStatus('idle')}
                    className='link-underline text-sm font-medium'
                >
                    Send another message
                </button>
            </div>
        )
    }

    const submitting = status === 'submitting'

    return (
        <form onSubmit={handleSubmit} noValidate className='flex flex-col gap-14' aria-describedby='inquiry-intro'>
            <p id='inquiry-intro' className='sr-only'>
                Fill in the sentence below to send NOVAIR Studio a project inquiry. Name and email are required.
            </p>

            <div className='text-[clamp(1.6rem,3.3vw,3.4rem)] font-medium leading-[1.55] tracking-[-0.03em]'>
                <span>Hello NOVAIR, my name is</span>
                <label htmlFor='inquiry-name' className='sr-only'>Your name (required)</label>
                <input
                    id='inquiry-name'
                    name='name'
                    type='text'
                    autoComplete='name'
                    required
                    aria-required='true'
                    value={form.name}
                    onChange={update('name')}
                    placeholder='your name'
                    className={cn(inlineField, 'w-[7.5em]')}
                />
                <span>and you can reach me at</span>
                <label htmlFor='inquiry-email' className='sr-only'>Your email (required)</label>
                <input
                    id='inquiry-email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    aria-required='true'
                    value={form.email}
                    onChange={update('email')}
                    placeholder='you@brand.com'
                    className={cn(inlineField, 'w-[10.5em]')}
                />
                <span>or on</span>
                <label htmlFor='inquiry-phone' className='sr-only'>Your phone number (optional)</label>
                <input
                    id='inquiry-phone'
                    name='phone'
                    type='tel'
                    autoComplete='tel'
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder='your number'
                    className={cn(inlineField, 'w-[7.5em]')}
                />
                <span>. I would love to create</span>
            </div>

            <fieldset className='flex flex-col gap-5'>
                <legend className='eyebrow mb-5 text-stone-deep'>
                    Pick everything that applies
                </legend>

                <div className='flex flex-wrap gap-3'>
                    {contactPageContent.interests.map(interest => {
                        const checked = form.interests.includes(interest)

                        return (
                            <label key={interest} className='cursor-pointer'>
                                <input
                                    type='checkbox'
                                    name='interests'
                                    value={interest}
                                    checked={checked}
                                    onChange={() => toggleInterest(interest)}
                                    className='peer sr-only'
                                />
                                <span
                                    className={cn(
                                        'flex h-12 items-center gap-2 rounded-full border px-5 text-base transition-colors duration-300 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-flare md:h-14 md:px-6 md:text-lg',
                                        checked ? 'border-ink bg-ink text-bone' : 'border-ink/25 text-ink hover:border-ink'
                                    )}
                                >
                                    {checked && <Check className='size-4' aria-hidden='true' />}
                                    {interest}
                                </span>
                            </label>
                        )
                    })}
                </div>
            </fieldset>

            <div className='flex flex-col gap-4'>
                <label htmlFor='inquiry-message' className='text-[clamp(1.6rem,3.3vw,3.4rem)] font-medium leading-tight tracking-[-0.03em]'>
                    Here is the idea:
                </label>
                <textarea
                    id='inquiry-message'
                    name='message'
                    rows={4}
                    value={form.message}
                    onChange={update('message')}
                    placeholder='Tell us about your brand, campaign, or vision...'
                    className='w-full resize-y border-0 border-b-2 border-ink/25 bg-transparent pb-3 font-serif text-[clamp(1.4rem,2.4vw,2.2rem)] italic leading-snug text-ink placeholder:text-ink/30 focus:border-ink focus:outline-none'
                />
            </div>

            <div className='hidden' aria-hidden='true'>
                <label htmlFor='inquiry-company'>Company</label>
                <input
                    id='inquiry-company'
                    name='company'
                    type='text'
                    tabIndex={-1}
                    autoComplete='off'
                    value={form.company}
                    onChange={update('company')}
                />
            </div>

            {status === 'error' && error && (
                <p role='alert' className='rounded-md border border-[#b3261e]/30 bg-[#b3261e]/10 px-4 py-3 text-sm text-[#8c1d18]'>
                    {error}
                </p>
            )}

            <div className='flex flex-col gap-6 border-t border-ink/15 pt-10 sm:flex-row sm:items-center sm:justify-between'>
                <p className='max-w-xs text-sm leading-relaxed text-ink/70'>
                    {contactPageContent.replyNote}. Your details are only used to answer this inquiry.
                </p>

                <Magnetic strength={0.22}>
                    <button
                        type='submit'
                        disabled={submitting}
                        data-cursor='Send'
                        className='group flex size-36 flex-col items-center justify-center gap-2 rounded-full bg-ink text-bone transition-[transform,translate,scale,rotate,background-color] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-105 hover:bg-flare hover:text-ink disabled:cursor-wait disabled:opacity-70 md:size-44'
                    >
                        {submitting
                            ? <Loader2 className='size-6 animate-spin' aria-hidden='true' />
                            : <ArrowUpRight className='size-6 transition-transform duration-500 group-hover:rotate-45' aria-hidden='true' />}
                        <span className='font-wide text-sm font-semibold uppercase'>
                            {submitting ? 'Sending' : contactPageContent.submit}
                        </span>
                    </button>
                </Magnetic>
            </div>
        </form>
    )
}
