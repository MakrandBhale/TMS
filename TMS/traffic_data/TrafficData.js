const NORTH = 0, EAST = 1, SOUTH = 2, WEST = 3; 
const xmin = 10;
const xmid = 25;
const xmax = 35;

class Direction{
    constructor(identifier, density, text){
        this.identifier = identifier;
        this.density = density;
        this.deviation = 0;
        this.mean = 0;
        this.text = text;
        this.timeInSeconds = xmin;
    }

    calculateDeviation() {
        //calculating deviation and then dividing by 10
        this.deviation = (this.density - this.mean)/10;
    }

    calculateTime(){
         //calling deviationFunction which will calculate mean deviation and divide by 10;
        this.calculateDeviation();    
        // adding deviation to xmid, this deviation could be positive or negative.
        var temp = Math.round(xmid + this.deviation);

        //if after addition it gets below xmin or gets above xmax then ..
        if(temp > xmax){
            temp = xmax;
        } else if(temp < xmin){
            temp = xmin;
        }

        this.timeInSeconds = temp;
    }
}

class ResponseObject{
    constructor(text, density, timeInSeconds){
        this.text = text;
        this.density = density;
        this.timeInSeconds = timeInSeconds;
    }
}

const mapsClient = require('@google/maps').createClient({
    key:process.env.MAPKEY,
    Promise: Promise

});


// const fromLat = 18.446532;
// const fromLng = 73.859003;
// const toLat = 18.448119;
// const toLng = 73.858553;

// var origins = [fromLat + ',' + fromLng, 18.449532 + ',' + 73.858003];


function cleanRespose(res){

    var rows = res.json.rows;
    count = 0;
    var durationArray = [];
    var directionsArray = [];


    rows.forEach(element => {
        density = parseInt(element.elements[0].duration_in_traffic.value);
        text = element.elements[0].duration_in_traffic.text;
        directionsArray[count] = new Direction(count, density, text);
        count++;
        //console.log(typeof(element.elements));
        //durationArray.push(element.elements[0].duration_in_traffic);
    });

    var mean = calculateMean(directionsArray);

    // storing mean into direction array and calling calculateDeviation function
    // it will calculate deviation based on mean stored in direction object.

    directionsArray.forEach(element => {
        //storing mean in all direction objects
        element.mean = mean;
        element.calculateTime();

        //creating a response object.
        durationArray.push(new ResponseObject(element.text, element.density, element.timeInSeconds));
        //console.log(element.identifier + element.time);
    });



    
    return durationArray;
}

function calculateMean(directionsArray){
    var addition = 0;


    // Calculating addition
    directionsArray.forEach(element => {
        addition = addition + element.density;
    });

    // mean of all densities
    return Math.round(addition/directionsArray.length);
}

module.exports.getData = (res, coordinates) =>{
    mapsClient.distanceMatrix({
        origins: coordinates.origins,
        destinations: coordinates.destination,
        mode: 'driving',
        departure_time: 'now'
    })
    .asPromise()
    .then(function (childRes){
        //console.log(cleanRespose(childRes));
        res.send(cleanRespose(childRes));
    })
    .catch((err)=> {
        console.log(err);
    });
};