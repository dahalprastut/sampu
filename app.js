const express = require("express");
const morgan = require("morgan");

const jobsRouter = require("./routes/jobsRouter");
const userRouter = require("./routes/userRouter");
const eventsRouter = require("./routes/eventsRouter");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/AppError");

const app = express();

// parsing requests
app.use(express.json());

// morgan
app.use(morgan("dev"));

// routes

app.use("/api/v1/jobs", jobsRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/events", eventsRouter);

app.use("*", function (req, res, next) {
	next(new AppError(`cannot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
