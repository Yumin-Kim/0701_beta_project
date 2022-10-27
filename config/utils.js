const http = require("http");
const https = require("https");
const crypto = require("crypto");
const querystring = require("querystring");
const { default: axios } = require("axios");

const baseUrl = "openapi.digifinex.com";
const appKey = "ce33598a0c0b54";
const appSecret = "145cc6274fb616def5bdb6d4c736c0aa8ac7b3486a";
let currecyPrice_list = null
const TIMEOUT_AXIOS_VERSION = 2000;
const calc_sign = function (data) {
    var content = querystring.stringify(data);
    return crypto.createHmac("sha256", appSecret).update(content).digest("hex");
};

const digifinax_request = function (method, path, data = {}, needSign = false) {
    return new Promise((resolve) => {
        var content = querystring.stringify(data);
        var options = {
            hostname: baseUrl,
            port: 443,
            path: "/v3" + path,
            method: method,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.52 Safari/537.17",
            },
        };
        if (method == "GET" && content != "") {
            options.path += "?" + content;
        }
        if (needSign) {
            options.headers["ACCESS-KEY"] = appKey;
            options.headers["ACCESS-TIMESTAMP"] = parseInt(Date.now() / 1000);
            options.headers["ACCESS-SIGN"] = calc_sign(data);
        }
        var req = https.request(options, function (res) {
            res.setEncoding("utf8");
            res.on("data", function (chunk) {
                const a = JSON.parse(chunk)
                resolve(a.ticker[0].last)
            });
        });
        req.on("error", function (e) {
        });
        if (method != "GET") {
            req.write(content);
        }
        req.end();
    })
};
async function requestAPI(url) {
    return new Promise((res, rej) => {
        http
            .request(url, function (response) {
                var serverData = "";
                response.on("data", function (chunk) {
                    serverData += chunk;
                });
                response.on("end", function () {
                    res(JSON.parse(serverData));
                });
                response.on("error", () => {
                    rej("API Server Error")
                })
            })
            .end();
    })
}
const options = {
    //...
    timeout: 3000,
};
async function requestAPI_https(url) {
    return new Promise((res, rej) => {
        https
            .request({
                url,
            }, function (response) {
                var serverData = "";
                response.on("data", function (chunk) {
                    serverData += chunk;
                });
                response.on("end", function () {
                    try {
                        console.log(serverData);
                        res(JSON.parse(serverData));
                    } catch (error) {
                        rej(error)
                    }
                });
                response.on("error", () => {
                    if (err.code === "ECONNRESET") {
                        console.log("Timeout occurs");
                    }
                })
            })
            .end();

    })


}
async function requestAPI_internationalCurrencyPrice_usdt() {
    const instance = axios.create();
    instance.defaults.timeout = TIMEOUT_AXIOS_VERSION;
    try {
        const { data } = await instance.get(`https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=QYT1SYyVeJk4SgY9syEe8ncle3EvNqAi&searchdate=${new Date().toISOString().split("T")[0].replaceAll("-", "")}&data=AP01`)
        console.log(`https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=QYT1SYyVeJk4SgY9syEe8ncle3EvNqAi&searchdate=${new Date().toISOString().split("T")[0].replaceAll("-", "")}&data=AP01`);
        if (data.length === 0) throw new Error("Error")
        currecyPrice_list = data
    } catch (error) {
        if (currecyPrice_list === null || currecyPrice_list.length < 2) {
            currecyPrice_list = [{ cur_unit: "USD", bkpr: "1,388.94" }]
        }
    }
    if (currecyPrice_list === null || currecyPrice_list.length < 2) {
        currecyPrice_list = [{ cur_unit: "USD", bkpr: "1,388.94" }]
    }
    let usd_price = 0;
    currecyPrice_list.forEach(element => {
        if (element.cur_unit === "USD") {
            usd_price = Number(element.bkpr.replace(",", ""))
        }
    });
    return usd_price
}
module.exports = {
    requestAPI, requestAPI_https, digifinax_request, requestAPI_internationalCurrencyPrice_usdt
}