import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '@/router/pages/layout.tsx';
import Root from '@/router/pages/root/RootPage.tsx';
import Playlist from '@/router/pages/playlist/Playlist.tsx';

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                element: <Root />,
                path: '/'
            },
            {
                element: <App />,
                path: '/favorites'
            },
            {
                element: <Playlist />,
                path: '/playlist/:playlistId'
            }
        ]
    }
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
