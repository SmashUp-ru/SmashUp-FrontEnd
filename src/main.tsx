import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '@/router/pages/layout.tsx';
import Root from '@/router/pages/root/Root.tsx';

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
            }
        ]
    }
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
