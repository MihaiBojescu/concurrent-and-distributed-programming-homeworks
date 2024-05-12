import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Peer, Statistics, ToTimeSeries, WithTimestamp } from "./types";
import { getPeersRequest, getStatisticsRequest } from "./api";
import { makeLinkedList } from "../../utils/linkedList";

export const balancersSlice = createSlice({
    name: 'balancers',
    initialState: {
        fetching: false,
        rootBalancer: {
            host: '',
            port: -1
        },
        peers: [] as Peer[],
        statistics: new Map<Peer, ToTimeSeries<WithTimestamp<Statistics>>>()
    },
    reducers: {
        setBaseUrl(state, action: PayloadAction<{ host: string, port: number }>) {
            state.rootBalancer.host = action.payload.host
            state.rootBalancer.port = action.payload.port
        }
    },
    extraReducers(builder) {
        builder.addCase(getPeers.pending, (state) => {
            state.fetching = true
        })
        builder.addCase(getPeers.fulfilled, (state, action) => {
            state.fetching = false
            state.peers = action.payload
        })
        builder.addCase(getPeers.rejected, (state) => {
            state.fetching = false
        })
        builder.addCase(getStatistics.pending, (state) => {
            state.fetching = true
        })
        builder.addCase(getStatistics.fulfilled, (state, action) => {
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
        builder.addCase(getStatistics.rejected, (state) => {
            state.fetching = false
        })
    },
})

export type BalancersState = ReturnType<typeof balancersSlice.getInitialState>
export type BalancersActions = typeof balancersSlice.actions

const getPeers = createAsyncThunk<
    Peer[],
    void,
    { state: BalancersState }
>('balancers/get-peers', async (_arg, thunkAPI) => {
    const state = thunkAPI.getState()
    const peer: Peer = {
        host: state.rootBalancer.host,
        port: state.rootBalancer.port
    }

    const peers = await getPeersRequest(peer)
    return peers
})

const getStatistics = createAsyncThunk<
    Map<Peer, Statistics>,
    void,
    { state: BalancersState }
>('balancers/get-peers', async (_arg, thunkAPI) => {
    const state = thunkAPI.getState()
    const statistics = new Map<Peer, Statistics>()

    for (const peer of state.peers) {
        statistics.set(peer, await getStatisticsRequest(peer))
    }

    return statistics
})
