import { FC } from "react";
import { Page } from "../../components/page/page";
import { Card } from "../../components/card/card";
import { H1 } from "../../components/typography/h1";
import { useLoadBalancerStatistics } from "./logic";
import { CardList } from "../../components/card/cardList";
import { Visualisation } from "../../components/visualisations/visualisation";
import { P } from "../../components/typography/p";
import { Header } from "../../components/header/header";
import { HeaderActionSlot } from "../../components/header/headerActionsSlot";
import { Button } from "../../components/input/button";
import { Image } from "../../components/image/image";
import { Spin } from "../../components/animate/spin";

export const BalancerStatisticsPage: FC = () => {
    const logic = useLoadBalancerStatistics()

    return (
        <>
            <Header left={
                <HeaderActionSlot>
                    <Button onClick={logic.onClickBack}>
                        <Image id="back" size="m" />
                    </Button>
                </HeaderActionSlot>
            } />
            <Page centered>
                {!logic.isPageReady
                    ? (
                        <Card centered noBorder noShadow>
                            <Spin>
                                <Image id="gear" size="xl" scaleFactor={2} />
                            </Spin>
                            <H1>Application is loading</H1>
                        </Card>
                    )
                    : (
                        <CardList direction="row">
                            {logic.peers.map(peer => {
                                const tokenisedPeer = JSON.stringify(peer)
                                const data = logic.statistics[tokenisedPeer]

                                if (!data) {
                                    return <></>
                                }

                                return (
                                    <Card width={512}>
                                        <H1>Node</H1>
                                        <P>{`Address: ${peer.host}:${peer.port}`}</P>
                                        <P>Is root: {`${peer === logic.rootBalancer ? '✔️' : '❌'}`}</P>
                                        <Visualisation
                                            visualisationId={`${tokenisedPeer}/tasksInQueue`}
                                            name="Tasks in queue"
                                            type="area"
                                            timestamps={data.timestamp}
                                            data={data.tasksInQueue}
                                        />
                                        <Visualisation
                                            visualisationId={`${tokenisedPeer}/loadAverage/oneMin`}
                                            name="Load average (1 min)"
                                            type="area"
                                            timestamps={data.timestamp}
                                            data={data.loadAverage.oneMin}
                                        />
                                        <Visualisation
                                            visualisationId={`${tokenisedPeer}/loadAverage/fiveMin`}
                                            name="Load average (5 min)"
                                            type="area"
                                            timestamps={data.timestamp}
                                            data={data.loadAverage.fiveMin}
                                        />
                                        <Visualisation
                                            visualisationId={`${tokenisedPeer}/loadAverage/fifteenMin`}
                                            name="Load average (5 min)"
                                            type="area"
                                            timestamps={data.timestamp}
                                            data={data.loadAverage.fifteenMin}
                                        />
                                        <Visualisation
                                            visualisationId={`${tokenisedPeer}/memory/free`}
                                            name="Free memory (MB)"
                                            type="area"
                                            timestamps={data.timestamp}
                                            data={data.memory.free}
                                        />
                                    </Card>
                                )
                            })}
                        </CardList>
                    )}
            </Page>
        </>
    )
}
