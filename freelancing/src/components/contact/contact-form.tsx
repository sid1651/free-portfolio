import type { FC, FormEvent, ReactNode } from 'react'

import { useMemo, useState } from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { AcidButton } from '@/components/generals/acid-button'

type Status = 'idle' | 'draft'

interface FieldProps {
    id: string
    name: string
    placeholder: string
    type?: string
    textarea?: boolean
    value: string
    onChange: (value: string) => void
}

const Field: FC<FieldProps> = ({
    id,
    name,
    placeholder,
    type = 'text',
    textarea = false,
    value,
    onChange
}): ReactNode => {
    const [focused, setFocused] = useState(false)

    const shared = {
        id,
        name,
        required: true,
        value,
        onFocus: () => setFocused(true),
        onBlur: () => setFocused(false),
        onChange: (
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => onChange(event.target.value),
        className:
            'w-full bg-transparent pb-3 pt-6 text-[16px] font-semibold uppercase tracking-[-0.04em] text-bone outline-none placeholder:text-smoke/70'
    }

    return (
        <div className='relative'>
            <label htmlFor={id} className='sr-only'>
                {placeholder}
            </label>

            {textarea ? (
                <textarea {...shared} rows={4} placeholder={placeholder} />
            ) : (
                <input {...shared} type={type} placeholder={placeholder} />
            )}

            <span
                aria-hidden='true'
                className='absolute inset-x-0 bottom-0 block h-px bg-smoke/40'
            />

            <span
                aria-hidden='true'
                className={cn(
                    'absolute inset-x-0 bottom-0 block h-[2px] origin-left bg-acid transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                    focused || value ? 'scale-x-100' : 'scale-x-0'
                )}
            />
        </div>
    )
}

export const ContactForm: FC = (): ReactNode => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState<Status>('idle')

    const ready = useMemo(
        () =>
            name.trim().length > 1 &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
            message.trim().length > 4,
        [name, email, message]
    )

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!ready) return

        const subject = encodeURIComponent(`Portfolio enquiry from ${name.trim()}`)
        const body = encodeURIComponent(`${message.trim()}\n\nFrom: ${name.trim()}\nReply to: ${email.trim()}`)
        window.location.href = `mailto:siddharthnarva@gmail.com?subject=${subject}&body=${body}`
        setStatus('draft')
    }

    return (
        <form onSubmit={onSubmit} noValidate className='w-full'>
            <div className='flex flex-col gap-5'>
                <div data-field>
                    <Field
                        id='contact-name'
                        name='name'
                        placeholder='YOUR NAME'
                        value={name}
                        onChange={setName}
                    />
                </div>

                <div data-field>
                    <Field
                        id='contact-email'
                        name='email'
                        type='email'
                        placeholder='YOUR EMAIL'
                        value={email}
                        onChange={setEmail}
                    />
                </div>

                <div data-field>
                    <Field
                        id='contact-message'
                        name='message'
                        placeholder='MESSAGE'
                        textarea
                        value={message}
                        onChange={setMessage}
                    />
                </div>
            </div>

            <div className='mt-9 flex flex-col gap-5 sm:flex-row sm:items-center'>
                <AcidButton
                    type='submit'
                    label={status === 'draft' ? 'Open draft again' : 'Open email draft'}
                    disabled={!ready}
                />

                <p className='max-w-[38ch] text-[12px] font-semibold leading-[1.35] tracking-[-0.03em] text-ash'>
                    This opens your email app. Read my{' '}
                    <Link
                        href='/privacy-policy'
                        className='underline underline-offset-2 transition-colors duration-300 hover:text-acid'
                    >
                        Privacy Policy.
                    </Link>
                </p>
            </div>

            <p
                aria-live='polite'
                className={cn(
                    'mt-5 text-[14px] font-semibold tracking-[-0.03em] transition-opacity duration-500',
                    status === 'draft' ? 'text-acid' : 'opacity-0'
                )}
            >
                {status === 'draft' ? 'Email draft opened. Send it from your email app to finish.' : 'placeholder'}
            </p>
        </form>
    )
}
