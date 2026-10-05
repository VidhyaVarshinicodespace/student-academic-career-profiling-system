const express = require("express");

const router = express.Router();

const studentRoutes = require("./studentRoutes");

// Student API routes
router.use("/students", studentRoutes);

module.exports = router;