const http = require("http");

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

module.exports = {
    requestAPI
}