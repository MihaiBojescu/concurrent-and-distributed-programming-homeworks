import { Form } from "react-router-dom"
import { Spin } from "../../components/animate/spin"
import { Card } from "../../components/card/card"
import { CardCenteredElement } from "../../components/card/cardCenteredElement"
import { Header } from "../../components/header/header"
import { HeaderActionSlot } from "../../components/header/headerActionsSlot"
import { Image } from "../../components/image/image"
import { Button } from "../../components/input/button"
import { TextField } from "../../components/input/textfield"
import { List } from "../../components/list/list"
import { Page } from "../../components/page/page"
import { Spacing } from "../../components/spacing/spacing"
import { H1 } from "../../components/typography/h1"
import { useCreateTokenPageLogic } from "./logic"


export const CreateToken: React.FC = () => {
    const logic = useCreateTokenPageLogic()

    return (
        <>
            <Header left={
                <HeaderActionSlot>
                    <Button onClick={logic.onGoToTokensList}>
                        <Image id="back" />
                    </Button>
                </HeaderActionSlot>
            } />
            <Page centered>
                <Card width={384}>
                    <Spacing spacing="m" />
                    <CardCenteredElement>
                        <Image id="project" size="xl" scaleFactor={5} />
                    </CardCenteredElement>
                    <Spacing spacing="m" />

                    <Form onSubmit={logic.onSubmit}>
                        <H1>Create token</H1>
                        <List>
                            <TextField value={logic.name} onChange={logic.setName} placeholder="Name" invalid={!logic.nameValid} />
                            <TextField value={logic.description} onChange={logic.setDescription} placeholder="Description" invalid={!logic.descriptionValid} />
                        </List>
                        <Spacing spacing="m" />
                        <Button disabled={logic.disabled}>
                            {!logic.fetching
                                ? 'Submit'
                                : <Spin>
                                    <Image id="gear" />
                                </Spin>
                            }
                        </Button>
                    </Form>
                </Card>
            </Page>
        </>
    )
}