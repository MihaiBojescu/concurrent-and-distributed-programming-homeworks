import { CardList } from "../../components/card/cardList";
import { Header } from "../../components/header/header";
import { HeaderActionSlot } from "../../components/header/headerActionsSlot";
import { Image } from "../../components/image/image";
import { Button } from "../../components/input/button";
import { Page } from "../../components/page/page";
import { AddMoreVisualisations } from "../../components/visualisations/addMoreVisualisations";
import { NewVisualisation } from "../../components/visualisations/newVisualisation";
import { Visualisation } from "../../components/visualisations/visualisation";
import { useVisualisationsPageLogic } from "./logic";


export const Visualisations: React.FC = () => {
    const logic = useVisualisationsPageLogic()

    return (
        <>
            <Header left={
                <HeaderActionSlot>
                    <Button onClick={logic.onGoToProjectsList}>
                        <Image id="back" />
                    </Button>
                </HeaderActionSlot>
            } />
            <Page centered>
                {
                    logic.visualisations.length === 0 && (
                        <NewVisualisation onGoToCreateVisualisation={logic.onGoToCreateVisualisation} />
                    )
                }
                {
                    logic.visualisations.length > 0 && (
                        <CardList>
                            <>
                                {
                                    logic.visualisations.map(visualisation => (
                                        <Visualisation
                                            key={visualisation.visualisation_id}
                                            visualisationId={visualisation.visualisation_id}
                                            name={visualisation.name}
                                            description={visualisation.description}
                                            type={visualisation.type}
                                            data={logic.data[visualisation.visualisation_id] || []}
                                        />
                                    ))
                                }
                            </>
                            <AddMoreVisualisations onGoToCreateVisualisation={logic.onGoToCreateVisualisation} />
                        </CardList>
                    )
                }
            </Page>
        </>
    )
};
