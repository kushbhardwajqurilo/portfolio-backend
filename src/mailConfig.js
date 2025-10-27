const nodemailer = require("nodemailer");
const path = require("path");
const MailTrasporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.E_EMAIL,
    pass: process.env.E_PASS,
  },
});
async function SentMail(to, subject, text, html) {
  const information = await MailTrasporter.sendMail({
    from: process.env.E_EMAIL,
    to: to,
    subject: subject,
    text,
    html,
  });
  console.log("mail sent", information);
  if (information.accepted.length !== 0) {
    return true;
  } else {
    return false;
  }
}

module.exports = SentMail;
