import { FC } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthenticated } from "../../hooks/useAuthenticated";
import { useLoadReducers } from "../../hooks/useLoadReducers";
import { usePrefetch } from "../../hooks/usePrefetch";
import { Spin } from "../animate/spin";
import { Image } from "../image/image";
import { Page } from "../page/page";
import { Card } from "../card/card";
import { H1 } from "../typography/h1";

export const PrivateRoutes: FC = () => {
    const location = useLocation();
    const areReducersLoaded = useLoadReducers()
    const isAuthenticated = useAuthenticated(areReducersLoaded)
    const isReady = usePrefetch(isAuthenticated || false)

    if (!areReducersLoaded || typeof isAuthenticated !== 'boolean' || (isAuthenticated === true && !isReady)) {
        return (
            <Page centered>
                <Card centered noBorder noShadow>
                    <Spin>
                        <Image id="gear" size="xl" scaleFactor={2} />
                    </Spin>
                    <H1>Application is loading</H1>
                </Card>
            </Page>
        )
    }

    return isAuthenticated
        ? <Outlet />    
        : <Navigate to="/login" replace state={{ from: location }} />;
}
