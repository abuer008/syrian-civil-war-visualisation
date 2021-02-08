import {DATA_TYPES} from "./Types";

// const protocol = 'http';
// const host = 'localhost';
// const port = 8080;
//
// export const dev_urls = {
//     [DATA_TYPES.COORDINATION]: `${protocol}://${host}:${port}/api`,
//     [DATA_TYPES.SUM]: `${protocol}://${host}:${port}/api/year`,
//     [DATA_TYPES.DETAILS]: `${protocol}://${host}:${port}/api/id`
// }

export const dev_urls = {
    [DATA_TYPES.COORDINATION]: `/api`,
    [DATA_TYPES.SUM]: `/api/year`,
    [DATA_TYPES.DETAILS]: `/api/id`
}