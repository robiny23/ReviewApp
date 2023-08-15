const express = require('express');

const { 
    create, 
    verifyEmail, 
    resendEmailVerificationToken,
    forgetPassword,
    sendResetPasswordTokenStatus,
    resetPassword,
    signIn,
} = require('../controller/user');
const { isValidPassResetToken } = require("../middlewares/user");
const { signInValidator, userValidator, validate, validatePassword } = require('../middlewares/validator');

const router = express.Router();
 
router.post("/create", userValidator, validate, create);
router.post("/sign-in", signInValidator, validate, signIn);
router.post("/verify-email", verifyEmail);
router.post("/resend-email-verification-token", resendEmailVerificationToken);
router.post("/forget-password", forgetPassword);
router.post('/verify-pass-reset-token', isValidPassResetToken, sendResetPasswordTokenStatus);
router.post('/reset-password', validatePassword,validate, isValidPassResetToken,  resetPassword);

module.exports = router;