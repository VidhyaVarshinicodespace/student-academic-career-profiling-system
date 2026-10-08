const express = require("express");
const Student = require("../models/Student");

const router = express.Router();


// ======================================================
// CREATE STUDENT
// POST /api/students
// ======================================================

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


// ======================================================
// GET ALL STUDENTS
// GET /api/students
// ======================================================

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


// ======================================================
// RESET STUDENT PASSWORD
// PUT /api/students/set-password/:id
// IMPORTANT: This must come BEFORE /:id
// ======================================================

router.put("/set-password/:id", async (req, res) => {

    try {

        const {
            password,
            confirmPassword
        } = req.body;


        // Check password
        if (!password || password.length < 6) {

            return res.status(400).json({
                message: "Password must contain at least 6 characters."
            });

        }


        // Check confirmation
        if (password !== confirmPassword) {

            return res.status(400).json({
                message: "Passwords do not match."
            });

        }


        // Find and update student
        const student =
            await Student.findByIdAndUpdate(
                req.params.id,
                {
                    password: password
                },
                {
                    new: true,
                    runValidators: true
                }
            );


        // Student not found
        if (!student) {

            return res.status(404).json({
                message: "Student not found."
            });

        }


        // Success
        res.json({
            message: "Student password reset successfully."
        });


    } catch (error) {

        console.error(
            "Password reset error:",
            error
        );

        res.status(500).json({
            message: "Failed to reset password.",
            error: error.message
        });

    }

});


// ======================================================
// GET ONE STUDENT
// GET /api/students/:id
// ======================================================

router.get("/:id", async (req, res) => {

    try {

        const student =
            await Student.findById(req.params.id);


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


// ======================================================
// UPDATE STUDENT PROFILE
// PUT /api/students/:id
// ======================================================

router.put("/:id", async (req, res) => {

    try {

        // Do not change password
        // from normal Edit Profile update
        const updateData = {
            ...req.body
        };

        delete updateData.password;


        const updatedStudent =
            await Student.findByIdAndUpdate(
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


// ======================================================
// DELETE STUDENT
// DELETE /api/students/:id
// ======================================================

router.delete("/:id", async (req, res) => {

    try {

        const deletedStudent =
            await Student.findByIdAndDelete(
                req.params.id
            );


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


module.exports = router;