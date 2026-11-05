import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { useDebounce } from 'use-debounce';
import { Input } from '@/components/ui/input.tsx';
import SearchIcon from '@/components/icons/Search.tsx';
import { axiosSession } from '@/lib/utils.ts';
import { coverUrl } from '@/lib/cdn.ts';
import { User } from '@/store/entities/user.ts';
import { LineupArtist } from '@/store/ticketDrafts.ts';
import { UsersSearchResponse } from '@/router/shared/types/search.ts';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';

/** Лайнап: поиск мешаперов SmashUp по нику (как соавторы в модерации), клик — добавить/убрать. */
export default function LineupField({
    value,
    onChange
}: {
    value: LineupArtist[];
    onChange: (v: LineupArtist[]) => void;
}) {
    const [query, setQuery] = useState('');
    const [debounced] = useDebounce(query.trim(), 400);
    const [found, setFound] = useState<User[]>([]);

    useEffect(() => {
        if (debounced.length < 2 || debounced.length > 32) return setFound([]);
        let cancelled = false;
        axiosSession
            .get(`/user/search?query=${encodeURIComponent(debounced)}`)
            .then(
                (r: AxiosResponse<UsersSearchResponse>) => !cancelled && setFound(r.data.response)
            )
            .catch(() => !cancelled && setFound([]));
        return () => {
            cancelled = true;
        };
    }, [debounced]);

    const row = (a: LineupArtist, selected: boolean, onClick: () => void) => (
        <button
            key={a.id}
            type='button'
            aria-pressed={selected}
            onClick={onClick}
            className={
                'flex w-full items-center gap-x-3 rounded-2xl p-1.5 text-left transition-colors motion-reduce:transition-none ' +
                (selected ? 'bg-onSurface/10' : 'hover:bg-onSurface/5')
            }
        >
            <ImageWithSkeleton
                src={coverUrl('user', a.imageUrl ?? 'default', 100)}
                alt=''
                className='h-9 w-9 shrink-0 rounded-full'
            />
            <span className='min-w-0 flex-1 truncate text-sm font-medium text-onSurface'>
                {a.username}
            </span>
            {selected && <span className='px-2 text-[13px] text-onSurfaceVariant'>Убрать</span>}
        </button>
    );

    return (
        <div className='flex flex-col gap-y-2'>
            <Input
                startIcon={SearchIcon}
                placeholder='Ник мешапера'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <div className='-mx-1.5 flex flex-col gap-y-0.5'>
                {value.map((a) => row(a, true, () => onChange(value.filter((x) => x.id !== a.id))))}
                {found
                    .filter((u) => !value.some((a) => a.id === u.id))
                    .slice(0, 5)
                    .map((u) =>
                        row({ id: u.id, username: u.username, imageUrl: u.imageUrl }, false, () => {
                            onChange([
                                ...value,
                                { id: u.id, username: u.username, imageUrl: u.imageUrl }
                            ]);
                            setQuery('');
                        })
                    )}
            </div>
        </div>
    );
}
