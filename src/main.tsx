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
import RestorePasswordPage from '@/router/pages/restorePassword/RestorePasswordPage.tsx';
import RestorePasswordConfirmPage from '@/router/pages/restorePasswordConfirm/RestorePasswordConfirmPage.tsx';
import RestorePasswordUpdatePage from '@/router/pages/restorePasswordUpdate/RestorePasswordUpdatePage.tsx';
import DebugPage from '@/router/pages/debug/DebugPage.tsx';
import ProfileTracksPage from '@/router/pages/profile/tracks/ProfileTracksPage.tsx';
import MashupPage from '@/router/pages/mashup/MashupPage.tsx';
import Layout from '@/router/pages/layout.tsx';
import FavoritesPage from '@/router/pages/favorites/FavoritesPage.tsx';
import RecommendationsPage from '@/router/pages/recommendations/RecommendationsPage.tsx';

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            // основное приложение
            {
                element: <RootLayout />,
                errorElement: <NotFound />,
                children: [
                    {
                        element: <DebugPage />,
                        path: '/debug'
                    },
                    {
                        element: <Root />,
                        path: '/'
                    },
                    {
                        element: <FavoritesPage />,
                        path: '/favorites'
                    },
                    {
                        element: <RecommendationsPage />,
                        path: '/recommendations'
                    },
                    {
                        element: <PlaylistPage />,
                        path: '/playlist/:playlistId'
                    },
                    {
                        element: <MashupPage />,
                        path: '/mashup/:mashupId'
                    },
                    {
                        element: <ProfilePage />,
                        path: '/profile/:profileUsername'
                    },
                    {
                        element: <ProfileTracksPage />,
                        path: '/profile/:profileUsername/tracks'
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
                    },
                    {
                        element: <RestorePasswordPage />,
                        path: '/restore-password'
                    },
                    {
                        element: <RestorePasswordConfirmPage />,
                        path: '/restore-confirm'
                    },
                    {
                        element: <RestorePasswordUpdatePage />,
                        path: '/restore-update'
                    }
                ]
            }
        ]
    }
]);

createRoot(document.getElementById('root')!).render(
    // <StrictMode>
    //
    // </StrictMode>
    <RouterProvider router={router} />
);
