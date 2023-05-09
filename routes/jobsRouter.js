const express = require("express");
const jobsController = require("./../controllers/jobsController");
const authController = require("./../controllers/authController");

const router = express("router");

router.route("/").get(authController.protect, jobsController.getAllJobs).post(jobsController.createJob);

router.route("/:id").get(jobsController.getJob);

module.exports = router;
