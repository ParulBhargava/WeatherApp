const yargs = require ("yargs");
const axios= require ("axios");
const _ = require ("lodash");

const argv = yargs
.options({
    a:{
        demand:true,
        string:true,
        alias:"address",
        describe:"Address to fetch Weather info."
    }
})
.help()
.alias("help", "h")
.argv;

var encodeAddress = encodeURIComponent(argv.a);
var geocodeURL= `http://www.mapquestapi.com/geocoding/v1/address?key=qrtawDQsDY67QNNAWaMCF3ZdXyDYK0Ld&location=${encodeAddress}`;

    
axios.get(geocodeURL).then((response)=>{
    const mapQuestQualityCodes = ['P1', 'L1', 'I1', 'B1', 'B2', 'B3', 'A4', 'A5', 'A6', 'Z1', 'Z1', 'Z3', 'Z4'];
    const qualityCode = response.data.results[0].locations[0].geocodeQualityCode;
    
    if(_.indexOf(mapQuestQualityCodes, qualityCode.substring(0,2)) == -1){
        throw new("Error in finding location");
    }
    
    var lat=response.data.results[0].locations[0].latLng.lat;
    var lang=response.data.results[0].locations[0].latLng.lng;
    var address=response.data.results[0].providedLocation.location;
    var area=response.data.results[0].locations[0].adminArea5;
    
    var weatherURL=`https://api.darksky.net/forecast/925d08209e2583781a5c70659cdc75b2/${lat},${lang}`;

    console.log(`\nWeather Forecast for ${address}`);
    return axios.get(weatherURL);
}).then((response)=>{
    var today=response.headers.date;
    var summary =response.data.hourly.summary;
    var temperature = response.data.currently.temperature;
    var apparentTemperature=response.data.currently.apparentTemperature;
    var humidity = response.data.currently.humidity;

    console.log(`\non ${today} is : ${temperature}deg Fahrenheit \nwith ${humidity} Humidity and \nOverall Today will be ${summary}\n`);

}).catch((error)=>{
    console.log("Error in fetching : ", error);
});


