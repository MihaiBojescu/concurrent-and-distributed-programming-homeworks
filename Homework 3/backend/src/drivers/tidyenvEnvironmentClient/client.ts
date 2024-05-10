import { Specs } from "tidyenv/lib/private/types/spec";
import { tidyEnv } from "tidyenv";
import { IEnvironmentClient } from "../base/environment";

type Self<T> = {
    env: Readonly<T>
}

export const makeTidyEnvClient = <T extends Record<string, unknown>>(specs: Specs<T>): IEnvironmentClient<T> => {
    const self: Self<T> = {
        env: tidyEnv.process<T>(process.env, specs)
    }

    return {
        get: get(self)
    }
}

const get = <T>(self: Self<T>): IEnvironmentClient<T>['get'] => () => {
    return self.env
}
