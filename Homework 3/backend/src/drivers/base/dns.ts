export interface IDNSClient {
    resolve4(hostname: string): Promise<string[]>
}
