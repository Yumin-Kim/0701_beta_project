
const express = require("express");
const cors = require("cors")
const app = express();
const logger = require("morgan")
/**
 * 사용자 정의 
 */
const { executeQuery } = require("./config/db.js");
const ece2000Router = require("./routes/ece2000.js")
const ece3000Router = require("./routes/ece3000.js")
const ece4000Router = require("./routes/ece4000.js")
const ece5000Router = require("./routes/ece5000.js")
const ece6000Router = require("./routes/ece6000.js")
const ece7000Router = require("./routes/ece7000.js")
const ece8000Router = require("./routes/ece8000.js")
const adminTestRouter = require("./routes/admin/test.js")
const swaggerRouter = require("./config/swagger.js")
const { tiles } = require("./config/tiles")
/** 
 * 환경 변수
 */
const PORT = process.env.PORT !== undefined ? process.env.PORT : 3000;
/** */
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(express.json())
app.use(express.static("public"))
app.use(logger('combined'))
/** */
app.use(swaggerRouter)
app.use("/ece2000", ece2000Router)
app.use("/ece3000", ece3000Router)
app.use("/ece4000", ece4000Router)
app.use("/ece5000", ece5000Router)
app.use("/ece6000", ece6000Router)
app.use("/ece7000", ece7000Router)
app.use("/ece8000", ece8000Router)

//admin
app.use("/admin/test", adminTestRouter)

app.listen(PORT, () => {
    console.log(`==============ELC SERVER APPLICATION==============`)
    console.log(`MODE: ${process.env.NODE_ENV === undefined ? "DEV" : "PROD"}`);
    console.log(`PORT: ${PORT}`)
    console.log(`==============ELC SERVER APPLICATION==============`)
})