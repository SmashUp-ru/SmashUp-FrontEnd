import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from '@/router/pages/rootLayout.tsx';
import Root from '@/router/pages/root/RootPage.tsx';
import NotFound from '@/router/features/error/NotFound.tsx';
import PlaylistPage from '@/router/pages/playlist/PlaylistPage.tsx';
import ProfilePage from '@/router/pages/profile/ProfilePage.tsx';
import SearchPage from '@/router/pages/search/SearchPage.tsx';
import AuthLayout from '@/router/pages/authLayout.tsx';
import LoginPage from '@/router/pages/login/LoginPage.tsx';
import RegisterPage from '@/router/pages/register/RegisterPage.tsx';

const router = createBrowserRouter([
    // основное приложение
    {
        element: <RootLayout />,
        errorElement: <NotFound />,
        children: [
            {
                element: <Root />,
                path: '/'
            },
            {
                element: <PlaylistPage />,
                path: '/playlist/:playlistId'
            },
            {
                element: <ProfilePage />,
                path: '/profile/:profileId'
            },
            {
                element: <SearchPage />,
                path: '/search'
            }
        ]
    },
    // страницы входа
    {
        element: <AuthLayout />,
        errorElement: <NotFound />,
        children: [
            {
                element: <LoginPage />,
                path: '/login'
            },
            {
                element: <RegisterPage />,
                path: '/register'
            }
        ]
    }
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
