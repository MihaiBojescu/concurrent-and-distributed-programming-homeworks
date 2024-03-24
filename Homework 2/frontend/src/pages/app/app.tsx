import { useContext, useEffect, useState } from "react"
import { Page } from "../../components/page/page"
import { AuthContext } from "../../reducer/auth/context"
import { Card } from "../../components/card/card"
import { H1 } from "../../components/typography/h1"
import { useAuthenticated } from "../../hooks/useAuthenticated"

export const App: React.FC = () => {
    useAuthenticated()

    return (
        <Page centered={true}>
            <Card>
                <H1>Authenticated</H1>
            </Card>
        </Page>
    )
}