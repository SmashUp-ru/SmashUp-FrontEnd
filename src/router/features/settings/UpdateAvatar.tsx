import { Skeleton } from '@/components/ui/skeleton.tsx';
import { axiosSession, convertToBase64, validateImageDimensions } from '@/lib/utils.ts';
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

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const MIN_AVATAR_PX = 800;

export default function UpdateAvatar() {
    const { toast } = useToast();

    const currentUser = useGlobalStore((state) => state.currentUser);
    const updateCurrentUser = useGlobalStore((state) => state.updateCurrentUser);

    const fail = (after: string) =>
        toast({
            element: (
                <ErrorToast icon before='Ошибка' field='при загрузке аватара.' after={after} />
            ),
            duration: 2000,
            variant: 'destructive'
        });

    // Проверки по порядку, и запрос уходит ТОЛЬКО после всех. Раньше проверка размеров
    // жила в image.onload и срабатывала уже после отправки: её return ничего не
    // останавливал — маленький аватар загружался, а ошибка всплывала следом.
    const uploadPhoto = async (file: File) => {
        if (!['image/png', 'image/jpeg'].includes(file.type)) {
            fail('Подойдёт только .png или .jpg.');
            return;
        }
        // Вес — до чтения файла: не тащим в память то, что всё равно отклоним.
        if (file.size > MAX_AVATAR_BYTES) {
            fail('Аватар должен весить не больше 5 МБ.');
            return;
        }

        const basedImageFile = await convertToBase64(file);
        if (typeof basedImageFile !== 'string') return;

        if (!(await validateImageDimensions(basedImageFile, MIN_AVATAR_PX))) {
            fail(`Аватар должен быть не меньше ${MIN_AVATAR_PX}×${MIN_AVATAR_PX} px.`);
            return;
        }

        axiosSession
            .post('/user/update_image', {
                basedImageFile: basedImageFile.substring(basedImageFile.indexOf(',') + 1)
            })
            .then((res: AxiosResponse<UpdateUserImageResponse>) => {
                updateCurrentUser(res.data.response);
                toast({
                    element: <BaseToast image={basedImageFile} field='Аватар' after='обновлён' />,
                    duration: 2000
                });
            })
            .catch(axiosCatcher(toast, 'при обновлении аватара.'));
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
                aria-label='Сменить аватар'
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    // Сброс — иначе повторный выбор того же файла не вызывает onChange.
                    e.target.value = '';
                    if (file) void uploadPhoto(file);
                }}
            />
        </label>
    );
}
