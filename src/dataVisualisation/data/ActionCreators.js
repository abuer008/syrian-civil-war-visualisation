import {RestDataSource} from './restDatasource';
import {ACTION_TYPES, DATA_TYPES} from "./Types";

const dataQuery = new RestDataSource();

export const getData = (dataType) => ({
    type: ACTION_TYPES.DATA_LOAD,
    payload: dataQuery.getBasicData(dataType).then(response => ({
        dataType,
        conflictList: response.data,
    }))
})

export const getTotal = (dataType, param) => ({
    type: ACTION_TYPES.DATA_SUM,
    payload: dataQuery.getBasicData(dataType, param).then(response => {
        console.log(response.data);
        return {
            dataType,
            deaths: response.data.total_deaths
        };})
})

export const getDetail = (dataType, param) => ({
    type: ACTION_TYPES.DATA_DETAIL,
    payload: dataQuery.getBasicData(dataType, param).then(response => ({
        dataType,
        detail: response.data
    }))
})

export const cleanDetail = (dataType) => ({
    type: ACTION_TYPES.DATA_DETAIL,
    payload: {
        dataType,
        detail: null
    }
})

export const filterData = (dataType, filter, param) => ({
    type: ACTION_TYPES.DATA_FILTER,
    payload: {
        dataType,
        filter,
        param
    }
})

