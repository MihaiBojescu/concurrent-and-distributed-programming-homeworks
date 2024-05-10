import { Spin } from "../../components/animate/spin"
import { Card } from "../../components/card/card"
import { CardCenteredElement } from "../../components/card/cardCenteredElement"
import { Image } from "../../components/image/image"
import { Button } from "../../components/input/button"
import { ButtonRow } from "../../components/input/buttonRow"
import { Form } from "../../components/input/form"
import { TextField } from "../../components/input/textfield"
import { List } from "../../components/list/list"
import { Page } from "../../components/page/page"
import { Spacing } from "../../components/spacing/spacing"
import { H1 } from "../../components/typography/h1"
import { useLoginLogic } from "./logic"

export const Login: React.FC = () => {
    const logic = useLoginLogic()

    return (
        <Page centered>
            <Card width={384}>
                <Spacing spacing="m"/>
                <CardCenteredElement>
                    <Image id="user" size="xl" scaleFactor={5} />
                </CardCenteredElement>
                <Spacing spacing="m"/>
                <Form onSubmit={logic.onSubmit}>
                    <H1>Login</H1>
                    <List>
                        <TextField value={logic.email} onChange={logic.setEmail} placeholder="Email" />
                        <TextField value={logic.password} onChange={logic.setPassword} placeholder="Password" masked />
                    </List>
                    <Spacing spacing="m" />
                    <ButtonRow>
                        <Button disabled={logic.disabled}>
                            {!logic.fetching
                                ? 'Submit'
                                : <Spin>
                                    <Image id="gear" />
                                </Spin>
                            }
                        </Button>
                        <Button onClick={logic.onGoToCreateUserClick}>
                            Create user
                        </Button>
                    </ButtonRow>
                </Form>
            </Card>
        </Page>
    )
}
