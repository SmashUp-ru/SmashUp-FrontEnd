import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '@/router/pages/root/layout.tsx';

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                element: <App />,
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
