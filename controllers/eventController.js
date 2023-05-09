const Events = require("./../models/eventsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/AppError");

exports.getAllEvents = catchAsync(async (req, res, next) => {
	const events = await Events.find();

	res.status(200).json({
		status: "success",
		result: events.length,
		data: {
			events,
		},
	});
});

exports.getEvent = catchAsync(async (req, res, next) => {
	const event = await Events.findById(req.params.id);

	if (!event) {
		return next(new AppError("Event with that id not found", 404));
	}

	res.status(200).json({
		status: "success",
		data: {
			event,
		},
	});
});

exports.createEvent = catchAsync(async (req, res, next) => {
	const event = await Events.create({
		title: req.body.title,
		description: req.body.description,
		location: req.body.location,
		date: req.body.date,
	});

	res.status(201).json({
		status: "success",
		data: {
			event,
		},
	});
});
