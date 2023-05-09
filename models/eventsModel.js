const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "a job must have a name"],
			minlength: [5, "name should be of more than 5 letters"],
			maxlength: [50, "name should be less than 50 letters"],
			trim: true,
		},
		location: String,
		description: {
			type: String,
			trim: true,
			required: [true, "A tour must have a description"],
		},
		date: Date,
		createdAt: {
			type: String,
			default: Date.now(),
			select: false,
		},
		users: Array,
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// middlewares

const Events = mongoose.model("Events", eventSchema);

module.exports = Events;
