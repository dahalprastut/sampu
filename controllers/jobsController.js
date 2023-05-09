const Jobs = require("./../models/jobsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/AppError");

exports.getAllJobs = catchAsync(async (req, res, next) => {
	const jobs = await Jobs.find();

	res.status(200).json({
		status: "success",
		result: jobs.length,
		data: {
			jobs,
		},
	});
});

exports.getJob = catchAsync(async (req, res, next) => {
	const job = await Jobs.findById(req.params.id);

	if (!job) {
		return next(new AppError("Job with that id not found", 404));
	}

	res.status(200).json({
		status: "success",
		data: {
			job,
		},
	});
});

exports.createJob = catchAsync(async (req, res, next) => {
	const job = await Jobs.create({
		title: req.body.title,
		description: req.body.description,
		companyName: req.body.companyName,
		location: req.body.location,
	});

	res.status(201).json({
		status: "success",
		data: {
			job,
		},
	});
});
