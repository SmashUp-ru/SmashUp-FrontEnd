import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils.ts';

interface SectionProps {
    title: string;
    children: ReactNode;
    link?: {
        href: string;
        title: string;
    };
    className?: string;
}

export default function Section({ children, title, link, className }: SectionProps) {
    return (
        <section className={cn('flex flex-col gap-y-2.5', className)}>
            <div className='flex items-center justify-between gap-x-2'>
                <h2 className='font-semibold text-xl md:text-2xl text-onSurface truncate min-w-0'>
                    {title}
                </h2>
                {link && (
                    <Link
                        draggable={false}
                        to={link.href}
                        className='font-bold text-additionalText shrink-0 whitespace-nowrap text-sm md:text-base'
                    >
                        <span className='hover:text-onSurface'>{link.title}</span>
                    </Link>
                )}
            </div>
            <div className='w-full overflow-visible'>{children}</div>
        </section>
    );
}
