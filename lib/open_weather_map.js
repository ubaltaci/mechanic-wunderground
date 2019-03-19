/**
 *
 */

"use strict";

const Async = require("async");
const Request = require("request");
const RateLimiter = require("limiter").RateLimiter;

const Mapping = require("./owm_to_wg_mapping");

const SECONDS = 1000;

class OpenWeatherMap {

    constructor(apiKey, rateLimit, rateTime) {

        if (!apiKey) {
            throw new Error("You must supply apiKey");
        }

        // default -> 10 times allowed in a minute
        rateLimit = rateLimit || 10;
        rateTime = rateTime || 60 * SECONDS;

        this.apiKey = apiKey;
        this.limiter = new RateLimiter(rateLimit, rateTime);
        // wait time when limit exceeded, min wait time -> 10 seconds
        this.waitTime = Math.max(rateTime / rateLimit, 10 * SECONDS);
    }

    getForecast(locationArray, callback) {

        let forecasts = [];

        if (!locationArray || !locationArray.length) {
            return callback(new Error("Location array can not be blank."));
        }

        Async.eachSeries(locationArray, (location, eachCallback) => {

            this._makeRequest(location, (error, forecast) => {

                if (error) {
                    console.error("Error during OpenWeatherMap:");
                    console.error(error);
                    return eachCallback();
                }

                forecasts.push({
                    id: location.id,
                    hourly: this._transformWeatherData(forecast)
                });

                return eachCallback();
            });

        }, (error) => {

            if (error) {
                return callback(error);
            }

            return callback(null, forecasts);
        });
    }

    _makeRequest(location, callback) {

        this.limiter.removeTokens(1, (error, remainingRequests) => {

            if (remainingRequests < 0) { // Sleep(?) if request count exceed.
                return setTimeout(() => {
                    this._makeRequest(location, callback);
                }, this.waitTime);
            }

            const url = `http://api.openweathermap.org/data/2.5/forecast?units=metric&APPID=${this.apiKey}&lat=${location.latitude}&lon=${location.longitude}`;

            Request(url, (error, response, body) => {

                if (error || response.statusCode !== 200) {
                    return callback(error || "Status Code is not 200.");
                }

                body = JSON.parse(body);

                return callback(null, body);
            });

        });
    }

    _transformWeatherData(weatherData) {
        // console.log(JSON.stringify(weatherData, null, 3));
        console.log(`AREA: ${weatherData.city && weatherData.city.name} - ${weatherData.cnt} weather conditions fetched from API.`);


        const cleanWeatherData = weatherData.list.filter((hourlyData) => {
            return hourlyData.weather && hourlyData.weather.length;
        });

        return cleanWeatherData.map((hourlyData) => {
            return {
                "FCTTIME": {
                    epoch: hourlyData.dt
                },
                temp: {
                    metric:  hourlyData.main.temp
                },
                condition: hourlyData.weather[0].main, // Clouds
                description: hourlyData.weather[0].description, // overcast clouds
                condition_id: hourlyData.weather[0].id, // https://openweathermap.org/weather-conditions
                icon: __arrangeIconName(hourlyData.weather[0].id)
            }
        });

        function __arrangeIconName(conditionCode) {

            const conditionCodeToMatch = `${conditionCode}`;

            // check all regex
            const key = Object.keys(Mapping).find((regex) => {
                return conditionCodeToMatch.match(new RegExp(regex));
            });

            const icon = Mapping[key];
            if (icon) {
                return icon;
            }

            return "unknown";
        }
    }
}

module.exports = OpenWeatherMap;
