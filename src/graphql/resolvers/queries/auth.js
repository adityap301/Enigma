import User from '../../../models/User';
import ResetPassword from '../../../models/ResetPassword';
import jwt from 'jsonwebtoken';
import checkInput from '../../../utils/joiValidate';
import {checkForLogin, checkForExistinguserWithId, checkForExistinguserWithMail} from '../../../utils/checkForAuth';
import { sendEmail } from '../../../utils/mail';
import responseFinal from '../../../utils/sendResponse';
import log from '../../../config/winston';
import formatter from '../../../utils/winstonFormatter';
import { encryption } from '../../../utils/encryption';
const CryptoJS = require('crypto-js');

const key = '55a51621a6648525';
const keyutf = CryptoJS.enc.Utf8.parse(key);
const iv = CryptoJS.enc.Base64.parse(key);

export default {
	// Login
	login: async (parent, args) => {
		let { email, password } = args;
		args.email = CryptoJS.AES.decrypt(email, keyutf, {iv: iv}).toString(CryptoJS.enc.Latin1);
		args.password = CryptoJS.AES.decrypt(password, keyutf, { iv: iv }).toString(CryptoJS.enc.Latin1);
		console.log(args.email);
		console.log(args.password);
		const resultfromJoi = checkInput(['email','password'],args);
		if(resultfromJoi != true) return await encryption(resultfromJoi);
		const checked = await checkForLogin(args.email,args.password);
		if (!checked.success) return await encryption(checked);
		log.info(`user:${formatter(checked.userId)},action:login`);
		const token = jwt.sign({userId:checked.userId},process.env.JWT_SECRET,{
			expiresIn: '12h'
		});
		let result = await encryption({ userId: checked.userId, token, code:'200', message:'Sucessfully Logged In'});
		console.log(result);
		return result;
	},

	// Resend Otp
	resendOtp: async (parent, args) => {
		let {  userId  } = args;
		const resultfromJoi = checkInput(['userId'],args);
		if(resultfromJoi != true) return resultfromJoi;
		let existingUser = await checkForExistinguserWithId(userId);
		if (existingUser == false) return responseFinal('404','No Such User Exists');;
		try {
			let user = await User.findById({_id:userId});
			if (user.verified == true) return responseFinal('404','You are Already verified.');
			const message = `Account Confirmation OTP: ${user.otp}`;
			let result = await sendEmail('Website Name - Account Confirmation',user.email,message);
			if (!result) return responseFinal('404','Error sending mail');
			return responseFinal('200','OTP resent successfully');
		} catch (error) {
			return responseFinal('404','Some Error try again.');
		}
	},

	// Sends forgot password mail with reset key
	forgotPasswordMail: async (parent, args) => {
		let {  email  } = args;
		const resultfromJoi = checkInput(['email'],args);
		if(resultfromJoi != true) return resultfromJoi;
		let existingUser = await checkForExistinguserWithMail(email.toLowerCase());
		if (existingUser != true) return existingUser;
		try {
			let user = await User.findOne({email});
			let resetKey = Math.random().toString(36).substring(2);
			let data = {userId:user._id,resetKey};
			let result = await new ResetPassword(data).save();
			if (!result) return responseFinal('404','Some error try again');
			const message = `Account Password Reset Link: Your Website URL/${resetKey}`;
			let mail = await sendEmail('Website Name - Password Reset',user.email,message);
			if (!mail) return responseFinal('404','Error sending mail');
			return responseFinal('200','Check your email to reset your password');
		} catch (error) {
			return responseFinal('404','Some Error try again.');
		}
	},
  
};