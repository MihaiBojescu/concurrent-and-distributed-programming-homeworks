import { Request } from "./request";
import { Response } from "./response";

export interface BaseRoute<Input, Output> {
    call(request: Request<Input>): Promise<Response<Output>>
}