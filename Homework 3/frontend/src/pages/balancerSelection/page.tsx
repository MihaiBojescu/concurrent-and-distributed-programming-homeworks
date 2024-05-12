import { FC } from "react";
import { Card } from "../../components/card/card";
import { Page } from "../../components/page/page";
import { H1 } from "../../components/typography/h1";

export const BalancerSelectionPage: FC = () => {
    return (
        <Page centered>
            <Card>
                <H1>Balancer selection page</H1>
            </Card>
        </Page>
    )
}
