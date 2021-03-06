const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  if (req.method === "POST") {
    const emailOutput = `You have a new message from louierichardson.com\n\nFrom ${name} | ${email}\n\nMessage:\n${message}`;

    const data = {
      to: "louie.richardson99@gmail.com",
      from: '"Nodemailer" <louie.richardson99@gmail.com>',
      subject: `Message from ${name}`,
      text: emailOutput,
    };

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    transporter.sendMail(data, (err, info) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "There seems to have been an error." });
      }
      return res.status(200).json({ message: "Message sent!" });
    });
  }
}
