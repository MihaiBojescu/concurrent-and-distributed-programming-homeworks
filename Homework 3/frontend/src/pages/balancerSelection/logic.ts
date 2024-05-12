import { verifyAndSetRootBalancer } from "../../reducer/balancers/reducer"
import { useCallback, useEffect, useState } from "react"
import { useAppDispatch } from "../../reducer/store"
import { useNavigate } from "react-router-dom"
import { unwrapResult } from "@reduxjs/toolkit"

export const useLoadBalancerSelection = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [host, setHost] = useState('127.0.0.1')
    const [port, setPort] = useState('2024')
    const [isHostValid, setIsHostValid] = useState(true)
    const [isPortValid, setIsPortValid] = useState(true)
    const [submitError, setSubmitError] = useState<undefined | string>(undefined)

    const isSubmitDisabled = !isHostValid || !isPortValid || isLoading || submitError !== undefined

    const submit = useCallback(async () => {
        try {
            if (isSubmitDisabled) {
                return
            }
    
            setIsLoading(true)
            const wrappedResult = await dispatch(verifyAndSetRootBalancer({ host, port: Number(port) }))
            unwrapResult(wrappedResult)
            setIsLoading(false)

            navigate('/app/statistics')
        } catch (error) {
            setIsLoading(false)
            setSubmitError((error as Error).message)
        }
    }, [isSubmitDisabled, dispatch, host, port, navigate])

    const clear = () => {
        setHost('127.0.0.1')
        setPort('2024')
    }

    useEffect(() => {
        const portNumber = Number(port.trim())

        setSubmitError(undefined)
        setIsHostValid(/^([1-9][0-9]{0,2}|0)(\.([1-9][0-9]{0,2}|0)){3}$/.test(host.trim()))
        setIsPortValid(!Number.isNaN(portNumber) && portNumber > 1 && portNumber < 65535)
    }, [host, port])


    return {
        host,
        port,
        setHost,
        setPort,

        isHostValid,
        isPortValid,

        submit,
        isSubmitDisabled,
        isLoading,

        clear
    }
}