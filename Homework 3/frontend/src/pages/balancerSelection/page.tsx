import { FC } from "react";
import { Spin } from "../../components/animate/spin";
import { Card } from "../../components/card/card";
import { Header } from "../../components/header/header";
import { HeaderActionSlot } from "../../components/header/headerActionsSlot";
import { Image } from "../../components/image/image";
import { Button } from "../../components/input/button";
import { ButtonRow } from "../../components/input/buttonRow";
import { Form } from "../../components/input/form";
import { TextField } from "../../components/input/textfield";
import { List } from "../../components/list/list";
import { Page } from "../../components/page/page";
import { Spacing } from "../../components/spacing/spacing";
import { H1 } from "../../components/typography/h1";
import { P } from "../../components/typography/p";
import { useLoadBalancerSelectionPageLogic } from "./logic";

export const BalancerSelectionPage: FC = () => {
    const logic = useLoadBalancerSelectionPageLogic()

    return (
        <>
            <Header right={
                <HeaderActionSlot >
                    <Button onClick={logic.onClickOnSettings}>
                        <Image id="gear" />
                    </Button>
                </HeaderActionSlot>
            } />
            <Page centered>
                <Card>
                    <Form onSubmit={logic.onSubmit}>
                        <H1>Node selection <Image id="project" size="xl"/></H1>
                        <P>Please select the root load balancer.</P>
                        <List>
                            <TextField value={logic.host} onChange={logic.setHost} invalid={!logic.isHostValid} placeholder="IP address" />
                            <TextField value={logic.port} onChange={logic.setPort} invalid={!logic.isPortValid} placeholder="Port number" />
                        </List>
                        <Spacing spacing="m" />
                        <ButtonRow>
                            <Button onClick={logic.onClickOnClear} type="button">Clear</Button>
                            <Button disabled={logic.isSubmitDisabled} type="submit">
                                {!logic.isLoading
                                    ? 'Set'
                                    : <Spin >
                                        <Image id="gear" />
                                    </Spin >
                                }
                            </Button>
                        </ButtonRow>
                    </Form>
                </Card>
            </Page>
        </>
    )
}
