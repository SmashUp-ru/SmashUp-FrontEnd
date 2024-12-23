import { Link, useLocation } from 'react-router-dom';
import LogoIcon from '@/components/icons/Logo.tsx';
import { useGlobalStore } from '@/store/global.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { useUser } from '@/hooks/useUser.ts';
import LikeOutlineIcon from '@/components/icons/LikeOutline.tsx';
import HomeIcon from '@/components/icons/HomeIcon.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function Sidebar() {
    const location = useLocation();
    const { isLoading } = useGlobalStore();
    const user = useUser();

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
                    <Link draggable={false} to={'/'}>
                        <HomeIcon
                            color={location.pathname === '/' ? 'primary' : 'onSurfaceVariant'}
                        />
                    </Link>

                    {user ? (
                        <Link draggable={false} to={'/favorites'}>
                            <LikeOutlineIcon
                                color={
                                    location.pathname === '/favorites'
                                        ? 'primary'
                                        : 'onSurfaceVariant'
                                }
                            />
                        </Link>
                    ) : (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <LikeOutlineIcon color='onSurfaceVariant/50' />
                                </TooltipTrigger>
                                <TooltipContent
                                    className='max-w-[300px] text-center'
                                    side='right'
                                    sideOffset={64}
                                >
                                    <p>
                                        Зарегистрируйся, чтобы иметь возможность сохранять любимые
                                        мэшапы
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </div>
        </div>
    );
}
