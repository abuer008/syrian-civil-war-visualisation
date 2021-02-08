const app = require('./mongoDbAccess');
const MongoClient = require('mongodb').MongoClient;
const GedsyriaDb = require('./dbResolvers');

require('dotenv').config()

const mongoUri = process.env.MONGODB_URI
const serverPort = process.env.SERVER_PORT

MongoClient.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true})
    .catch(err => {
        console.log(err);
        process.exit(1);
    })
    .then(async db => {
        await GedsyriaDb.DbAccess(db);
        app.listen(serverPort, () => {console.log(`listen on port ${serverPort}`)})

    });

