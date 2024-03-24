import { Reducer, ReducerAction, ReducerState, useCallback, useReducer } from "react";

export type ReducerSideEffect<R extends Reducer<any, any>, A extends ReducerAction<R> = ReducerAction<R>> = (
    state: ReducerState<R>,
    action: A,
    dispatch: (action: ReducerAction<R>) => void,
) => void

export const useReducerWithSideEffects = <R extends Reducer<any, any>>(
    reducer: R,
    sideEffects: ReducerSideEffect<R>,
    initialState: ReducerState<R>,
): [ReducerState<R>, (action: ReducerAction<R>) => void] => {
    const [hiddenState, hiddenDispatch] = useReducer(reducer, initialState)

    const dispatch = useCallback((action: ReducerAction<R>) => {
        hiddenDispatch(action)
        sideEffects(hiddenState, action, dispatch)
    }, [hiddenState, hiddenDispatch])

    return [hiddenState, dispatch]
}
