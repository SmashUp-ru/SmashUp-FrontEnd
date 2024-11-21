import { Track, useTrackStore } from '@/store/entities/track.ts';
import { Button } from '@/components/ui/button.tsx';
import { useEffect, useState } from 'react';

export default function DebugPage() {
    const getManyTracksByIds = useTrackStore((state) => state.getManyByIds);
    const [tracks, setTracks] = useState<Track[]>([]);

    useEffect(() => {
        getManyTracksByIds([100, 101]).then((r) => setTracks(r));
    }, []);

    return (
        <div>
            <Button
                onClick={() => {
                    console.log(tracks);
                }}
            >
                press me
            </Button>
        </div>
    );
}
