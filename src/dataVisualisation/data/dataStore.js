import {createStore, applyMiddleware} from "redux";
import {dataReducer} from "./dataReducer";
import {asyncActions} from "./asyncMiddleware";

export const storeData = createStore(dataReducer, applyMiddleware(asyncActions));
