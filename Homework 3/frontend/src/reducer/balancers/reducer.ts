import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ToTimeSeries, WithTimestamp } from "../common/types";
import { AppDispatch, RootState } from "../store";
import { getPeersRequest, getStatisticsRequest } from "./api";
import { Peer, Statistics } from "./types";
import { Settings } from "../settings/types";
import { setSettings } from "../settings/reducer";

export type BalancersState = ReturnType<typeof balancersSlice.getInitialState>
export type BalancersActions = typeof balancersSlice.actions

export const balancersSlice = createSlice({
    name: 'balancers',
    initialState: () => {
        const existingRootBalancer = localStorage.getItem('reducers/balancers/rootBalancer')
        const existingSettings = localStorage.getItem('reducers/settings/fetching')
        let rootBalancer: Peer | undefined = undefined
        let settings: Settings['fetching'] = {
            interval: 1000,
            instances: 60,
        }

        if (existingRootBalancer) {
            try {
                rootBalancer = JSON.parse(existingRootBalancer) as Peer
            } catch { }
        }

        if (existingSettings) {
            try {
                settings = JSON.parse(existingSettings) as Settings['fetching']
            } catch { }
        }

        return {
            settings: settings,
            timer: null as NodeJS.Timeout | null,
            rootBalancer,
            peers: [] as Peer[],
            statistics: {} as Record<string, ToTimeSeries<WithTimestamp<Statistics>>>
        }
    },
    selectors: {
        getRootBalancer(state) {
            return state.rootBalancer
        },
        getPeers(state) {
            return state.peers
        },
        getStatistics(state) {
            return state.statistics
        }
    },
    reducers: {
        stopFetchingStatistics(state) {
            if (state.timer !== null) {
                clearInterval(state.timer)
            }

            state.timer = null
        },
        setPeerStatistics(state, action: PayloadAction<Record<string, Statistics>>) {
            for (const peer of Object.keys(action.payload)) {
                const existingData = state.statistics[peer]
                const value = action.payload[peer]!

                if (!existingData) {
                    const timestamp = []
                    const tasksInQueue = []
                    const oneMin = []
                    const fiveMin = []
                    const fifteenMin = []
                    const free = []

                    timestamp.push(new Date().toLocaleTimeString())
                    tasksInQueue.push(value.tasksInQueue)
                    oneMin.push(value.loadAverage.oneMin)
                    fiveMin.push(value.loadAverage.fiveMin)
                    fifteenMin.push(value.loadAverage.fifteenMin)
                    free.push(value.memory.free)

                    state.statistics[peer] = {
                        timestamp,
                        tasksInQueue,
                        loadAverage: {
                            oneMin,
                            fiveMin,
                            fifteenMin,
                        },
                        memory: {
                            free
                        },
                    }

                    continue
                }

                if (existingData.timestamp.length >= state.settings.instances) {
                    existingData.timestamp.shift()
                    existingData.tasksInQueue.shift()
                    existingData.loadAverage.oneMin.shift()
                    existingData.loadAverage.fiveMin.shift()
                    existingData.loadAverage.fifteenMin.shift()
                    existingData.memory.free.shift()
                }

                existingData.timestamp.push(new Date().toLocaleTimeString())
                existingData.tasksInQueue.push(value.tasksInQueue)
                existingData.loadAverage.oneMin.push(value.loadAverage.oneMin)
                existingData.loadAverage.fiveMin.push(value.loadAverage.fiveMin)
                existingData.loadAverage.fifteenMin.push(value.loadAverage.fifteenMin)
                existingData.memory.free.push(value.memory.free)

                state.statistics[peer] = existingData
            }
        },
    },
    extraReducers(builder) {
        builder.addCase(setSettings.fulfilled, (state, action) => {
            state.settings = action.payload.fetching
        })
        builder.addCase(verifyAndSetRootBalancer.fulfilled, (state, action) => {
            state.rootBalancer = action.payload
            localStorage.setItem('reducers/balancers/rootBalancer', JSON.stringify(action.payload))
        })
        builder.addCase(fetchPeers.fulfilled, (state, action) => {
            state.peers = action.payload
        })
        builder.addCase(startFetchingStatistics.fulfilled, (state, action) => {
            state.timer = action.payload
        })
        builder.addCase(eraseRootLoadBalancer.fulfilled, (state) => {
            state.rootBalancer = undefined
            state.peers = []
            state.statistics = {}

            if (state.timer !== null) {
                clearTimeout(state.timer)
            }

            state.timer = null

            localStorage.removeItem('reducers/balancers/rootBalancer')
        })
    },
})

export const getRootBalancer = balancersSlice.selectors.getRootBalancer
export const getPeers = balancersSlice.selectors.getPeers
export const getStatistics = balancersSlice.selectors.getStatistics
export const stopFetchingStatistics = balancersSlice.actions.stopFetchingStatistics

export const verifyAndSetRootBalancer = createAsyncThunk<
    Peer,
    Peer,
    { rejectValue: Error }
>('balancer/verifyRootBalancer', async (arg, thunkAPI) => {
    try {
        await getStatisticsRequest(arg)
        return arg
    } catch (error) {
        return thunkAPI.rejectWithValue(new Error(`Invalid root balancer\n${(error as Error).message}`))
    }
})

export const fetchPeers = createAsyncThunk<
    Peer[],
    void,
    {
        dispatch: AppDispatch,
        state: RootState;
        rejectValue: Error;
    }
>('balancers/getPeers', async (_, thunkAPI) => {
    try {
        const state = thunkAPI.getState()

        if (!state.balancers.rootBalancer) {
            return []
        }

        const peers = await getPeersRequest(state.balancers.rootBalancer)
        peers.unshift(state.balancers.rootBalancer)

        return peers
    } catch (error) {
        return thunkAPI.rejectWithValue(new Error(`Could not retrieve peers\n${(error as Error).message}`))
    }
})

export const startFetchingStatistics = createAsyncThunk<
    NodeJS.Timeout | null,
    void,
    { state: RootState }
>('balancers/getStatistics', async (_arg, thunkAPI) => {
    const state = thunkAPI.getState()

    if (!state.balancers.rootBalancer) {
        return null
    }

    if (state.balancers.timer) {
        return state.balancers.timer
    }

    const request = async () => {
        const statistics: Record<string, Statistics> = {};

        await Promise.all(state.balancers.peers.map(async (peer) => {
            try {
                const result = await getStatisticsRequest(peer);
                result.memory.free = result.memory.free / 1000000
                statistics[JSON.stringify(peer)] = result
            } catch { }
        }));

        thunkAPI.dispatch(balancersSlice.actions.setPeerStatistics(statistics));
    };

    const timer = setInterval(request, state.balancers.settings.interval)
    await request()

    return timer
})

export const eraseRootLoadBalancer = createAsyncThunk<
    void,
    void,
    {
        state: RootState,
    }
>('balancers/eraseRootLoadBalancer', (_, thunkAPI) => { })