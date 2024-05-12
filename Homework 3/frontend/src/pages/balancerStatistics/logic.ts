import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { eraseRootLoadBalancer, fetchPeers, getPeers, getRootBalancer, getStatistics, startFetchingStatistics, stopFetchingStatistics } from "../../reducer/balancers/reducer"
import { useAppDispatch } from "../../reducer/store"
import { unwrapResult } from "@reduxjs/toolkit"
import { addNotification } from "../../reducer/notifications/reducer"
import { useNavigate } from "react-router-dom"

export const useLoadBalancerStatistics = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const rootBalancer = useSelector(getRootBalancer)
    const peers = useSelector(getPeers)
    const statistics = useSelector(getStatistics)
    const [isPageReady, setIsPageReady] = useState(false)

    const performPageInit = useCallback(async () => {
        try {
            unwrapResult(await dispatch(fetchPeers()))
            unwrapResult(await dispatch(startFetchingStatistics()))

            setIsPageReady(true)
        } catch (error) {
            dispatch(addNotification({
                title: 'Get peers failed',
                description: (error as Error).message,
                type: 'negative'
            }))
        }
    }, [dispatch])

    useEffect(() => {
        performPageInit()
        
        return () => {
            dispatch(stopFetchingStatistics())
        }
    }, [performPageInit, dispatch])

    const onClickBack = () => {
        dispatch(eraseRootLoadBalancer())
        navigate('/app/selection')
    }

    return {
        isPageReady,
        rootBalancer,
        peers,
        statistics,

        onClickBack
    }
}