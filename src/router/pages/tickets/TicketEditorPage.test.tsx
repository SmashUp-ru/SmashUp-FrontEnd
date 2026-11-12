import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { axiosSession } from '@/lib/utils.ts';
import { useGlobalStore } from '@/store/global.ts';
import type { User } from '@/store/entities/user.ts';
import { useEventStore, type SmashUpEvent } from '@/store/entities/event.ts';
import TicketEditorPage from './TicketEditorPage.tsx';

vi.mock('@/router/features/tickets/TicketCard.tsx', () => ({ default: () => null }));

beforeEach(() => {
    vi.spyOn(axiosSession, 'get').mockResolvedValue({
        data: { status: 'ok', response: { design: null } }
    });
    vi.spyOn(useEventStore.getState(), 'getOneById').mockResolvedValue({
        id: 7,
        name: 'Ночной концерт',
        startsAt: Date.UTC(2026, 11, 12, 17),
        timezone: 'Asia/Vladivostok',
        city: 'Владивосток',
        venue: 'Клуб',
        lineup: [{ name: 'Гость без аккаунта', userIds: [] }]
    } as SmashUpEvent);
});

afterEach(() => {
    cleanup();
    useGlobalStore.setState({ currentUser: null });
    vi.restoreAllMocks();
});

function open(permissions: number) {
    useGlobalStore.setState({
        currentUser: { permissions, username: 'admin', imageUrl: 'default' } as User
    });
    return render(
        <MemoryRouter
            initialEntries={['/event/7/ticket']}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
            <Routes>
                <Route path='/event/:eventId/ticket' element={<TicketEditorPage />} />
            </Routes>
        </MemoryRouter>
    );
}

it('без прав не загружает мероприятие и дизайн', () => {
    open(0);
    expect(screen.getByText('Нет доступа')).toBeInTheDocument();
    expect(axiosSession.get).not.toHaveBeenCalled();
    expect(useEventStore.getState().getOneById).not.toHaveBeenCalled();
});

it.each([1, 2])(
    'админ и модератор видят данные мероприятия без полей редактирования (%s)',
    async (permissions) => {
        open(permissions);
        expect(await screen.findByText('Ночной концерт')).toBeInTheDocument();
        expect(screen.getByText(/13 декабря.*03:00/)).toBeInTheDocument();
        expect(screen.getByText('Владивосток')).toBeInTheDocument();
        expect(screen.getByText('Клуб')).toBeInTheDocument();
        expect(screen.getByText('Гость без аккаунта')).toBeInTheDocument();
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
        expect(screen.getByRole('spinbutton', { name: /Тираж/ })).toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent('Сохранено');
    }
);
