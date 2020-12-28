import {ACTION_TYPES } from "./Types";

export const dataReducer = (initialState, action) => {
    console.log("dataReducer: " + action.payload);
    switch (action.type) {
        case ACTION_TYPES.DATA_LOAD:
            return {
                ...initialState,
                [action.payload.dataType]: action.payload.conflictList
            };
        case ACTION_TYPES.DATA_FILTER:
            return {
                ...initialState,
                [action.payload.dataType]: action.payload.filter,
                [`${action.payload.dataType}_param`]: action.payload.param
            }
        case ACTION_TYPES.DATA_SUM:
            return {
                ...initialState,
                [action.payload.dataType]: action.payload.deaths
            }
        case ACTION_TYPES.DATA_DETAIL:
            return {
                ...initialState,
                [action.payload.dataType]: action.payload.detail
            }
        default:
            return initialState || {}

    }
}

