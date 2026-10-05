const mongoose = require("mongoose");


/* =========================================================
   SEMESTER SCHEMA
========================================================= */

const semesterSchema = new mongoose.Schema(
    {
        semesterNumber: {
            type: Number,
            required: true,
            min: 1
        },

        sgpa: {
            type: Number,
            min: 0,
            max: 10
        },

        cumulativeCgpa: {
            type: Number,
            min: 0,
            max: 10
        },

        attendancePercentage: {
            type: Number,
            min: 0,
            max: 100
        },

        arrearStatus: {
            type: Boolean,
            default: false
        },

        numberOfArrears: {
            type: Number,
            min: 0,
            default: 0
        },

        academicAchievements: {
            type: String,
            trim: true
        },

        /*
         * New field:
         * Stores multiple areas of interest for each semester.
         *
         * Example:
         * [
         *   "DBMS",
         *   "CNS",
         *   "Machine Learning"
         * ]
         */

        areaOfInterest: {
            type: [String],
            default: []
        }
    },

    {
        _id: false
    }
);


/* =========================================================
   ARREAR SCHEMA
========================================================= */

const arrearSchema = new mongoose.Schema(
    {
        semesterNumber: {
            type: Number,
            required: true
        },

        subjectCode: {
            type: String,
            trim: true
        },

        subjectName: {
            type: String,
            trim: true
        },

        attempts: {
            type: Number,
            min: 1
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Cleared"
            ]
        },

        clearedSemester: {
            type: Number,
            min: 1
        },

        gradeAfterClearing: {
            type: String,
            trim: true
        },

        reasonForDifficulty: {
            type: String,
            trim: true
        },

        remedialSupportRequired: {
            type: String,
            trim: true
        }
    },

    {
        _id: false
    }
);


/* =========================================================
   PROJECT SCHEMA
========================================================= */

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        githubLink: {
            type: String,
            trim: true
        }
    },

    {
        _id: false
    }
);


/* =========================================================
   CAREER SCHEMA
========================================================= */

const careerSchema = new mongoose.Schema(
    {
        goal: {
            type: String,

            enum: [
                "Placement",
                "Higher Studies",
                "Entrepreneurship"
            ]
        },


        /* ---------------- PLACEMENT ---------------- */

        placement: {

            targetCompanyType: {
                type: String
            },

            preferredRole: {
                type: String
            },

            preparationStatus: {
                type: String
            }

        },


        /* ---------------- HIGHER STUDIES ---------------- */

        higherStudies: {

            preferredCourse: {
                type: String
            },

            preferredCountry: {
                type: String
            },

            entranceExam: {
                type: String
            },

            preparationStatus: {
                type: String
            }

        },


        /* ---------------- ENTREPRENEURSHIP ---------------- */

        entrepreneurship: {

            businessIdea: {
                type: String
            },

            domain: {
                type: String
            },

            currentStage: {
                type: String
            },

            supportRequired: {
                type: String
            }

        }

    },

    {
        _id: false
    }
);


/* =========================================================
   STUDENT SCHEMA
========================================================= */

const studentSchema = new mongoose.Schema(
    {

        /* -------------------------------------------------
           BASIC DETAILS
        ------------------------------------------------- */

        registerNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        studentName: {
            type: String,
            required: true,
            trim: true
        },

        dateOfBirth: {
            type: Date
        },

        gender: {
            type: String
        },

        department: {
            type: String
        },

        section: {
            type: String
        },


        /* -------------------------------------------------
           EMAIL AND LOGIN DETAILS
        ------------------------------------------------- */

        institutionalEmail: {
            type: String,
            trim: true,
            lowercase: true
        },

        personalEmail: {
            type: String,
            trim: true
        },

        /*
         * Temporary password field used by the current
         * prototype login system.
         *
         * IMPORTANT:
         * Later this should be replaced with a properly
         * hashed password and backend authentication.
         */

        password: {
            type: String,
            minlength: 6
        },


        /* -------------------------------------------------
           CONTACT
        ------------------------------------------------- */

        mobile: {
            type: String,
            trim: true
        },

        residentialAddress: {
            type: String,
            trim: true
        },


        /* -------------------------------------------------
           STUDENT CATEGORY
        ------------------------------------------------- */

        category: {
            type: String,

            enum: [
                "Hosteller",
                "Day Scholar"
            ]
        },

        hostelName: {
            type: String,
            trim: true
        },

        distanceToCollege: {
            type: Number,
            min: 0
        },


        /* -------------------------------------------------
           FAMILY DETAILS
        ------------------------------------------------- */

        family: {

            fatherName: {
                type: String
            },

            fatherOccupation: {
                type: String
            },

            fatherIncomeRange: {
                type: String
            },

            fatherMobile: {
                type: String
            },


            motherName: {
                type: String
            },

            motherOccupation: {
                type: String
            },

            motherIncomeRange: {
                type: String
            },

            motherMobile: {
                type: String
            },


            guardianName: {
                type: String
            },

            emergencyContact: {
                type: String
            },


            firstGenerationGraduate: {
                type: Boolean
            },

            scholarshipReceived: {
                type: Boolean
            },

            financialGuidanceRequired: {
                type: Boolean
            }

        },


        /* -------------------------------------------------
           SEMESTER / ACADEMIC DETAILS
        ------------------------------------------------- */

        semesters: [
            semesterSchema
        ],


        /* -------------------------------------------------
           ARREAR DETAILS
        ------------------------------------------------- */

        arrears: [
            arrearSchema
        ],


        /* -------------------------------------------------
           TECHNICAL DETAILS
        ------------------------------------------------- */

        technical: {

            programmingLanguages: [
                String
            ],

            technicalSkills: [
                String
            ],

            areaOfInterest: {
                type: String
            },

            preferredTechnicalDomain: {
                type: String
            },

            certifications: [
                String
            ],

            projects: [
                projectSchema
            ],

            hackathons: {
                type: String
            },

            internshipExperience: {
                type: String
            },

            githubProfile: {
                type: String
            },

            linkedinProfile: {
                type: String
            },

            hackerrankProfile: {
                type: String
            },

            hackerearthProfile: {
                type: String
            },

            communicationSkillLevel: {
                type: String
            },

            aptitudeSkillLevel: {
                type: String
            }

        },


        /* -------------------------------------------------
           SELF EVALUATION
        ------------------------------------------------- */

        selfEvaluation: {

            academicStrengths: {
                type: String
            },

            technicalStrengths: {
                type: String
            },

            communicationStrengths: {
                type: String
            },

            leadershipQualities: {
                type: String
            },

            teamworkAbilities: {
                type: String
            },

            areasRequiringImprovement: {
                type: String
            },

            subjectsRequiringSupport: {
                type: String
            },

            technicalSkillsToDevelop: {
                type: String
            },

            communicationAptitudeToImprove: {
                type: String
            },

            mentorSupportExpected: {
                type: String
            },

            shortTermGoal: {
                type: String
            },

            longTermGoal: {
                type: String
            }

        },


        /* -------------------------------------------------
           CAREER
        ------------------------------------------------- */

        career: careerSchema

    },

    {
        timestamps: true
    }
);


/* =========================================================
   CREATE MODEL
========================================================= */

const Student =
    mongoose.model(
        "Student",
        studentSchema
    );


module.exports = Student;