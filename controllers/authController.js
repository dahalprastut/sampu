const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/AppError");

const getToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.EXPIRES_IN,
	});
};

exports.signup = catchAsync(async (req, res, next) => {
	// get username email password and   confirm password

	const user = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		passwordChangedAt: req.body.passwordChangedAt,
	});
	// verify email and password

	// send token
	const token = getToken(user._id);

	res.status(201).json({
		status: "success",
		token,
		data: {
			user,
		},
	});
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	// get the email and password
	if (!email || !password) {
		return next(new AppError("please enter correct email and password", 404));
	}

	const user = await User.findOne({
		email,
	}).select("+password");

	if (!user) {
		return next(new AppError("email not matched", 401));
	}

	// check if the email and password matches

	const passwordMatched = await user.checkPassword(password, user.password);
	if (!passwordMatched) {
		return next(new AppError("password not matched", 401));
	}

	// send jwt
	const token = getToken(user._id);

	res.status(200).json({
		status: "success",
		token,
		data: {
			user,
		},
	});
});

exports.protect = catchAsync(async (req, res, next) => {
	// 1. get the token
	let token;
	if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
		token = req.headers.authorization.split(" ")[1];
	}

	if (!token) {
		next(new AppError("you do not have access", 401));
	}

	// 2. verify the token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

	const currentUser = await User.findById(decoded.id);

	// 3. check if the user still exist
	if (!currentUser) {
		next(new AppError("User doenst exist. Try logging in again", 401));
	}

	// 4. check if the password has been changed
	if (currentUser.changedPassword(decoded.iat)) {
		return next(new AppError("Password Changed. Please login again", 401));
	}
	req.user = currentUser;
	next();
});
