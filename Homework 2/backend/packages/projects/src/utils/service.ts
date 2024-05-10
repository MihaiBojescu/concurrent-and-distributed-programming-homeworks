export interface BaseService<Input, Output> {
    call(input: Input): Promise<Output>
}
