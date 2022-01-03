/*
author:'Arnob Islam'
created date:'01-01-2021'
description:''
*/

const nodemailer = require('nodemailer');


const SEND_EMAIL = async ({ email, subject, message, html }) => {
    try {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'mr.lighthouse101@gmail.com',
                pass: 'itsmrlighthouse'
            }
        });

        // send mail with defined transport object
        await transporter.sendMail({
            from: 'mr.lighthouse101@gmail.com', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: message, // plain text body
            html: `${html}`, // html body

        });

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = SEND_EMAIL