import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Peer, Statistics, ToTimeSeries, WithTimestamp } from "./types";
import { getPeersRequest, getStatisticsRequest } from "./api";
import { makeLinkedList } from "../../utils/linkedList";

export const balancersSlice = createSlice({
    name: 'balancers',
    initialState: () => {
        const existingStorage = localStorage.getItem('reducers/balancers/rootBalancer')
        let rootBalancer: Peer | undefined = undefined

        if (existingStorage) {
            try {
                const parsed = JSON.parse(existingStorage) as Peer
                rootBalancer = {
                    host: parsed.host,
                    port: parsed.port
                }
            } catch { }
        }

        return {
            fetching: false,
            rootBalancer,
            peers: [] as Peer[],
            statistics: new Map<Peer, ToTimeSeries<WithTimestamp<Statistics>>>()
        }
    },
    selectors: {
        rootBalancer(state) {
            return state.rootBalancer
        },
        peers(state) {
            return state.peers
        },
        statistics(state) {
            return state.statistics
        }
    },
    reducers: {
        setBaseUrl(state, action: PayloadAction<{ host: string, port: number }>) {
            state.rootBalancer = {
                host: action.payload.host,
                port: action.payload.port,
            }
        }
    },
    extraReducers(builder) {
        builder.addCase('balancers/setBaseUrl', (state) => {
            localStorage.setItem('reducers/balancers/rootBalancer', JSON.stringify(state.rootBalancer))
        })
        builder.addCase(fetchPeers.pending, (state) => {
            state.fetching = true
        })
        builder.addCase(fetchPeers.fulfilled, (state, action) => {
            state.fetching = false
            state.peers = action.payload
        })
        builder.addCase(fetchPeers.rejected, (state) => {
            state.fetching = false
        })
        builder.addCase(fetchStatistics.pending, (state) => {
            state.fetching = true
        })
        builder.addCase(fetchStatistics.fulfilled, (state, action) => {
            state.fetching = false

            for (const peer of action.payload.keys()) {
                const existingData = state.statistics.get(peer)
                const value = action.payload.get(peer)!

                if (!existingData) {
                    const timestamp = makeLinkedList<number>()
                    const tasksInQueue = makeLinkedList<number>()
                    const oneMin = makeLinkedList<number>()
                    const fiveMin = makeLinkedList<number>()
                    const fifteenMin = makeLinkedList<number>()
                    const free = makeLinkedList<number>()

                    timestamp.push(Date.now())
                    tasksInQueue.push(value.tasksInQueue)
                    oneMin.push(value.loadAverage.oneMin)
                    fiveMin.push(value.loadAverage.fiveMin)
                    fifteenMin.push(value.loadAverage.fifteenMin)
                    free.push(value.memory.free)

                    state.statistics.set(peer, {
                        timestamp,
                        tasksInQueue,
                        loadAverage: {
                            oneMin,
                            fiveMin,
                            fifteenMin
                        },
                        memory: {
                            free
                        },
                    })

                    continue
                }

                if (existingData.timestamp.length > 100) {
                    existingData.timestamp.shift()
                    existingData.tasksInQueue.shift()
                    existingData.loadAverage.oneMin.shift()
                    existingData.loadAverage.fiveMin.shift()
                    existingData.loadAverage.fifteenMin.shift()
                    existingData.memory.free.shift()
                }

                existingData.timestamp.push(Date.now())
                existingData.tasksInQueue.push(value.tasksInQueue)
                existingData.loadAverage.oneMin.push(value.loadAverage.oneMin)
                existingData.loadAverage.fiveMin.push(value.loadAverage.fiveMin)
                existingData.loadAverage.fifteenMin.push(value.loadAverage.fifteenMin)
                existingData.memory.free.push(value.memory.free)

                state.statistics.set(peer, existingData)
            }
        })
        builder.addCase(fetchStatistics.rejected, (state) => {
            state.fetching = false
        })
    },
})

export type BalancersState = ReturnType<typeof balancersSlice.getInitialState>
export type BalancersActions = typeof balancersSlice.actions

export const getRootBalancer = balancersSlice.selectors.rootBalancer
export const getPeers = balancersSlice.selectors.peers
export const getStatistics = balancersSlice.selectors.statistics

export const setBaseUrl = balancersSlice.actions.setBaseUrl

export const fetchPeers = createAsyncThunk<
    Peer[],
    void,
    { state: BalancersState }
>('balancers/getPeers', async (_arg, thunkAPI) => {
    const state = thunkAPI.getState()

    if (!state.rootBalancer) {
        return []
    }

    const peers = await getPeersRequest(state.rootBalancer)
    return peers
})

export const fetchStatistics = createAsyncThunk<
    Map<Peer, Statistics>,
    void,
    { state: BalancersState }
>('balancers/getStatistics', async (_arg, thunkAPI) => {
    const state = thunkAPI.getState()
    const statistics = new Map<Peer, Statistics>()

    for (const peer of state.peers) {
        statistics.set(peer, await getStatisticsRequest(peer))
    }

    return statistics
})
