import { usePlayerStore } from '@/store/player.ts';
import { cn } from '@/lib/utils.ts';
import { Button } from '@/components/ui/button.tsx';
import CancelIcon from '@/components/icons/Cancel.tsx';
import ShareIcon from '@/components/icons/Share.tsx';
import { Link } from 'react-router-dom';
import TrackSmallThumb from '@/router/shared/track/TrackSmallThumb.tsx';

export default function MashupInfo() {
    const { info, updateInfo } = usePlayerStore();

    if (!info) {
        return;
    }

    return (
        <div
            className={cn(
                'min-w-[237px] w-[237px] sticky top-0 bg-surfaceVariant rounded-[30px] my-4 mr-4 py-4 px-[10.5px] overflow-hidden',
                'flex flex-col gap-y-4 items-start'
            )}
        >
            <div className='flex items-center gap-x-[30px]'>
                <div className='max-w-[168px] overflow-hidden'>
                    <span className='truncate block font-bold text-[18px] text-onSurface'>
                        Название плейлиста
                    </span>
                </div>
                <Button variant='ghost' size='icon' onClick={() => updateInfo(false)}>
                    <CancelIcon />
                </Button>
            </div>

            <img
                src='https://s3-alpha-sig.figma.com/img/6158/4e0e/f870d3d8df844dcd031aa1eebd4fb001?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=C2FEEGt2kkFdwiQumuW-7T3fYGzcAZ42FGQRqAvXXQ6vPYtS-yJdn8UOs7Z2xiFDaqdx4ensemDh8JAB7f-~LbiHPMSVhl2iZ7Nt6xqvq5SCV1Bcd3Woh4KU~1H~gDdFaOoKPhFW5ekJPdJJ6iO5Dwl57XT5pjgFobm8mnCweWoWd1Fkaolh8zZS6GiIOO6xRKm4I5sJD0h-5CK-wq1U-lUU8nmr0fpUPT8yy91jNQ~XbGKk7Gr2e8gDawph36B5LTmvyBOKalEU40chd1-aqT1z2EV2MFwbnPrM-dmYuWSi3CkGwyM9vsZHbOiMHQpwNDiMbHGyi1-Nv8M31UsQOg__'
                alt='track name'
                className='w-[216px] h-[216px] rounded-[30px]'
            />

            <div className='flex flex-col w-full'>
                <span className='font-bold text-[18px] text-onSurface truncate'>
                    Леонид, дай денег
                </span>
                <Link to='/profile/warkkaa' className='font-medium text-onSurfaceVariant truncate'>
                    warkkaa
                </Link>
            </div>

            <Button variant='ghost' size='icon'>
                <ShareIcon />
            </Button>

            <div className='flex flex-col gap-y-2.5 w-full overflow-y-scroll'>
                <span className='font-bold text-[18px] text-onSurfaceVariant'>
                    Использованные треки
                </span>

                <div className='flex flex-col gap-y-2.5 w-full overflow-y-scroll'>
                    {Array.from({ length: 10 }).map(() => (
                        <TrackSmallThumb
                            imageUrl='https://s3-alpha-sig.figma.com/img/a997/3d39/4532b2f0d8593fe9f383a496e58a7219?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=JbPaM0eC2rzQKNr~49T6Znnps1ml8lCfCKzR~7oELWnE17kdxPpxrMHmV3RhK1LdmK46pX77Uh2RUkoyzOaFUtc-dWrkifDSYjr-NIrnjMiVEIkkK-G1swGK6g7FYqv2tJg6xwgvl48rxi7PJZk22JY07mwTBgvEfRoeS8-kitgYsXsJeHdEmyl-Lm-fb9d3Bm-THSI7WAIekAVLY7I4H3x~kCK-Z9FNbxo9nLY2W0HHSGDPVlw9nQkG81xRdtlKMCVPtoIfX-UsR8GLmCsbc-PghHAwl3VvmCw6SON3FMuGgFYRicZUl2ZxoQWUw5gnbHnEzofa9CGkkPkhS~Mniw__'
                            name='Гимн России'
                            authors={['Сережа']}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
