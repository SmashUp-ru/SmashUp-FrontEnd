import { useGlobalStore } from '@/store/global.ts';
import { useSearchStore } from '@/store/search.ts';
import { useMashupStore } from '@/store/entities/mashup.ts';
import { usePlaylistStore } from '@/store/entities/playlist.ts';
import { useTrackStore } from '@/store/entities/track.ts';
import { useUserStore } from '@/store/entities/user.ts';

/**
 * Полный сброс пользовательского состояния в памяти.
 *
 * НЕ трогает токен и localStorage/sessionStorage — за это отвечает вызывающий код
 * (LogoutPage и 401-перехватчик в axiosSession). Чистит global-поля текущего
 * пользователя, crossover-теги поиска и кэши всех entity-сторов, чтобы данные
 * прошлой сессии не «протекали» к следующему пользователю.
 */
export function resetAppState(): void {
    useGlobalStore.setState({
        currentUser: null,
        currentUserPlaylists: null,
        email: null,
        settings: null,
        recommendations: null,
        compilations: null,
        allGenres: null
    });

    useSearchStore.setState({
        searchValue: '',
        type: 'search',
        crossoverTracks: [],
        crossoverArtists: []
    });

    useMashupStore.getState().reset();
    usePlaylistStore.getState().reset();
    useTrackStore.getState().reset();
    useUserStore.getState().reset();
}
