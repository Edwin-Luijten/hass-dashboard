import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { MainPage } from './pages/MainPage';
import { BrowserMod } from './components/BrowserMod/BrowserMod';
import { EnergyPage } from './pages/EnergyPage';
import { Root } from './pages/Root';
import { HomeAssistantProvider } from './providers/HomeAssistantProvider';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root/>,
        children: [
            {
                path: '/',
                element: <MainPage/>,
            },
            {
                path: '/energy',
                element: <EnergyPage/>,
            }
        ]
    },
]);

const root = createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <StrictMode>
        <RecoilRoot>
            <HomeAssistantProvider
                browserId="panel"
                url="https://ironpichi.com"
                token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4MmE3ZTBmNTJkMjA0ZTNkYWFkYTc2ZjIxYTc0YjgyOSIsImlhdCI6MTY3ODA4OTgzMSwiZXhwIjoxOTkzNDQ5ODMxfQ.adUXpWNYZfl84Ze1qAWu4lP9JkA-ZpDlNgYaHP-jVlA">
                <RouterProvider router={router}/>
                <BrowserMod/>
            </HomeAssistantProvider>
        </RecoilRoot>
    </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
