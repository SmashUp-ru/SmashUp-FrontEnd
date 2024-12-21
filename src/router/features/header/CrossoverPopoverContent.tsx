import { useSearchStore } from '@/store/search.ts';
import { useCrossoverSearch } from '@/router/features/header/useCrossoverSearch.ts';
import TrackSmallThumb from '@/router/shared/track/TrackSmallThumb.tsx';
import TrackAuthorSmallThumb from '@/router/shared/track/TrackAuthorSmallThumb.tsx';
import { Button } from '@/components/ui/button.tsx';

export default function CrossoverPopoverContent() {
    const {
        searchValue,
        crossoverTracks,
        crossoverArtists,
        updateCrossoverArtists,
        updateCrossoverTracks
    } = useSearchStore();

    const { tracks, trackAuthors } = useCrossoverSearch(searchValue);

    return (
        <div className='flex flex-col gap-y-1'>
            <h3 className='text-[18px] font-bold text-onSurface'>Треки</h3>
            <div className='flex flex-col gap-y-1 max-h-[25vh] overflow-y-auto'>
                {tracks.map((track) => (
                    <Button
                        key={track.id}
                        size='icon'
                        variant='nothing'
                        onClick={() => {
                            if (!crossoverTracks.find((elem) => elem.id === track.id)) {
                                updateCrossoverTracks([track, ...crossoverTracks]);
                            }
                        }}
                    >
                        <TrackSmallThumb track={track} />
                    </Button>
                ))}
            </div>

            <h3 className='text-[18px] font-bold text-onSurface'>Авторы</h3>
            <div className='flex flex-col gap-y-1 max-h-[25vh] overflow-y-auto'>
                {trackAuthors.map((trackAuthor) => (
                    <Button
                        key={trackAuthor.id}
                        size='icon'
                        variant='nothing'
                        onClick={() => {
                            if (!crossoverArtists.find((elem) => elem.id === trackAuthor.id)) {
                                updateCrossoverArtists([trackAuthor, ...crossoverArtists]);
                            }
                        }}
                    >
                        <TrackAuthorSmallThumb trackAuthor={trackAuthor} />
                    </Button>
                ))}
            </div>
        </div>
    );
}
