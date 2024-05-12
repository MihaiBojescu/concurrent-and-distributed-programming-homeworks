import { FC } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getRootBalancer } from "../../reducer/balancers/reducer";

type Props = {
    redirectTo: string
    protect?: boolean
}

export const ProtectedRoutes: FC<Props> = ({ redirectTo, protect }) => {
    const rootBalancer = useSelector(getRootBalancer)
    const location = useLocation()

    return (protect === true ? rootBalancer : !rootBalancer)
        ? <Outlet />    
        : <Navigate to={redirectTo} replace state={{ from: location }} />;
}
