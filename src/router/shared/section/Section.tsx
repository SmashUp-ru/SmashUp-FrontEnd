import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface SectionProps {
    title: string;
    children: ReactNode;
    link?: {
        href: string;
        title: string;
    };
}

export default function Section({ children, title, link }: SectionProps) {
    return (
        <section className='flex flex-col gap-y-2.5'>
            <div className='flex items-center justify-between'>
                <h2 className='font-semibold text-2xl text-onSurface'>{title}</h2>
                {link && (
                    <Link to={link.href} className='font-bold text-additionalText'>
                        {link.title}
                    </Link>
                )}
            </div>
            <div className='w-full overflow-visible'>{children}</div>
        </section>
    );
}
