require('dotenv/config');

const http = require("http");

const {PORT} = require("./src/config/environment");
const {app} = require("./src/app");

const server = http.createServer(app);

server.listen(PORT, ()=> console.log("application start on port:" + PORT));