const express = require('express');
const bodyParser = require('body-parser');
const Router = require('express').Router;
const apiCtrl = require('./apiController.js');
const cors = require('cors');


const apiQuery = new Router();
apiQuery.route("/").get(apiCtrl.responseData);
apiQuery.route('/year').get(apiCtrl.responseSumData);
apiQuery.route('/id').get(apiCtrl.responseDetailData);


const app = express();
app.use(cors());
// process.env.NODE_ENV !== 'prod' || app.use(morgan("dev"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use("/api", apiQuery);

module.exports = app;



