import nodemailer from "nodemailer";
const globalForMailer = globalThis as unknown as {
  mailer: nodemailer.Transporter | undefined;
};

export const mailer =
  globalForMailer.mailer ??
  nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAIL_USERNAME as string,
      pass: process.env.MAIL_PASSWORD as string,
    },
  });

if (process.env.NODE_ENV !== "production") globalForMailer.mailer = mailer;
