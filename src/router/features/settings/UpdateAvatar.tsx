import { Skeleton } from '@/components/ui/skeleton.tsx';
import { axiosSession, cn, convertToBase64 } from '@/lib/utils.ts';
import EditIcon from '@/components/icons/edit/Edit32';
import { Input } from '@/components/ui/input.tsx';
import ErrorToast from '@/router/shared/toasts/error.tsx';
import { AxiosResponse } from 'axios';
import { UpdateUserImageResponse } from '@/router/shared/types/settings.ts';
import { useGlobalStore } from '@/store/global.ts';
import { useState } from 'react';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import BaseToast from '@/router/shared/toasts/Base.tsx';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';

export default function UpdateAvatar() {
    const { toast } = useToast();

    const currentUser = useGlobalStore((state) => state.currentUser);
    const updateCurrentUser = useGlobalStore((state) => state.updateCurrentUser);

    const [imageLoaded, setImageLoaded] = useState(false);

    const uploadPhoto = async (file: File) => {
        const basedImageFile = await convertToBase64(file);
        const image = new Image();

        if (file.size > 5242880) {
            toast({
                element: (
                    <ErrorToast
                        icon
                        before='Ошибка'
                        field='при загрузке аватара.'
                        after='Аватар должен весить не более, чем 5мб.'
                    />
                ),
                duration: 2000,
                variant: 'destructive'
            });
            return;
        }

        if (typeof basedImageFile === 'string') {
            image.src = basedImageFile;
            image.onload = () => {
                if (image.naturalHeight < 800 || image.naturalWidth < 800) {
                    toast({
                        element: (
                            <ErrorToast
                                icon
                                before='Ошибка'
                                field='при загрузке аватара.'
                                after='Аватар должен быть размером больше 800px.'
                            />
                        ),
                        duration: 2000,
                        variant: 'destructive'
                    });
                    return;
                }
            };

            axiosSession
                .post('/user/update_image', {
                    basedImageFile: basedImageFile.substring(basedImageFile.indexOf(',') + 1)
                })
                .then((res: AxiosResponse<UpdateUserImageResponse>) => {
                    updateCurrentUser(res.data.response);
                    toast({
                        element: (
                            <BaseToast
                                image={basedImageFile}
                                field='Аватар'
                                after='успешно обновлён!'
                            />
                        ),
                        duration: 2000
                    });
                })
                .catch(axiosCatcher(toast, 'при обновлении аватара.'));
        }
    };

    if (!currentUser) {
        return (
            <Skeleton className='w-[200px] h-[200px] min-w-[200px] min-h-[200px] rounded-full' />
        );
    }

    return (
        <label className='relative cursor-pointer h-fit'>
            {!imageLoaded && (
                <Skeleton className='w-[200px] h-[200px] min-w-[200px] min-h-[200px] rounded-full' />
            )}
            <img
                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/user/${currentUser.imageUrl}_800x800.png`}
                alt={currentUser.username}
                className={cn(
                    'w-[200px] h-[200px] min-w-[200px] min-h-[200px] rounded-full brightness-50',
                    !imageLoaded && 'hidden'
                )}
                draggable={false}
                onLoad={() => setImageLoaded(true)}
            />
            <EditIcon
                size={89}
                className='absolute top-0 right-0 left-0 bottom-0 m-auto'
                color='onSurface'
            />
            <Input
                accept='.png,.jpg,.jpeg'
                type='file'
                className='hidden'
                onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        uploadPhoto(e.target.files[0]);
                    }
                }}
            />
        </label>
    );
}
