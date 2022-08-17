const nodemailer = require("nodemailer");
const AWS = require("aws-sdk");
const { readFile } = require("fs/promises");
const path = require("path");
const { fileURLToPath } = require("url");
const { resultMSG } = require("./result");


const SES_CONFIG = {
    accessKeyId: process.env.AWSKEY,
    secretAccessKey: process.env.AWSPIN,
    region: "ap-northeast-2",
};

// configure AWS SDK
AWS.config.update(SES_CONFIG);

// create Nodemailer SES transporter
let transporter = nodemailer.createTransport({
    SES: new AWS.SES({
        apiVersion: "2010-12-01",
    }),
});


// send some mail
async function sendMail({ from, to, subject, code, router = null }) {
    try {
        const header = await readFile(
            path.join(__dirname, "../config/emailTemplate/header.txt"),
            {
                encoding: "utf-8",
            }
        );
        const content1 = await readFile(
            path.join(__dirname, "../config/emailTemplate/content1.txt"),
            {
                encoding: "utf-8",
            }
        );
        const content2 = await readFile(
            path.join(__dirname, "../config/emailTemplate/content2.txt"),
            {
                encoding: "utf-8",
            }
        );

        return await new Promise((res, rej) => {
            transporter.sendMail(
                {
                    from,
                    to,
                    subject,
                    html: `${header}${content1}${code}${content2}`,
                },
                (error, info) => {
                    if (error) {
                        rej({ error, status: 1320, msg: resultMSG.intergrateMSG.awssesFailure({ router }) });
                    } else {
                        console.log(info.envelope);
                        console.log(info.messageId);
                        res({ msg: resultMSG.intergrateMSG.awssesSuccess({ router }), status: 1310 });
                    }
                }
            );
        });
    } catch (error) {
        throw new Error(resultMSG.intergrateMSG.awssesFailure({ router }))
    }
}

module.exports = {
    sendMail
}