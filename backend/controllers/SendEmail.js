/*
author:'Arnob Islam'
created date:'01-01-2021'
description:''
*/

const nodemailer = require("nodemailer");

let HOST = process.env.EMAIL_HOST || "smtpout.secureserver.net";
let PORT = Number(process.env.EMAIL_PORT) || 465;
let SECURE = true;

const SEND_EMAIL = async ({ email, subject, message, html }) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      secure: SECURE,

      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    // send mail with defined transport object
    await transporter.sendMail({
      from: `<${process.env.ADMIN_EMAIL}>`, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: message, // plain text body
      html: `${html}`, // html body
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = SEND_EMAIL;
