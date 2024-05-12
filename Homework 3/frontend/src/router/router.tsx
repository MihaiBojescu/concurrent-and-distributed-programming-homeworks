import { createBrowserRouter } from "react-router-dom";
import { RootPage } from "../pages/root/root";
import { NotFound } from "../pages/notFound/notFound";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootPage />
    },
    {
        path: '*',
        element: <NotFound />
    },
])

