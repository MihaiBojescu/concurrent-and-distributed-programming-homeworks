import { createBrowserRouter } from "react-router-dom";
import { Root } from '../pages/root/root'
import { Login } from "../pages/login/login";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />
    },
    {
        path: '/login',
        element: <Login />
    }
])