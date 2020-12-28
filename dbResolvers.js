const ObjectID = require('mongodb').ObjectID
let geoSyria;
const db = process.env.MONGODB_DB
const collection = "GeoSyria"

module.exports = class {
    static async DbAccess(conn) {
        if (geoSyria) {
            return
        }
        try {
            geoSyria = conn.db(db).collection(collection);
        } catch (e) {
            console.error('Uable connect to Database...' + e.message);
        }

    }

    static async getGeneralData() {
        let arrayPipeline;
        try {
            arrayPipeline = [
                {
                    $project: {
                        year: 1,
                        latitude: 1,
                        longitude: 1,
                        deaths_num: '$high'
                    }
                }, {$sort: {deaths_num: -1}}, {$skip: 6}];
            return await geoSyria.aggregate(arrayPipeline).toArray();
        } catch (e) {
            console.error(`error to get data ${e}`)
            return [];
        }
    }

    static async getSumData({year}) {
        let sumPipeline;
        try {
            let filter = (year ? {$eq: ['$year', parseInt(year)]} : null)
            let isMatch = (year ? true : null)
            console.log(isMatch)
            sumPipeline = [{
                $group: {
                    _id: filter,
                    total_deaths: {
                        $sum: '$high'
                    }
                }
            }, {
                $match: {
                    _id: isMatch
                }
            }];
            return await geoSyria.aggregate(sumPipeline).next();
        } catch (e) {
            console.error(`db server: ${e}`)
            return [];
        }
    }

    static async getDetailData({id}) {
        console.log("DataBase_getDetailData_id: " + id)
        try {
            return await geoSyria.find({_id: ObjectID(id)}).project({
                high: 1,
                where_coordinates: 1,
                source_headline: 1,
                source_office: 1,
                date_start: 1,
                date_end: 1,
                latitude: 1,
                longitude: 1
            }).next()
        } catch (e) {
            console.error(`db detail: ${e.message}`)
            return []
        }
    }
}

