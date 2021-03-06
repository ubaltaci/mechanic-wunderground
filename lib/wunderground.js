/**
 *
 */

"use strict";

const Async = require("async");
const Request = require("request");
const RateLimiter = require("limiter").RateLimiter;

class Wunderground {

    constructor(apiKey, rateLimit, rateTime) {

        if (!apiKey) {
            throw new Error("You must supply apiKey");
        }

        // default -> 10 times allowed in a minute
        rateLimit = rateLimit || 10;
        rateTime = rateTime || 60 * 1000;

        this.apiKey = apiKey;
        this.limiter = new RateLimiter(rateLimit, rateTime);
    }

    getForecast(locationArray, wundergroundFeature, callback) {

        let results = [];

        if (wundergroundFeature instanceof Function) {
            callback = wundergroundFeature;
            wundergroundFeature = null;
        }

        if (!locationArray || !locationArray.length) {
            return callback(new Error("Location array can not be blank."));
        }

        wundergroundFeature = wundergroundFeature || "hourly";

        Async.eachSeries(locationArray, (location, eachCallback) => {

            this._makeRequest(wundergroundFeature, location, (error, result) => {

                if (error) {
                    console.log("Error during wunderground:");
                    console.log(error);
                    return eachCallback();
                }

                results.push({
                    id: location.id,
                    result: result
                });

                return eachCallback();
            });

        }, (error) => {

            if (error) {
                return callback(error);
            }
            return callback(null, results);
        });
    }

    _makeRequest(wundergroundFeature, location, callback) {

        this.limiter.removeTokens(1, (error, remainingRequests) => {

            if (remainingRequests < 0) { // Sleep(?) 1000 msec if request count exceed.
                return setTimeout(() => {
                    this._makeRequest(wundergroundFeature, location, callback);
                }, 1000);
            }

            const url = `http://api.wunderground.com/api/${this.apiKey}/${wundergroundFeature}/q/${location.latitude},${location.longitude}.json`;

            Request(url, (error, response, body) => {

                if (error || response.statusCode !== 200) {
                    return callback(error || "Status Code is not 200.");
                }

                body = JSON.parse(body);

                if (!body.response || body.response.error) {
                    return callback(new Error(body.response.error.description || body.response.error));
                }

                return callback(null, body);
            });

        });
    }
}

module.exports = Wunderground;
