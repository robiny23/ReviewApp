const User = require('../models/user')
const EmailVerificationToken = require('../models/emailVerificationToken');
const nodemailer = require('nodemailer');
const { isValidObjectId } = require('mongoose');

exports.create = async(req, res) =>{
    const {name, email, password} = req.body;

    const oldUser = await User.findOne({email});
    if(oldUser) return res.status(401).json({error: "Email already in use"});
 
    const newUser = new User({name, email, password})
    await newUser.save()

    // generate 6 digit otp
    let OTP = "";
    for(let i = 0; i < 6; i++){
        const randomVal = Math.round(Math.random() * 9);
        OTP += randomVal;
    }
    //, store otp in db, send otp in user
    const newEmailVerificationToken = new EmailVerificationToken({owner: newUser._id, token: OTP});

    await newEmailVerificationToken.save();

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "ad80ce4b6a62e0",
          pass: "bfe769a0584298"
        }
      });
    
      transport.sendMail({
        from: 'verification@reviewapp.com',
        to: newUser.email,
        subject: 'Email Verification',
        html: `
          <p>You verification OTP</p>
          <h1>${OTP}</h1>
        `
      })

    res.status(201).json({
        message: "Please verify your email. OTP has been sent to your email account!"
    });
};

    exports.verifyEmail = async (req, res) =>{
        const {userId, OTP} = req.body;
        if(!isValidObjectId(userId)) return res.json({error: 'Invalid user!'});

        const user = await User.findById(userId)
        if(!user) return res.json({error: 'User not found!'}); 
        if(user.isVerified) return res.json({error: 'User already verified!'}); 

        const token = await EmailVerificationToken.findOne({owner: userId});
        if(!token) return res.json({error: 'Token not found!'}); 

        const isMatched = await token.compareToken(OTP);
        if(!isMatched) return res.json({error: 'Invalid OTP!'}); 

        user.isVerified = true;
        await user.save();

        await EmailVerificationToken.findByIdAndDelete(token._id);

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "ad80ce4b6a62e0",
              pass: "bfe769a0584298"
            }
          });

        transport.sendMail({
            from: 'verification@reviewapp.com',
            to: user.email,
            subject: 'Welcome Email',
            html: '<h1>Welcome to our app and thanks for choosing us.</h1>'
        })

        res.json({message: 'Your email is verified.'});

    }