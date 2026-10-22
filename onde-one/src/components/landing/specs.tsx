import type { FC, ReactNode } from 'react'

import { SectionHeading } from '@/components/landing/section-heading'

const SPEC_GROUPS: Array<{ title: string; items: Array<[string, string]> }> = [
    {
        title: 'Design',
        items: [
            ['Weight', '268 g'],
            ['Earcups', 'Machined 6061 aluminum with bronze chamfer'],
            ['Headband', 'Aluminum with a seamless knit canopy'],
            ['Yokes and sliders', '316L stainless steel'],
            ['Cushions', '22 mm memory foam in protein leather'],
            ['Finishes', 'Midnight, Pearl, Slate']
        ]
    },
    {
        title: 'Sound',
        items: [
            ['Driver', '40 mm dynamic, beryllium-coated'],
            ['Frequency response', '4 Hz to 40 kHz'],
            ['Lossless audio', '24-bit, 96 kHz over USB-C'],
            ['Spatial audio', 'Dynamic head tracking'],
            ['Codecs', 'AAC, LDAC, aptX Adaptive, LC3']
        ]
    },
    {
        title: 'Noise control',
        items: [
            ['Modes', 'Noise cancelling, adaptive, transparency'],
            ['Reduction', 'Up to 42 dB'],
            ['Microphones', 'Twelve in total, eight for noise cancelling'],
            ['Calls', 'Beamforming voice pickup with wind reduction']
        ]
    },
    {
        title: 'Battery',
        items: [
            ['Noise cancelling on', 'Up to 60 hours'],
            ['Noise cancelling off', 'Up to 80 hours'],
            ['Fast charge', '5 minutes for 4 hours of playback'],
            ['Full charge', 'About 2 hours over USB-C']
        ]
    },
    {
        title: 'Connectivity',
        items: [
            ['Bluetooth', '6.0 with LE Audio and Auracast'],
            ['Multipoint', 'Two devices at the same time'],
            ['Wired', 'USB-C digital audio, 3.5 mm analog'],
            ['App', 'Arden for iOS and Android']
        ]
    },
    {
        title: 'In the box',
        items: [
            ['Headphones', 'Arden Halo'],
            ['Case', 'Slim, felt-lined travel case'],
            ['Cables', 'USB-C to USB-C, USB-C to 3.5 mm'],
            ['Warranty', 'Two years, plus lifetime cushion replacement']
        ]
    }
]

export const Specs: FC = (): ReactNode => {
    return (
        <section
            id='specs'
            data-nav='specs'
            aria-labelledby='specs-title'
            className='relative border-t border-border bg-background py-24 md:py-40'
        >
            <div className='mx-auto grid max-w-[1600px] gap-14 px-5 md:px-10 lg:grid-cols-12 lg:gap-8'>
                <div className='lg:col-span-4'>
                    <div className='lg:sticky lg:top-32'>
                        <SectionHeading
                            id='specs-title'
                            index='09'
                            eyebrow='Specifications'
                            title={<>Every detail.</>}
                            description='Everything inside Arden Halo, measured and listed.'
                        />
                    </div>
                </div>

                <div className='grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:col-span-8'>
                    {SPEC_GROUPS.map((group) => (
                        <div key={group.title} data-reveal>
                            <h3 className='flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground'>
                                <span aria-hidden className='size-1.5 rounded-full bg-bronze' />
                                {group.title}
                            </h3>

                            <dl className='mt-5 border-t border-border'>
                                {group.items.map(([term, detail]) => (
                                    <div key={term} className='grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 border-b border-border py-3.5 text-sm'>
                                        <dt className='text-muted-foreground'>
                                            {term}
                                        </dt>
                                        <dd className='text-foreground'>
                                            {detail}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
