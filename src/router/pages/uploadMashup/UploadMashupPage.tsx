import { axiosSession } from '@/lib/utils.ts';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MashupForm, { MashupFormBody } from '@/router/shared/components/mashup/MashupForm';
import { AxiosResponse } from 'axios';
import { UploadMashupResponse } from '@/router/shared/types/upload';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import { useToast } from '@/router/shared/hooks/use-toast';
import { useDocumentTitle } from '@/router/shared/hooks/useDocumentTitle.ts';
import { TabsSeparated, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs-separated';
import { useEffect, useState } from 'react';
import ListVkMashupPage from '@/router/pages/vkMashup/ListVkMashupPage';
import { getVkId } from '@/lib/vk.ts';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip.tsx';

export default function UploadMashupPage() {
    useDocumentTitle('Загрузка мешапа');
    const navigate = useNavigate();
    const { toast } = useToast();

    const [searchParams, setSearchParams] = useSearchParams();

    // Вкладка «Из VK» доступна только при привязанном VK ID.
    // undefined = грузим / эндпоинт недоступен; null = не привязан; number = привязан.
    const [vkId, setVkId] = useState<number | null | undefined>(undefined);
    const vkConnected = vkId != null;

    useEffect(() => {
        getVkId()
            .then(setVkId)
            .catch(() => setVkId(null));
    }, []);

    const wantVk = searchParams.get('source') === 'vk';
    const source = wantVk && vkConnected ? 'vk' : 'manual';

    // VK-вкладка монтируется только после первого открытия (не дёргаем список VK,
    // пока пользователь сам не зашёл), но затем остаётся смонтированной (forceMount).
    const [vkOpened, setVkOpened] = useState(false);
    useEffect(() => {
        if (source === 'vk') setVkOpened(true);
    }, [source]);

    const handleTabChange = (value: string) => {
        if (value === 'vk' && vkConnected) {
            setVkOpened(true);
            setSearchParams({ source: 'vk' }, { replace: true });
        } else {
            setSearchParams({}, { replace: true });
        }
    };

    return (
        <div className='flex flex-col gap-y-7 h-full'>
            <h1 className='font-bold text-4xl text-onSurface'>Загрузка мэшапа</h1>

            <TabsSeparated
                value={source}
                onValueChange={handleTabChange}
                className='flex flex-col flex-1 items-start gap-y-4'
            >
                <TabsList>
                    <TabsTrigger value='manual'>Вручную</TabsTrigger>
                    {vkConnected ? (
                        <TabsTrigger value='vk'>Из VK</TabsTrigger>
                    ) : (
                        <TooltipProvider>
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                    <span className='cursor-not-allowed'>
                                        <TabsTrigger value='vk' disabled>
                                            Из VK
                                        </TabsTrigger>
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Доступно после подключения VK в настройках</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </TabsList>

                <TabsContent
                    value='manual'
                    forceMount
                    className='flex flex-col flex-1 w-full data-[state=inactive]:hidden'
                >
                    <MashupForm
                        initial={{
                            name: '',
                            explicit: false,
                            banWords: false,
                            selectedGenres: [],
                            selectedTracks: [],
                            selectedUsers: [],
                            statusLink: '',
                            agree: false
                        }}
                        text={{
                            title: '',
                            button: 'Опубликовать',
                            toast: {
                                before: 'Ваш',
                                field: 'мэшап',
                                after: 'загружается...'
                            }
                        }}
                        handleLoggedUser={true}
                        handleTracksUrls={true}
                        handleMashupFile={true}
                        requireImageFile={true}
                        showTracksIcons={true}
                        lockStatusLink={false}
                        onClick={(body: MashupFormBody) => {
                            return axiosSession
                                .post('/mashup/upload', {
                                    ...body,
                                    albumId: -1
                                })
                                .then((r: AxiosResponse<UploadMashupResponse>) =>
                                    navigate(
                                        `/mashup/upload/success/${r.data.response !== undefined ? r.data.response.id : '0'}`
                                    )
                                )
                                .catch(axiosCatcher(toast, 'при загрузке мэшапа'));
                        }}
                    />
                </TabsContent>

                <TabsContent
                    value='vk'
                    forceMount
                    className='flex flex-col flex-1 w-full data-[state=inactive]:hidden'
                >
                    {vkOpened && <ListVkMashupPage />}
                </TabsContent>
            </TabsSeparated>
        </div>
    );
}
