import { createBrowserRouter } from "react-router-dom";
import { BalancerSelectionPage } from "../pages/balancerSelection/page";
import { NotFound } from "../pages/notFound/page";
import { ProtectedRoutes } from "../components/router/protectedRoutes";
import { BalancerStatisticsPage } from "../pages/balancerStatistics/page";

export const router = createBrowserRouter([
    {
        path: '/app',
        element: <BalancerSelectionPage />
    },
    {
        path: '/',
        element: <ProtectedRoutes />,
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

