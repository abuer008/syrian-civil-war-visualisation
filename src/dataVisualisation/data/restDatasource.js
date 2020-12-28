import {dev_urls} from "./urls";
const Axios = require('axios').default;

export class RestDataSource {
    constructor(errHandler) {
        this.error_handler = errHandler || (() => {});
    }
    getBasicData = (dataType, params) => this.datarequest("get", dev_urls[dataType], params || {})
    datarequest = (method, url, params) => Axios.request({method, url, params});
}
