import { useParams } from 'react-router-dom';
import MashupCollection from '@/router/features/mashupCollection/MashupCollection.tsx';
import MashupSmallThumb from '@/router/shared/mashup/MashupSmallThumb.tsx';
import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import { useEffect, useState } from 'react';
import PlaylistPageSkeleton from '@/router/pages/skeletons/PlaylistPageSkeleton.tsx';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { isExplicit } from '@/lib/bitmask.ts';

export default function PlaylistPage() {
    const params = useParams();

    const getPlaylistById = usePlaylistStore((state) => state.getOneById);
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [mashups, setMashups] = useState<Mashup[]>([]);

    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);

    useEffect(() => {
        if (params.playlistId) {
            getPlaylistById(parseInt(params.playlistId)).then((r) => setPlaylist(r));
        }
    }, []);

    useEffect(() => {
        if (playlist) {
            getMashupsByIds(playlist.mashups).then((r) => setMashups(r));
        }
    }, [playlist]);

    if (!params.playlistId) return;

    if (!playlist) {
        return <PlaylistPageSkeleton />;
    }

    return (
        <MashupCollection
            title={`Плейлист ${playlist.authors.join(', ')}`}
            name={playlist.name}
            image={`${import.meta.env.VITE_BACKEND_URL}/uploads/playlist/${playlist.imageUrl}_800x800.png`}
        >
            {mashups.map((mashup) => (
                <MashupSmallThumb
                    key={mashup.id}
                    explicit={isExplicit(mashup.statuses)}
                    {...mashup}
                />
            ))}
        </MashupCollection>
    );
}
