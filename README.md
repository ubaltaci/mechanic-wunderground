
````javascript

var MechanicWeather = require("mechanic-weather");

// initialize mechanic-weather
var mechanicWeather = new MechanicWeather({apiKey: "{apiKey}"}, rateLimit, rateTime);

// fire it up
mechanicWeather.getForecast([
    {
        id: "{some unique id}",
        latitude: "{latitude}",
        longitude: "{longitude}"
    },
    // ...
    ], (error, results) => {
	    // [
	    //    {
	    //        id: "{id}",
	    //        hourly: [
	    //            // ...
	    //        ]
	    //    },
	    //    {
        //        id: "{id}",
        //        hourly: [
        //            // ...
        //        ]
        //    },
	    //]
	});
````