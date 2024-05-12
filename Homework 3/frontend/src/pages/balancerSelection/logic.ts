import { useDispatch } from "react-redux"
import { setRootLoadBalancer } from "../../reducer/balancers/reducer"
import { useCallback, useEffect, useState } from "react"

export const useLoadBalancerSelection = () => {
    const dispatch = useDispatch()
    const [host, setHost] = useState('127.0.0.1')
    const [port, setPort] = useState('2024')
    const [isHostValid, setIsHostValid] = useState(true)
    const [isPortValid, setIsPortValid] = useState(true)

    const submit = useCallback(() => {
        if (!isHostValid || !isPortValid) {
            return
        }

        dispatch(setRootLoadBalancer({ host, port: Number(port) }))
    }, [isHostValid, isPortValid, host, port, dispatch])

    const clear = () => {
        setHost('127.0.0.1')
        setPort('2024')
    }

    useEffect(() => {
        const portNumber = Number(port.trim())

        setIsHostValid(/^([1-9][0-9]{0,2}|0)(\.([1-9][0-9]{0,2}|0)){3}$/.test(host.trim()))
        setIsPortValid(!Number.isNaN(portNumber) && portNumber > 1 && portNumber < 65535)
    }, [host, port])

    const isSubmitDisabled = !isHostValid || !isPortValid

    return {
        host,
        port,
        setHost,
        setPort,

        isHostValid,
        isPortValid,

        submit,
        isSubmitDisabled,

        clear
    }
}