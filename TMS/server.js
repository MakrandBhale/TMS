const express = require("express");
require("dotenv").config();
const trafficData = require("./traffic_data/TrafficData");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.listen(8080, function(){
    console.log("Server is running on port 8080");
});


console.log(process.env.MAPKEY);

app.post("/get_data", async function(req, res){
    trafficData.getData(res, cleanRequest(req.body.coordinates));
});


function cleanRequest(req){
    // IMP : Currently not optimised for less than 4 directions.
    var destination = req.center.lat + ',' + req.center.lang;
    var origins = [];
    req.incoming.forEach(element => {
        origins.push(element.lat + ',' + element.lang);
    });

    // var top = req.top.lat + ',' + req.top.lang;
    // var right = req.right.lat + ',' + req.right.lang;
    // var bottom = req.bottom.lat + ',' + req.bottom.lang;
    // var left = req.left.lat + ',' + req.left.lang;
    // var origins = [top, right, bottom, left];
    return {destination, origins};
}
