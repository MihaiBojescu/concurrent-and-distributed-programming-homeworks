import { FC } from "react";
import { Card } from "../../components/card/card";
import { TextField } from "../../components/input/textfield";
import { List } from "../../components/list/list";
import { Page } from "../../components/page/page";
import { H1 } from "../../components/typography/h1";
import { P } from "../../components/typography/p";
import { useLoadBalancerSelection } from "./logic";
import { Button } from "../../components/input/button";
import { ButtonRow } from "../../components/input/buttonRow";
import { Form } from "../../components/input/form";
import { Spacing } from "../../components/spacing/spacing";

export const BalancerSelectionPage: FC = () => {
    const logic = useLoadBalancerSelection()

    return (
        <Page centered>
            <Card>
                <Form onSubmit={logic.submit}>
                    <H1>Balancer selection</H1>
                    <P>Please select the root load balancer</P>
                    <List>
                        <TextField value={logic.host} onChange={logic.setHost} invalid={logic.isHostValid} />
                        <TextField value={logic.port} onChange={logic.setPort} invalid={logic.isPortValid} />
                    </List>
                    <Spacing spacing="m" />
                    <ButtonRow>
                        <Button onClick={logic.clear} type="button">Clear</Button>
                        <Button disabled={logic.isSubmitDisabled} type="submit">Set</Button>
                    </ButtonRow>
                </Form>
            </Card>
        </Page>
    )
}
