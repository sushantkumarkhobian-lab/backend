const nodemailer = require("nodemailer");

const sendEmail = async (to, verificationLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Smart Civic App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
