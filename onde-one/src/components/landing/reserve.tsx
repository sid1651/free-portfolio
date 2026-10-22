import type { FC, FormEvent, ReactNode } from 'react'
import type { FinishId } from '@/types'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { gsap, useGSAP } from '@/lib/gsap'
import { Eyebrow } from '@/components/landing/section-heading'
import { SwatchDot } from '@/components/landing/finish-swatches'
import { LazyHeadphonesStage } from '@/components/landing/showcase/lazy-stage'
import { FINISHES, PRICE } from '@/constants/site'

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface ReserveFormProps {
    finish: FinishId
    onFinishChange: (finish: FinishId) => void
}

const STATEMENT = ['Admire it.', 'Hear it.', 'Live with it.', 'Make it yours.']
const STEP_CLASSES = ['', 'md:pl-[6vw]', 'md:pl-[12vw]', 'md:pl-[18vw]']
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const ReserveForm: FC<ReserveFormProps> = ({ finish, onFinishChange }): ReactNode => {
    const [email, setEmail] = useState('')
    const [company, setCompany] = useState('')
    const [status, setStatus] = useState<Status>('idle')
    const [message, setMessage] = useState('')
    const [reservedEmail, setReservedEmail] = useState('')
    const successRef = useRef<HTMLHeadingElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const selected = FINISHES.find((item) => item.id === finish) ?? FINISHES[0]

    useEffect(() => {
        if (status === 'success') successRef.current?.focus()
    }, [status])

    const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        const value = email.trim()

        if (!EMAIL_PATTERN.test(value)) {
            setStatus('error')
            setMessage('Please enter a valid email address.')
            emailRef.current?.focus()
            return
        }

        setStatus('submitting')
        setMessage('')

        try {
            const response = await fetch('/api/reserve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: value, finish, company })
            })
            const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null

            if (!response.ok || !payload?.ok) throw new Error(payload?.error || 'We could not save your reservation just now. Please try again.')

            setReservedEmail(value)
            setStatus('success')
        } catch (error) {
            setStatus('error')
            setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
        }
    }

    const reset = (): void => {
        setEmail('')
        setMessage('')
        setStatus('idle')
    }

    if (status === 'success') {
        return (
            <div role='status' className='flex h-full flex-col justify-between gap-12'>
                <div>
                    <span className='grid size-12 place-items-center rounded-full bg-foreground text-background motion-safe:animate-fade'>
                        <Check aria-hidden className='size-5' />
                    </span>

                    <h3
                        ref={successRef}
                        tabIndex={-1}
                        className='mt-8 font-heading stretch-semi text-4xl font-medium tracking-[-0.04em] outline-none md:text-5xl'
                    >
                        Your place is reserved.
                    </h3>

                    <p className='mt-5 max-w-md leading-relaxed text-muted-foreground'>
                        We will email <span className='break-all text-foreground'>{reservedEmail}</span> as soon as pre-orders open in October, with an Arden Halo in {selected.name} set aside for you.
                    </p>
                </div>

                <div className='flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between'>
                    <p className='flex items-center gap-3 text-sm'>
                        <SwatchDot finish={selected} className='size-5' />
                        {selected.name}, {PRICE}
                    </p>

                    <button
                        type='button'
                        onClick={reset}
                        className='text-left text-sm font-medium underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                    >
                        Reserve with another email
                    </button>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={onSubmit} noValidate className='flex h-full flex-col'>
            <p className='font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
                Arden Halo
            </p>

            <h3 className='mt-4 font-heading stretch-semi text-4xl font-medium tracking-[-0.04em] md:text-5xl'>
                Claim yours.
            </h3>

            <p className='mt-4 max-w-md leading-relaxed text-muted-foreground'>
                Secure your place before pre-orders open in October. First deliveries ship in November.
            </p>

            <div className='mt-8 flex items-end justify-between gap-4 border-y border-border py-6'>
                <p className='font-heading stretch-semi text-5xl font-medium tracking-[-0.04em]'>
                    {PRICE}
                </p>
                <p className='max-w-[12rem] text-right text-xs leading-relaxed text-muted-foreground'>
                    Includes travel case, USB-C and 3.5 mm cables
                </p>
            </div>

            <fieldset className='mt-8'>
                <legend className='font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
                    Finish
                </legend>

                <div className='mt-4 grid grid-cols-3 gap-2.5'>
                    {FINISHES.map((item) => (
                        <label
                            key={item.id}
                            className='relative flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-border px-2 py-4 text-sm transition-colors duration-300 hover:border-foreground/40 has-[input:checked]:border-foreground has-[input:checked]:bg-background has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring'
                        >
                            <input
                                type='radio'
                                name='finish'
                                value={item.id}
                                checked={finish === item.id}
                                onChange={() => onFinishChange(item.id)}
                                className='sr-only'
                            />
                            <SwatchDot finish={item} className='size-7' />
                            {item.name}
                        </label>
                    ))}
                </div>
            </fieldset>

            <div className='mt-8'>
                <label htmlFor='reserve-email' className='font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
                    Email
                </label>

                <div className='mt-3 flex flex-col gap-3 sm:flex-row'>
                    <input
                        ref={emailRef}
                        id='reserve-email'
                        type='email'
                        name='email'
                        inputMode='email'
                        autoComplete='email'
                        required
                        placeholder='you@example.com'
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value)

                            if (status === 'error') {
                                setStatus('idle')
                                setMessage('')
                            }
                        }}
                        aria-invalid={status === 'error'}
                        aria-describedby='reserve-message'
                        className='h-12 min-w-0 flex-1 rounded-full border border-border bg-background px-5 text-[15px] outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus:border-foreground/40 focus:ring-4 focus:ring-ring/15 aria-[invalid=true]:border-destructive'
                    />

                    <button
                        type='submit'
                        disabled={status === 'submitting'}
                        className='group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-[15px] font-medium text-background transition-colors duration-300 hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-wait disabled:opacity-70'
                    >
                        {status === 'submitting' ? (
                            <>
                                <LoaderCircle aria-hidden className='size-4 animate-spin' />
                                Reserving
                            </>
                        ) : (
                            <>
                                Reserve
                                <ArrowRight aria-hidden className='size-4 transition-transform duration-300 group-hover:translate-x-0.5' />
                            </>
                        )}
                    </button>
                </div>

                <div aria-hidden className='sr-only'>
                    <label htmlFor='reserve-company'>Company</label>
                    <input
                        id='reserve-company'
                        type='text'
                        name='company'
                        tabIndex={-1}
                        autoComplete='off'
                        value={company}
                        onChange={(event) => setCompany(event.target.value)}
                    />
                </div>

                <p
                    id='reserve-message'
                    role={status === 'error' ? 'alert' : undefined}
                    className={cn('mt-3 min-h-5 text-sm', status === 'error' ? 'text-destructive' : 'text-muted-foreground')}
                >
                    {status === 'error' ? message : 'Nothing to pay today. We will only email you about Arden Halo.'}
                </p>
            </div>
        </form>
    )
}

