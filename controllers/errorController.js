const devErrorHandler = (res, err) => {
	res.status(err.statusCode).json({
		satus: err.status,
		stack: err.stack,
		message: err.message,
		error: err,
	});
};

const prodErrorHandler = (res, err) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			satus: err.status,
			message: err.message,
		});
	} else {
		res.status(500).json({
			satus: "ERROR",
			message: "Something Went Wrong",
		});
	}
};

const globalErrorHandler = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "ERROR";
	if (process.env.NODE_ENV === "development") {
		devErrorHandler(res, err);
	} else if (process.env.NODE_ENV === "production") {
		prodErrorHandler(res, err);
	}
};

module.exports = globalErrorHandler;
