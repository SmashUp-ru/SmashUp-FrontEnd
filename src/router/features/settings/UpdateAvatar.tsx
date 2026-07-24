import { Skeleton } from '@/components/ui/skeleton.tsx';
import { axiosSession, convertToBase64 } from '@/lib/utils.ts';
import EditIcon from '@/components/icons/edit/Edit32';
import { Input } from '@/components/ui/input.tsx';
import ErrorToast from '@/router/shared/toasts/error.tsx';
import { AxiosResponse } from 'axios';
import { UpdateUserImageResponse } from '@/router/shared/types/settings.ts';
import { useGlobalStore } from '@/store/global.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import BaseToast from '@/router/shared/toasts/Base.tsx';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import { coverUrl } from '@/lib/cdn.ts';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';

export default function UpdateAvatar() {
    const { toast } = useToast();

    const currentUser = useGlobalStore((state) => state.currentUser);
    const updateCurrentUser = useGlobalStore((state) => state.updateCurrentUser);

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
            <Skeleton className='w-[120px] h-[120px] min-w-[120px] min-h-[120px] md:w-[200px] md:h-[200px] md:min-w-[200px] md:min-h-[200px] rounded-full' />
        );
    }

    return (
        <label className='relative cursor-pointer h-fit'>
            <ImageWithSkeleton
                src={coverUrl('user', currentUser.imageUrl, 800)}
                alt={currentUser.username}
                className='w-[120px] h-[120px] min-w-[120px] min-h-[120px] md:w-[200px] md:h-[200px] md:min-w-[200px] md:min-h-[200px] rounded-full brightness-75'
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
