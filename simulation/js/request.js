var north, east, west, south;
var northTime, eastTime, westTime,southTime;
var northImg, eastImg, westimg, southImg;
class ResponseObject{
    constructor(id, text, density, timeInSeconds){
        this.id = id;
        this.text = text;
        this.density = density;
        this.timeInSeconds = timeInSeconds;
    }
}

function sendRequest(){
var responseJSON;

    var http = new XMLHttpRequest();
    var url = 'http://localhost:8080/get_data';
    var params = '{"coordinates":{"center":{"lat":"18.44812445","lang":"73.85852076"},"incoming":[{"direction":"top","lat":"18.44777294","lang":"73.85852076"},{"direction":"right","lat":"18.447674","lang":"73.860086"},{"direction":"bottom","lat":"18.446262","lang":"73.859085"},{"direction":"left","lat":"18.448822","lang":"73.856698"}]}}';
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            responseJSON = JSON.parse(http.responseText);
            initiateTimes(responseJSON)
            console.log(responseJSON)
        }
        else {
           // console.log(http)
        }
    }
    http.send((params))
}


function initiateTimes(responseData){
     north = document.getElementById("north")
     west = document.getElementById("west")
     east = document.getElementById("east")
     south = document.getElementById("south")

     northTime = responseData[0].timeInSeconds;
     eastTime = responseData[1].timeInSeconds;
     southTime = responseData[2].timeInSeconds;
     westTime = responseData[3].timeInSeconds;

    northImg = document.getElementById("northImage")
    eastImg = document.getElementById("eastImage")
    southImg = document.getElementById("southImage")
    westimg = document.getElementById("westImage")
    decreaseNorthTime();
    turnRed(northImg);
    turnRed(eastImg);
    turnRed(southImg);
    turnRed(westimg);

}


function turnRed(imageId){
    imageId.src = "./img/red.png"
}

function turnGreen(imageId){
    imageId.src = "./img/green.png"
}

function decreaseNorthTime(){
    
    var northInterval =  setInterval(function(){ 
        //console.log("jfg")
        turnGreen(northImg)
        if(northTime == 0){
            clearInterval(northInterval);
            decreaseEastTime();
            turnRed(northImg)
        }
            
        north.innerHTML = northTime
        northTime = northTime-1
        
    }, 1000);
}

function decreaseEastTime(){
    turnGreen(eastImg)
    var eastnterval =  setInterval(function(){ 
        //console.log("jfg")
        if(eastTime == 0){
            clearInterval(eastnterval);
            decreaseSouthTime();
            turnRed(eastImg)
        }
            
        east.innerHTML = eastTime
        eastTime = eastTime-1
        
    }, 1000);
}    

function decreaseWestTime(){
    turnGreen(westimg)
    var westInterval =  setInterval(function(){ 
        //console.log("jfg")
        if(westTime == 0){
            clearInterval(westInterval)
            sendRequest();
            turnRed(westimg)
        }
           
        west.innerHTML = westTime
        westTime = westTime-1
        
    }, 1000);
}

function decreaseSouthTime(){
    turnGreen(southImg)
    var southInterval =  setInterval(function(){ 
        //console.log("jfg")
        if(southTime == 0){
            clearInterval(southInterval)
            decreaseWestTime();
            turnRed(southImg)
        }
            
        south.innerHTML = southTime
        southTime = southTime-1
       
    }, 1000);

}