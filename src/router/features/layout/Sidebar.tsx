import { Link, useLocation } from 'react-router-dom';
import { navLinks } from '@/lib/data.tsx';
import LogoIcon from '@/components/icons/Logo.tsx';
import { useGlobalStore } from '@/store/global.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';

export default function Sidebar() {
    const location = useLocation();
    const { isLoading } = useGlobalStore();

    if (isLoading)
        return (
            <Skeleton className='rounded-[30px] min-w-[123px] w-[123px] py-[70px] mr-[30px] my-4' />
        );

    return (
        <div className='flex rounded-[30px] flex-col w-[123px] bg-surface py-[70px] mr-[30px] my-4'>
            {/* Логотип */}
            <Link draggable={false} className='px-7 mb-[70px]' to='/'>
                <LogoIcon color='primary' />
            </Link>

            <div className='flex flex-col gap-y-12 px-12'>
                {/* Навигация */}
                <div className='flex flex-col gap-y-12'>
                    {navLinks.map((link, idx) => (
                        <Link key={idx} draggable={false} to={link.link}>
                            <link.icon
                                color={
                                    location.pathname === link.link ? 'primary' : 'onSurfaceVariant'
                                }
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
