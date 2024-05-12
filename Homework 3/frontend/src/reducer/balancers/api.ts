import axios from "axios";
import { Peer, Statistics } from "./types";

const balancersAPI = axios.create()

export const getPeersRequest = async (peer: Peer): Promise<Peer[]> => {
    const response = await balancersAPI.get<Peer[]>('/api/peers', {
        baseURL: `http://${peer.host}:${peer.port}`
    })
    return response.data
}

export const getStatisticsRequest = async (peer: Peer): Promise<Statistics> => {
    const response = await balancersAPI.get<Statistics>('/api/statistics', {
        baseURL: `http://${peer.host}:${peer.port}`
    })
    return response.data
}
