import { FC } from "react";
import { Page } from "../../components/page/page";
import { Card } from "../../components/card/card";
import { H1 } from "../../components/typography/h1";

export const BalancerStatisticsPage: FC = () => {
    return (
        <Page centered>
            <Card>
                <H1>Balancer statistics page</H1>
            </Card>
        </Page>
    )
}
