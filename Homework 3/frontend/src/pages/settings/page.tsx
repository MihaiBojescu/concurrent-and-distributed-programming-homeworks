import { FC } from "react";
import { Page } from "../../components/page/page";
import { Card } from "../../components/card/card";
import { H1 } from "../../components/typography/h1";
import { Image } from "../../components/image/image";
import { useSettingsPageLogic } from "./logic";
import { Header } from "../../components/header/header";
import { HeaderActionSlot } from "../../components/header/headerActionsSlot";
import { Button } from "../../components/input/button";
import { List } from "../../components/list/list";
import { TextField } from "../../components/input/textfield";
import { Spacing } from "../../components/spacing/spacing";
import { P } from "../../components/typography/p";
import { Form } from "../../components/input/form";

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
                <Form onSubmit={logic.onSubmit}>
                    <Card width={384}>
                        <H1>Settings <Image id={"gear"} size="xl" /></H1>
                        <P>Data fetching</P>
                        <List>
                            <TextField value={logic.fetchingInterval} onChange={logic.setFetchingInterval} invalid={!logic.isFetchingIntervalValid} placeholder="Fetch interval (ms, [1000, 10000])" />
                            <TextField value={logic.fetchingInstances} onChange={logic.setFetchingInstances} invalid={!logic.isFetchingInstancesValid} placeholder="Instances (number, [10, 60])" />
                        </List>
                        <Spacing spacing="m" />
                        <Button disabled={logic.isSubmitDisabled} type="submit">Set</Button>
                    </Card>
                </Form>
            </Page>
        </>
    )
}