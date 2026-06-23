import { Skeleton } from '@/components/ui/skeleton.tsx';
import TrackSmallThumbSkeleton from '@/router/shared/components/track/TrackSmallThumbSkeleton.tsx';

export default function MashupFormSkeleton() {
    return (
        <section className='flex flex-col gap-y-6 md:pr-[35px] h-full'>
            <Skeleton className='w-full max-w-[308px] h-[38px] rounded-[13px]' />
            <div className='w-full flex flex-col md:flex-row items-center md:items-start gap-y-6 md:gap-y-0 md:gap-x-12 flex-1'>
                <Skeleton className='w-[200px] h-[200px] min-w-[200px] rounded-[30px]' />

                <div className='w-full flex flex-col flex-1'>
                    <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-y-[35px] md:gap-y-0 gap-x-10 flex-grow'>
                        {/*использованные треки*/}
                        <div className='flex flex-col gap-y-[35px]'>
                            <div className='flex flex-col gap-y-2.5'>
                                <Skeleton className='w-full max-w-[268px] h-[20px] rounded-[9px]' />
                                <Skeleton className='h-[50px] rounded-2xl' />

                                <div className='flex flex-col gap-y-2.5 max-h-[270px] overflow-y-scroll'>
                                    {Array.from({ length: 4 }).map((_, idx) => (
                                        <TrackSmallThumbSkeleton key={idx} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/*название, mp3, ссылка, жанр*/}
                        <div className='flex flex-col gap-y-[35px]'>
                            <div className='flex flex-col gap-y-2.5'>
                                <Skeleton className='w-full max-w-[268px] h-[20px] rounded-[9px]' />
                                <Skeleton className='w-[114px] h-[20px] rounded-[9px]' />
                            </div>

                            <div className='flex flex-col gap-y-2.5'>
                                <Skeleton className='w-full max-w-[268px] h-[20px] rounded-[9px]' />
                                <Skeleton className='w-[114px] h-[20px] rounded-[9px]' />
                            </div>

                            <Skeleton className='h-[50px] rounded-2xl' />

                            <div className='flex flex-col gap-y-2.5'>
                                <Skeleton className='w-full max-w-[268px] h-[20px] rounded-[9px]' />
                                <div className='grid grid-cols-3 gap-x-2.5 gap-y-3 max-h-[252px] overflow-y-scroll'>
                                    {Array.from({ length: 12 }).map((_, idx) => (
                                        <Skeleton key={idx} className='h-[54px] rounded-2xl' />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/*авторы, статусы*/}
                        <div className='flex flex-col gap-y-[35px]'>
                            <div className='flex flex-col gap-y-2.5'>
                                <Skeleton className='w-full max-w-[268px] h-[20px] rounded-[9px]' />
                                <Skeleton className='w-[114px] h-[20px] rounded-[9px]' />
                            </div>

                            <div className='flex flex-col gap-y-2.5'>
                                <Skeleton className='w-full max-w-[268px] h-[20px] rounded-[9px]' />
                                <Skeleton className='h-[50px] rounded-2xl' />
                            </div>

                            <div className='flex flex-col gap-y-2.5'>
                                {Array.from({ length: 3 }).map((_, idx) => (
                                    <div
                                        className='flex items-center gap-x-4 rounded-l-[50px] rounded-r-2xl p-[6px] mr-[7px]'
                                        key={idx}
                                    >
                                        <Skeleton className='w-12 h-12 min-w-12 rounded-full' />
                                        <Skeleton className='w-full max-w-[221px] h-[19px] rounded-[10px]' />
                                    </div>
                                ))}
                            </div>

                            <div className='flex flex-col gap-y-2.5'>
                                <Skeleton className='h-[50px] rounded-2xl' />
                                <Skeleton className='h-[50px] rounded-2xl' />
                            </div>
                        </div>
                    </div>

                    {/*сохранить*/}
                    <Skeleton className='w-full md:w-[1195px] h-[96px] rounded-[30px]' />
                </div>
            </div>
        </section>
    );
}
