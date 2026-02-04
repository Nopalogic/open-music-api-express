import nodemailer from "nodemailer";

class mailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  sendEmail(targetEmail, content) {
    const message = {
      from: "OpenMusic <no-reply@openmusic.com>",
      to: targetEmail,
      subject: "Ekspor Playlist OpenMusic",
      text: "Berikut adalah hasil ekspor playlist Anda dari OpenMusic",
      attachments: [
        {
          filename: "playlist.json",
          content,
        },
      ],
    };

    return this._transporter.sendMail(message);
  }
}

export default mailSender;
