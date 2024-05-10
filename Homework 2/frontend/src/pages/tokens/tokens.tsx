import { CardList } from "../../components/card/cardList";
import { Header } from "../../components/header/header";
import { HeaderActionSlot } from "../../components/header/headerActionsSlot";
import { Image } from "../../components/image/image";
import { Button } from "../../components/input/button";
import { Page } from "../../components/page/page";
import { AddMoreTokens } from "../../components/tokens/addMoreTokens";
import { NewToken } from "../../components/tokens/newToken";
import { Token } from "../../components/tokens/token";
import { useTokensPageLogic } from "./logic";

export const Tokens: React.FC = () => {
    const logic = useTokensPageLogic()

    return (
        <>
            <Header left={
                <HeaderActionSlot>
                    <Button onClick={logic.onGoToProjectsList}>
                        <Image id="back" size="m" />
                    </Button>
                </HeaderActionSlot>
            } />
            <Page centered>
                {
                    logic.tokens.length === 0 && (
                        <NewToken onGoToCreateProjectToken={logic.onGoToCreateProjectToken} />
                    )
                }
                {
                    logic.tokens.length > 0 && (
                        <CardList>
                            <>
                                {
                                    logic.tokens.map(token => (
                                        <Token
                                            key={token.token_id}
                                            tokenId={token.token_id}
                                            projectId={token.project_id}
                                            name={token.name}
                                            description={token.description}
                                            token={token.token}
                                        />
                                    ))
                                }
                                <AddMoreTokens onGoToCreateProjectToken={logic.onGoToCreateProjectToken} />
                            </>
                        </CardList>
                    )
                }
            </Page>
        </>
    )
};
