import { FC } from "react";
import { Page } from "../../components/page/page";
import { H1 } from "../../components/typography/h1";
import { Card } from "../../components/card/card";

export const RootPage: FC = () => {
    return (
        <Page centered>
            <Card>
                <H1>TODO</H1>
            </Card>
        </Page>
    )
}
