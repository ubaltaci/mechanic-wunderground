/*
 * Weather conditions
 * https://openweathermap.org/weather-conditions
 *
 * Group codes will be translated into wunderground weather conditions
 */
module.exports = {
    // Group 2xx: Thunderstorm
    // "2XX": "tstorms",
    "^2\\d\\d": "tstorms",
    // Group 3xx: Drizzle
    // "3XX": "rain",
    "^3\\d\\d": "rain",
    // Group 5xx: Rain
    // "5XX": "rain",
    "^5\\d\\d": "rain",
    // Group 6xx: Snow
    "600": "flurries",
    "620": "flurries",
    "611": "sleet",
    "612": "sleet",
    "615": "sleet",
    "616": "sleet",
    // "6XX": "snow",
    "^6\\d\\d": "snow",
    // Group 7xx: Atmosphere
    // "7XX": "hazy",
    "^7\\d\\d": "hazy",
    // Group 800: Clear (Sunny)
    "800": "clear",
    // Group 80x: Clouds
    "801": "partycloudy",
    "802": "mostlycloudy",
    // "8xx": "cloudy",
    "^8\\d\\d": "cloudy",

    // chanceflurries
    // chancerain
    // chancesleet
    // chancesnow
    // chancetstorms
    // clear
    // cloudy
    // flurries
    // fog
    // hazy
    // mostlycloudy
    // mostlysunny
    // partlycloudy
    // partlysunny
    // rain
    // sleet
    // snow
    // sunny
    // tstorms
    // unknown
};