export const Reserve: FC = (): ReactNode => {
    const sectionRef = useRef<HTMLElement>(null)
    const statementRef = useRef<HTMLHeadingElement>(null)
    const [finish, setFinish] = useState<FinishId>('midnight')
    const [unsupported, setUnsupported] = useState(false)
    const selected = FINISHES.find((item) => item.id === finish) ?? FINISHES[0]

    useGSAP(() => {
        const media = gsap.matchMedia()

        media.add('(prefers-reduced-motion: no-preference)', () => {
            const lines = gsap.utils.toArray<HTMLElement>('.statement-line')
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: statementRef.current,
                    start: 'top 78%',
                    end: 'bottom 40%',
                    scrub: 0.6
                }
            })

            lines.forEach((line, index) => {
                timeline.fromTo(line, { opacity: 0.1, x: -30 }, { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }, index)

                if (index < lines.length - 1) timeline.to(line, { opacity: 0.22, duration: 1, ease: 'none' }, index + 1)
            })
        })
    }, { scope: sectionRef })

    return (
        <section
            id='reserve'
            ref={sectionRef}
            aria-labelledby='reserve-title'
            className='relative overflow-hidden bg-background pb-24 pt-28 md:pb-36 md:pt-44'
        >
            <div className='mx-auto max-w-[1600px] px-5 md:px-10'>
                <div data-reveal>
                    <Eyebrow index='10' label='Reserve' />
                </div>

                <h2
                    id='reserve-title'
                    ref={statementRef}
                    className='mt-10 font-heading stretch-wide text-[clamp(2.5rem,7vw,8rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]'
                >
                    {STATEMENT.map((line, index) => (
                        <span key={line} className={cn('statement-line block', STEP_CLASSES[index])}>
                            {line}{' '}
                        </span>
                    ))}
                </h2>
            </div>

            <div className='mx-auto mt-20 grid max-w-[1600px] gap-5 px-5 md:mt-28 md:px-10 lg:grid-cols-12 lg:gap-6'>
                <div
                    data-reveal
                    className='relative min-h-[440px] overflow-hidden rounded-[2rem] border border-border bg-[radial-gradient(ellipse_at_50%_38%,oklch(0.995_0.003_250),oklch(0.935_0.011_252)_75%)] sm:min-h-[540px] lg:col-span-7 lg:min-h-[700px]'
                >
                    {unsupported ? (
                        <div className='absolute inset-8'>
                            <Image
                                src='/images/product-studio.jpg'
                                alt='Arden Halo headphones in midnight with bronze chamfers'
                                fill
                                sizes='(min-width: 1024px) 55vw, 100vw'
                                className='object-contain mix-blend-multiply'
                            />
                        </div>
                    ) : (
                        <LazyHeadphonesStage
                            variant='compact'
                            finish={finish}
                            onUnsupported={() => setUnsupported(true)}
                            label={`Arden Halo in ${selected.name}, shown in 3D. Drag, swipe or use the arrow keys to turn them.`}
                            className='absolute inset-0'
                        />
                    )}

                    <div className='pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:p-7'>
                        <span className='text-foreground'>
                            Arden Halo, {selected.name}
                        </span>
                        <span>
                            Drag to explore
                        </span>
                    </div>
                </div>

                <div data-reveal className='rounded-[2rem] border border-border bg-card p-6 sm:p-8 md:p-10 lg:col-span-5'>
                    <ReserveForm finish={finish} onFinishChange={setFinish} />
                </div>
            </div>
        </section>
    )
}
