import { ReactNode } from 'react';

interface SectionProps {
    title: string;
    children: ReactNode;
}

export default function Section({ children, title }: SectionProps) {
    return (
        <section className='flex flex-col gap-y-2.5'>
            <h2 className='font-semibold text-2xl text-onSurface'>{title}</h2>
            <div className='w-full overflow-visible'>{children}</div>
        </section>
    );
}
