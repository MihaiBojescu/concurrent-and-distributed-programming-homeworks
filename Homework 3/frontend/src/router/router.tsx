import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoutes } from "../components/router/protectedRoutes";
import { App } from "../pages/app/app";
import { BalancerSelectionPage } from "../pages/balancerSelection/page";
import { BalancerStatisticsPage } from "../pages/balancerStatistics/page";
import { NotFoundPage } from "../pages/notFound/page";
import { SettingsPage } from "../pages/settings/page";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    },
    {
        path: '/app/settings',
        element: <SettingsPage />
    },
    {
        path: '/app/selection',
        element: <ProtectedRoutes redirectTo="/app/statistics" protect={false} />,
        children: [
            {
                path: '/app/selection',
                element: <BalancerSelectionPage />
            },
        ]
    },
    {
        path: '/app/statistics',
        element: <ProtectedRoutes redirectTo="/app/selection" protect={true} />,
        children: [
            {
                path: '/app/statistics',
                element: <BalancerStatisticsPage />
            },
        ]
    },
    {
        path: '*',
        element: <NotFoundPage />
    },
])

