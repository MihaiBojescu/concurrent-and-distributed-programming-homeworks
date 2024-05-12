import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../reducer/store"
import { setSettings } from "../../reducer/settings/reducer"
import { unwrapResult } from "@reduxjs/toolkit"
import { addNotification } from "../../reducer/notifications/reducer"

export const useSettingsPageLogic = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [fetchingInterval, setFetchingInterval] = useState('2000')
    const [fetchingInstances, setFetchingInstances] = useState('60')
    const [isFetchingIntervalValid, setIsFetchingIntervalValid] = useState(true)
    const [isFetchingInstancesValid, setIsFetchingInstancesValid] = useState(true)

    const isSubmitDisabled = !isFetchingIntervalValid

    const onSubmit = useCallback(async () => {
        if (isSubmitDisabled) {
            return
        }
        try {
            unwrapResult(await dispatch(setSettings({
                fetching: {
                    interval: Number(fetchingInterval),
                    instances: Number(fetchingInstances)
                }
            })))

            dispatch(addNotification({
                title: 'Settings saved',
                description: 'Redirecting...',
                type: 'positive'
            }))
            navigate(-1)
        } catch (error) {
            dispatch(addNotification({
                title: 'Settings discarded',
                description: (error as Error)?.message,
                type: 'negative'
            }))
        }
    }, [fetchingInterval, fetchingInstances, isSubmitDisabled, navigate, dispatch])

    useEffect(() => {
        const fetchIntervalNumber = Number(fetchingInterval.trim())
        const instancesNumber = Number(fetchingInstances.trim())

        setIsFetchingIntervalValid(!Number.isNaN(fetchIntervalNumber) && fetchIntervalNumber > 999 && fetchIntervalNumber < 10001)
        setIsFetchingInstancesValid(!Number.isNaN(instancesNumber) && instancesNumber > 9 && instancesNumber < 61)
    }, [fetchingInterval, fetchingInstances])

    const onClickBack = () => {
        navigate(-1)
    }

    return {
        fetchingInterval,
        fetchingInstances,
        setFetchingInterval,
        setFetchingInstances,
        isFetchingIntervalValid,
        isFetchingInstancesValid,

        onSubmit,
        isSubmitDisabled,

        onClickBack
    }
}