import nodemailer from "nodemailer";
const sendResetPasswordEmail = async (email, name, token) => {
  console.log(email, name, token);
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "jagannathbehera0244@gmail.com",
        pass: "wghmrtwhnlhcztyu",
      },
    });
    const option = {
      from: "jagannathbehera0244@gmail.com", // sender address
      to: email, // list of receivers
      subject: "For Reset Password", // Subject line

      html: `<p>Hi,${name},please copy the link and <a href="http://localhost:8000/api/v1/auth/reset-password?token=${token}">reset your password</a></p>`, // html body
    };

    transporter.sendMail(option, (error, info) => {
      if (error) {
        console.log(error.message || "Failed to send email for reset password");
      } else {
        console.log("mail has been send", info.response);
      }
    });
  } catch (error) {
    console.log(error.message || "Something Went Wrong !!");
  }
};
export default sendResetPasswordEmail;
