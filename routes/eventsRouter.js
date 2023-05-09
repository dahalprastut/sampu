const express = require("express");
const eventController = require("./../controllers/eventController");
const authController = require("./../controllers/authController");

const router = express("router");

router
	.route("/")
	.get(authController.protect, eventController.getAllEvents)
	.post(authController.protect, eventController.createEvent);

router.route("/:id").get(authController.protect, eventController.getEvent);

module.exports = router;
