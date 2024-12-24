import { Skeleton } from '@/components/ui/skeleton.tsx';

export default function SettingsPageSkeleton() {
    return (
        <section className='flex flex-col gap-y-6 pr-[35px]'>
            <div className='flex items-center justify-between'>
                <Skeleton className='w-[200px] h-[38px] rounded-xl' />
            </div>
            <div className='w-full flex gap-x-12'>
                <Skeleton className='w-[200px] h-[200px] min-w-[200px] min-h-[200px] rounded-full' />
                {/*настройки*/}
                <div className='w-full flex flex-col gap-y-[75px]'>
                    {/*настройки профиля*/}
                    <div className='w-full flex flex-col gap-y-[30px]'>
                        <Skeleton className='w-[268px] h-[38px] rounded-xl' />
                        <div className='flex flex-col gap-y-2'>
                            <Skeleton className='w-[268px] h-[20px] rounded-[9px]' />
                            <Skeleton className='w-[114px] h-[20px] rounded-[9px]' />
                        </div>

                        <div className='flex flex-col gap-y-2'>
                            <Skeleton className='w-[268px] h-[20px] rounded-[9px]' />
                            <Skeleton className='w-[114px] h-[20px] rounded-[9px]' />
                        </div>

                        <div className='grid grid-cols-3 gap-x-20'>
                            <div className='flex flex-col gap-y-2'>
                                <Skeleton className='w-[265px] h-[20px] rounded-[9px]' />
                                <Skeleton className='w-full h-[20px] rounded-[9px]' />
                            </div>

                            <div className='flex flex-col gap-y-2'>
                                <Skeleton className='w-[265px] h-[20px] rounded-[9px]' />
                                <Skeleton className='w-full h-[20px] rounded-[9px]' />
                            </div>

                            <div className='flex flex-col gap-y-2'>
                                <Skeleton className='w-[265px] h-[20px] rounded-[9px]' />
                                <Skeleton className='w-full h-[20px] rounded-[9px]' />
                            </div>
                        </div>

                        <div className='grid grid-cols-3 gap-x-20'>
                            <div className='flex flex-col gap-y-2'>
                                <Skeleton className='w-[265px] h-[20px] rounded-[9px]' />
                                <Skeleton className='w-full h-[20px] rounded-[9px]' />
                            </div>

                            <div className='flex flex-col gap-y-2'>
                                <Skeleton className='w-[265px] h-[20px] rounded-[9px]' />
                                <Skeleton className='w-full h-[20px] rounded-[9px]' />
                            </div>

                            <div className='flex flex-col gap-y-2'>
                                <Skeleton className='w-[265px] h-[20px] rounded-[9px]' />
                                <Skeleton className='w-full h-[20px] rounded-[9px]' />
                            </div>
                        </div>
                    </div>

                    {/*настройки аккаунта*/}
                    <div className='w-full flex flex-col gap-y-[30px]'>
                        <Skeleton className='w-[268px] h-[38px] rounded-xl' />
                        <div className='grid grid-cols-3 gap-x-20'>
                            <div className='flex flex-col gap-y-2'>
                                <Skeleton className='w-[265px] h-[20px] rounded-[9px]' />
                                <Skeleton className='w-full h-[20px] rounded-[9px]' />
                            </div>

                            <div className='flex flex-col gap-y-2'>
                                <Skeleton className='w-[265px] h-[20px] rounded-[9px]' />
                                <Skeleton className='w-full h-[20px] rounded-[9px]' />
                            </div>

                            <div className='flex flex-col gap-y-2'>
                                <Skeleton className='w-[265px] h-[20px] rounded-[9px]' />
                                <Skeleton className='w-full h-[20px] rounded-[9px]' />
                            </div>
                        </div>
                    </div>

                    {/*сохранить*/}
                    {/*<div className="bg-surfaceVariant p-5 w-fit rounded-[30px] flex items-center gap-x-6">*/}
                    {/*    <Button className="w-[460px]">Сохранить</Button>*/}
                    {/*    <Button*/}
                    {/*        className="w-[230px] bg-surfaceVariant text-onBackground hover:bg-surfaceVariant/90 hover:text-onBackground/90">Отменить</Button>*/}
                    {/*</div>*/}
                </div>
            </div>
        </section>
    );
}
