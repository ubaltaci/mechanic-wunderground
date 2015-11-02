/**
 *
 * Created by uur on 12/12/15.
 */

"use strict";

const Wunderground = require("../");

const expect = require("chai").expect;
const credentials = require("./credentials.json");

let wunderground;

const testGeo = {
    latitude: "41.011454",
    longitude: "28.970974"
};

describe("Wunderground Test", function () {

    describe("Not Valid Parameters", function () {

        it("should fail with no credentials", function () {
            expect(function () {
                new Wunderground();
            }).to.throw(Error);
        });
    });

    describe("Valid Parameters", function () {

        before(function (done) {
            try {
                wunderground = new Wunderground(credentials.apiKey);
                done();
            }
            catch (error) {
                done(error);
            }
        });

        it("should return error for empty list", function (done) {

            wunderground.getForecast([], (error, result) => {
                expect(error).to.exist;
                done();
            });
        });

        it("should return error for incorrect geolocation", function (done) {

            wunderground.getForecast([{
                latitude: "x",
                longitude: "y"
            }], (error, result) => {
                expect(error).to.exist;
                done();
            });
        });

        it("should return forecast for given geolocation", function (done) {

            wunderground.getForecast([{
                latitude: "41.011454",
                longitude: "28.970974"
            }], (error, result) => {

                expect(error).to.not.exist;
                expect(result).to.exist;
                expect(result).to.have.length(1);
                expect(result[0]).to.have.all.keys(["response", "hourly_forecast"]);
                expect(result[0]["hourly_forecast"]).to.have.length(36);
                done();
            });
        });
    });
});