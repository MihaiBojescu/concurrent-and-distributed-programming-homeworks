import { useCallback, useContext, useEffect, useState } from "react"
import { UsersContext } from "../reducer/users/context"

export const useAuthenticated = (areReducersLoaded: boolean) => {
    const [usersState, usersDispatch] = useContext(UsersContext)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined)

    const checkIfAuthenticated = useCallback(() => {
        if (typeof isAuthenticated === 'boolean' || !areReducersLoaded) {
            return
        }

        if (usersState.login.data.isAuthenticated) {
            return setIsAuthenticated(true)
        }

        if (!usersState.login.data.tokens?.session) {
            return setIsAuthenticated(false)
        }

        if (usersState.login.fetching) {
            return
        }

        usersDispatch({ type: 'login', data: usersState.login.data.tokens })
    }, [areReducersLoaded, usersState, usersDispatch, isAuthenticated, setIsAuthenticated])

    useEffect(() => {
        checkIfAuthenticated()
    }, [checkIfAuthenticated])

    return isAuthenticated
}
