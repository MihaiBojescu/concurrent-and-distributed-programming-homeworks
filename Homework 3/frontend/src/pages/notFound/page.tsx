import { FC } from "react";
import { Page } from "../../components/page/page";
import { Card } from "../../components/card/card";
import { H3 } from "../../components/typography/h3";
import { Image } from "../../components/image/image";
import { P } from "../../components/typography/p";
import { useNotFoundPage } from "./logic";

export const NotFound: FC = () => {
    useNotFoundPage()

    return (
        <Page centered>
            <Card width={384} centered noShadow noBorder>
                <H3>Page not found</H3>
                <Image id="wind" size="xl" scaleFactor={5} />
                <P>Redirecting to a valid page...</P>
            </Card>
        </Page>
    )
}