import radio from '@/assets/radio.png';
import { Button } from '@/components/ui/button.tsx';
import TrackThumb from '@/router/shared/track/TrackThumb.tsx';
import HollowPlayIcon from '@/components/icons/HollowPlayIcon.tsx';
import HideIcon from '@/components/icons/Hide.tsx';
import ShareIcon from '@/components/icons/Share.tsx';

interface PlaylistProps {
    playlistId: string;
}

export default function Playlist({ playlistId }: PlaylistProps) {
    return (
        <div className='flex flex-col gap-y-6'>
            <div className='flex items-center gap-x-12 bg-surface p-4 rounded-[34px]'>
                <img
                    src={radio}
                    alt='radio'
                    className='w-[216px] h-[216px] rounded-[34px]'
                    draggable={false}
                />

                <div className='flex flex-col gap-y-6'>
                    <div>
                        <span className='font-medium text-lg text-additionalText'>Плейлист</span>
                        <h1 className='font-bold text-4xl text-onSurface'>Номер {playlistId}</h1>
                    </div>
                    <div className='flex items-center gap-x-4'>
                        <Button variant='ghost' size='icon'>
                            <HollowPlayIcon />
                        </Button>
                        <Button variant='ghost' size='icon'>
                            <HideIcon />
                        </Button>
                        <Button variant='ghost' size='icon'>
                            <ShareIcon />
                        </Button>
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-y-1'>
                <TrackThumb
                    img={radio}
                    title='Развлекайтесь на 180db'
                    author='LeonidM'
                    length='2:26'
                />
                <TrackThumb
                    img={radio}
                    title='Развлекайтесь на 180db'
                    author='LeonidM'
                    length='2:26'
                />
                <TrackThumb
                    img={radio}
                    title='Развлекайтесь на 180db'
                    author='LeonidM'
                    length='2:26'
                />
                <TrackThumb
                    img={radio}
                    title='Развлекайтесь на 180db'
                    author='LeonidM'
                    length='2:26'
                />
                <TrackThumb
                    img={radio}
                    title='Развлекайтесь на 180db'
                    author='LeonidM'
                    length='2:26'
                />
                <TrackThumb
                    img={radio}
                    title='Развлекайтесь на 180db'
                    author='LeonidM'
                    length='2:26'
                />
                <TrackThumb
                    img={radio}
                    title='Развлекайтесь на 180db'
                    author='LeonidM'
                    length='2:26'
                />
                <TrackThumb
                    img={radio}
                    title='Развлекайтесь на 180db'
                    author='LeonidM'
                    length='2:26'
                />
                <TrackThumb
                    img={radio}
                    title='Развлекайтесь на 180db'
                    author='LeonidM'
                    length='2:26'
                />
                <TrackThumb
                    img={radio}
                    title='Развлекайтесь на 180db'
                    author='LeonidM'
                    length='2:26'
                />
            </div>
        </div>
    );
}
