
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const router = require("express").Router()
const path = require("path")
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Meditator's Node Express API with Swagger",
            version: "0.1.0",
            description:
                "Test Ecoinsbay",
        },
        baseurl: "/"
    },
    apis: [path.join(__dirname, "../routes/*.js")]
};
console.log(path.join(__dirname, "../routes/*.js"));
const specs = swaggerJsdoc(options);
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))
module.exports = router