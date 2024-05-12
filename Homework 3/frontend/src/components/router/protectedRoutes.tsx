import { FC } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getRootBalancer } from "../../reducer/balancers/reducer";

export const ProtectedRoutes: FC = () => {
    const rootBalancer = useSelector(getRootBalancer)
    const location = useLocation()

    return rootBalancer
        ? <Outlet />    
        : <Navigate to="/app" replace state={{ from: location }} />;
}
