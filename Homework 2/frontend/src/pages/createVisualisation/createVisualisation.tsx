import { Form } from "react-router-dom"
import { Spin } from "../../components/animate/spin"
import { Card } from "../../components/card/card"
import { CardCenteredElement } from "../../components/card/cardCenteredElement"
import { Header } from "../../components/header/header"
import { HeaderActionSlot } from "../../components/header/headerActionsSlot"
import { Image } from "../../components/image/image"
import { Button } from "../../components/input/button"
import { Dropdown } from "../../components/input/dropdown"
import { TextField } from "../../components/input/textfield"
import { List } from "../../components/list/list"
import { Page } from "../../components/page/page"
import { Spacing } from "../../components/spacing/spacing"
import { H1 } from "../../components/typography/h1"
import { useCreateVisualisationPageLogic } from "./logic"


export const CreateVisualisation: React.FC = () => {
    const logic = useCreateVisualisationPageLogic()

    return (
        <>
            <Header left={
                <HeaderActionSlot>
                    <Button onClick={logic.onGoToVisualisationsList}>
                        <Image id="back" />
                    </Button>
                </HeaderActionSlot>
            } />
            <Page centered>
                <Card width={384}>
                    <Spacing spacing="m" />
                    <CardCenteredElement>
                        <Image id="chart" size="xl" scaleFactor={5} />
                    </CardCenteredElement>
                    <Spacing spacing="m" />

                    <Form onSubmit={logic.onSubmit}>
                        <H1>Create visualisation</H1>
                        <List>
                            <TextField value={logic.name} onChange={logic.setName} placeholder="Name" invalid={!logic.nameValid} />
                            <TextField value={logic.description} onChange={logic.setDescription} placeholder="Description" invalid={!logic.descriptionValid} />
                            <Dropdown value={logic.type} onChange={logic.setType}>
                                <option value="line">Line</option>
                                <option value="bar">Bar</option>
                                <option value="area">Area</option>
                                <option value="pie">Pie</option>
                                <option value="donut">Donut</option>
                                <option value="heatmap">Heatmap</option>
                                <option value="scatter">Scatter</option>
                            </Dropdown>
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