import nodemailer from "nodemailer";
import "dotenv/config";

const { UKR_NET_EMAIL, UKR_NET_PASSWORD, BASE_URL = "http://localhost:3000" } = process.env;

const config = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

export const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${BASE_URL}/api/auth/verify/${verificationToken}`;

  const emailOptions = {
    from: UKR_NET_EMAIL,
    to: email,
    subject: "Email Verification",
    html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}" target="_blank">Verify Email</a>
      <p>If you did not register, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(emailOptions);
};
