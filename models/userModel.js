const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "A user must have a name"],
	},
	email: {
		type: String,
		unique: false,
		required: [true, "a user must have an email"],
		lowercase: true,
		validate: [validator.isEmail, "please enter a correct email"],
	},

	photo: String,
	password: {
		type: String,
		minlength: 8,
		select: false,
		require: [true, "a user must have a password"],
	},
	passwordConfirm: {
		type: String,
		required: true,
		validate: {
			validator: function (el) {
				return el === this.password;
			},
			message: "password nnot matched",
		},
	},
	passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

userSchema.methods.checkPassword = async function (candidatePassword, userPassword) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPassword = function (JWTTimeStamp) {
	if (this.passwordChangedAt) {
		const changed = this.passwordChangedAt.getTime() / 1000;
		return changed > JWTTimeStamp;
	}

	return false;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
