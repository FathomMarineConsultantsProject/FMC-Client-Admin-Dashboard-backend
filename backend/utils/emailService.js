const nodemailer = require("nodemailer");
const crypto = require("crypto");

const generatePassword = () => {
  return crypto.randomBytes(5).toString("hex");
};

const sendPasswordEmail = async (email, password) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Password",
    html: `<p>Password: <b>${password}</b></p>`,
  });
};

module.exports = { generatePassword, sendPasswordEmail };