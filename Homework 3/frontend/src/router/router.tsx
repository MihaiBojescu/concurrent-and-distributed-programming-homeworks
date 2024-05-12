import { createBrowserRouter } from "react-router-dom";
import { BalancerSelectionPage } from "../pages/balancerSelection/page";
import { NotFound } from "../pages/notFound/page";
import { ProtectedRoutes } from "../components/router/protectedRoutes";
import { BalancerStatisticsPage } from "../pages/balancerStatistics/page";
import { App } from "../pages/app/app";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
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
        element: <NotFound />
    },
])

