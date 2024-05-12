import { FC } from "react";
import { Page } from "../../components/page/page";
import { Card } from "../../components/card/card";
import { H1 } from "../../components/typography/h1";
import { Image } from "../../components/image/image";
import { useSettingsPageLogic } from "./logic";
import { Header } from "../../components/header/header";
import { HeaderActionSlot } from "../../components/header/headerActionsSlot";
import { Button } from "../../components/input/button";

export const SettingsPage: FC = () => {
    const logic = useSettingsPageLogic()

    return (
        <>
            <Header left={
                <HeaderActionSlot>
                    <Button onClick={logic.onClickBack}>
                        <Image id="back" />
                    </Button>
                </HeaderActionSlot>
            } />
            <Page centered>
                <Card width={384} centered>
                    <H1>Settings <Image id={"gear"} size="xl"/></H1>
                </Card>
            </Page>
        </>
    )
}