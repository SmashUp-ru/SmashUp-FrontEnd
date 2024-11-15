import { Link, useLocation } from 'react-router-dom';
import { navLinks } from '@/lib/data.tsx';
import LogoIcon from '@/components/icons/Logo.tsx';

export default function Sidebar() {
    const location = useLocation();

    return (
        <div className='hidden md:flex rounded-[30px] flex-col w-[123px] bg-surface py-[70px] mr-[30px] my-4'>
            {/* Логотип */}
            <Link className='px-7 mb-[70px]' to='/'>
                <LogoIcon color='primary' />
            </Link>

            <div className='flex flex-col gap-y-12 px-12'>
                {/* Навигация */}
                <div className='flex flex-col gap-y-12'>
                    {navLinks.map((link, i) => (
                        <Link to={link.link}>
                            <link.icon
                                key={i}
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
