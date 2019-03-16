require("dotenv").config(); // read .env file if present.

const nodemailer = require("nodemailer");

exports.handler = function(event, context, callback) {
  const user = process.env.MAIL_USER; // some@mail.com
  const pass = process.env.MAIL_PASSWORD; // 42isthecoolestnumber

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user, pass }
  });

  // Parse data sent in form hook (email, name etc)
  const { data } = JSON.parse(event.body);

  // make sure we have data and email
  if (!data || !data.email) {
    return callback(null, {
      statusCode: 400,
      body: "Mailing details not provided"
    });
  }

  let mailOptions = {
    from: `"JAM Stack website" <${user}>`,
    to: data.email, //
    subject: "Dotazník z webu JAM Stack",
    text: "Dotazník byl odeslaný",
    html: "Dotazník byl úspěšně odeslaný uživateli " data.name; // returns html code with interpolated variables
  };

  transporter.sendMail(mailOptions, (error, info) => {
    // handle errors
    if (error) {
      return callback(null, {
        statusCode: 500,
        body: JSON.stringify(error)
      });
    }

    // success!
    callback(null, {
      statusCode: 200,
      body: "Email byl odeslán"
    });
  });
};
