const DbAccess = require('./dbResolvers');

module.exports = class {
    static async responseData(req, res, next) {
        try {
            let response = await DbAccess.getGeneralData();
            if (!response) {
                res.status(404).json({api_error: 'Not found'});
                return
            }
            return res.json(response);
        } catch (e) {
            console.log(`api server, ${e}`);
        }
    }

    static async responseSumData(req, res, next) {
        console.log("responseSum_query: " + req.query)
        try {
            let response = await DbAccess.getSumData(req.query);
            if (!response) {
                res.status(404).json({api_error: 'Not found'});
                return
            }
            return res.json(response);
        } catch (e) {
            console.error(`api server: ${e}`)
        }
    }

    static async responseDetailData(req, res, next) {
        if (req.query.id) {
            try {
                let response = await DbAccess.getDetailData(req.query);
                if (!response) {
                    res.status(404).json({api_error: 'Not found'});
                    return
                }
                return res.json(response);
            } catch (e) {
                console.error(`api server: ${e}`)
            }
        } console.error(`query server: ${req.query}`)
    }
}
