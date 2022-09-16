const http = require("http");
const https = require("https");
const crypto = require("crypto");
const querystring = require("querystring");
const baseUrl = "openapi.digifinex.com";
const appKey = "ce33598a0c0b54";
const appSecret = "145cc6274fb616def5bdb6d4c736c0aa8ac7b3486a";


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
async function requestAPI_https(url) {
    return new Promise((res, rej) => {
        https
            .request(url, function (response) {
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
                    rej("API Server Error")
                })
            })
            .end();

    })


}
module.exports = {
    requestAPI, requestAPI_https, digifinax_request
}