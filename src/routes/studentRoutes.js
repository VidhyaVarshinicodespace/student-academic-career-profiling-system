const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

// CREATE STUDENT
router.post("/", async (req, res) => {
    try {
        const student = new Student(req.body);
        const savedStudent = await student.save();

        res.status(201).json(savedStudent);
    } catch (error) {
        res.status(400).json({
            message: "Failed to create student",
            error: error.message
        });
    }
});

// GET ALL STUDENTS
router.get("/", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch students",
            error: error.message
        });
    }
});

// GET ONE STUDENT
router.get("/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch student",
            error: error.message
        });
    }
});

// UPDATE STUDENT PROFILE
router.put("/:id", async (req, res) => {
    try {
        // Do not change password from normal Edit Profile update
        const updateData = { ...req.body };
        delete updateData.password;

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(updatedStudent);
    } catch (error) {
        res.status(400).json({
            message: "Failed to update student",
            error: error.message
        });
    }
});

// DELETE STUDENT
router.delete("/:id", async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);

        if (!deletedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete student",
            error: error.message
        });
    }
});

// RESET STUDENT PASSWORD
router.put("/set-password/:id", async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({
                message: "Password must contain at least 6 characters."
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match."
            });
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { password: password },
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found."
            });
        }

        res.json({
            message: "Student password reset successfully."
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to reset password.",
            error: error.message
        });
    }
});

module.exports = router;