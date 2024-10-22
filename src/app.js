require('express-async-errors');
const path = require("path");
const express = require("express");
const bodyParser = require('body-parser');
const mongoose  = require("mongoose");
const app = express();
const cors = require("cors");
const { MONGO_URL } = require('./config/environment');
const router = require("./routes/router");
const {errorHandler} = require("./middlewares/error");
const { JSONresponseFormatter } = require('./middlewares/responseFormatter');

//MongoDb connection
mongoose.connect(MONGO_URL).then(()=>{console.log("MongoDB is connected")})
 .catch((err)=>{console.error(err)});


//middleware
app.use(express.static(path.join(__dirname, "../public")))
app.use(cors());
app.use(bodyParser.json({limit : '50mb',extended : true}));
app.use(bodyParser.urlencoded({limit: '50mb',extended : true}));
app.use(express.json());

//format Json response
app.use(JSONresponseFormatter);
//Health check route
app.get("/", (_, res)=> {
  return res.status(201).json("application is running")
});

//Api routes
app.use('/api', router);


//Handle error
app.use(errorHandler);

module.exports = { app };