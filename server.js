const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");
const port = 3000;

const DB = "mongodb://localhost:27017/latestdb";

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log("database Connencted");
	})
	.catch((err) => {
		console.log("Failed to connect To DB", err);
	});

app.listen(port, () => {
	console.log("server is running in port " + port);
});
