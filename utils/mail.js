exports.generateOTP = (otp_length = 6) =>{
      // generate 6 digit otp
  let OTP = "";
  for (let i = 1; i < otp_length; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }
  return OTP;
}

exports.generateMailTransporter = () =>
    nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "ad80ce4b6a62e0",
      pass: "bfe769a0584298"
    },
  });