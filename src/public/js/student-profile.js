document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const studentId = params.get("id");

    const loadingMessage = document.getElementById("loadingMessage");
    const errorMessage = document.getElementById("errorMessage");
    const profileContent = document.getElementById("profileContent");

    const editProfileButton = document.getElementById("editProfileButton");
    const bottomEditButton = document.getElementById("bottomEditButton");

    const logoutButton = document.getElementById("logoutButton");
    const bottomLogoutButton = document.getElementById("bottomLogoutButton");


    // =========================================================
    // CHECK STUDENT ID
    // =========================================================

    if (!studentId) {
        showError("Student ID is missing from the URL.");
        return;
    }


    // =========================================================
    // HELPER FUNCTIONS
    // =========================================================

    function setText(id, value) {

        const element = document.getElementById(id);

        if (!element) {
            return;
        }

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            element.textContent = "-";
        } else {
            element.textContent = value;
        }
    }


    function setYesNo(id, value) {

        const element = document.getElementById(id);

        if (!element) {
            return;
        }

        if (value === true) {

            element.textContent = "Yes";
            element.className = "info-value yes-badge";

        } else {

            element.textContent = "No";
            element.className = "info-value no-badge";
        }
    }


    function formatDate(dateValue) {

        if (!dateValue) {
            return "-";
        }

        const date = new Date(dateValue);

        if (isNaN(date.getTime())) {
            return dateValue;
        }

        return date.toLocaleDateString("en-IN");
    }


    function showError(message) {

        loadingMessage.style.display = "none";

        errorMessage.textContent = message;
        errorMessage.style.display = "block";

        profileContent.style.display = "none";
    }


    function isEmpty(value) {

        return (
            value === undefined ||
            value === null ||
            value === ""
        );
    }


    function hasAnyData(object) {

        if (!object) {
            return false;
        }

        return Object.values(object).some(value => {

            if (Array.isArray(value)) {
                return value.length > 0;
            }

            return !isEmpty(value);
        });
    }


    // =========================================================
    // LOAD STUDENT
    // =========================================================

    async function loadStudent() {

        try {

            const response = await fetch(
                `/api/students/${studentId}`
            );


            if (!response.ok) {

                throw new Error(
                    "Unable to fetch student profile."
                );
            }


            const student = await response.json();

            console.log(
                "Student profile data:",
                student
            );


            displayStudent(student);


        } catch (error) {

            console.error(error);

            showError(
                "Unable to load student profile."
            );
        }
    }


    // =========================================================
    // DISPLAY STUDENT
    // =========================================================

    function displayStudent(student) {

        // =====================================================
        // PERSONAL DETAILS
        // =====================================================

        setText(
            "studentName",
            student.studentName
        );

        setText(
            "registerNumber",
            student.registerNumber
        );

        setText(
            "department",
            student.department
        );

        setText(
            "section",
            student.section
        );

        setText(
            "dateOfBirth",
            formatDate(student.dateOfBirth)
        );

        setText(
            "gender",
            student.gender
        );

        setText(
            "institutionalEmail",
            student.institutionalEmail
        );

        setText(
            "personalEmail",
            student.personalEmail
        );

        setText(
            "mobile",
            student.mobile
        );

        setText(
            "category",
            student.category
        );

        setText(
            "hostelName",
            student.hostelName
        );

        setText(
            "distanceToCollege",
            student.distanceToCollege
        );

        setText(
            "residentialAddress",
            student.residentialAddress
        );


        // =====================================================
        // HOSTELLER / DAY SCHOLAR DISPLAY
        // =====================================================

        const hostelDetails =
            document.getElementById("hostelDetails");

        const distanceDetails =
            document.getElementById("distanceDetails");


        if (student.category === "Hosteller") {

            if (hostelDetails) {
                hostelDetails.style.display = "block";
            }

            if (distanceDetails) {
                distanceDetails.style.display = "none";
            }

        } else if (student.category === "Day Scholar") {

            if (hostelDetails) {
                hostelDetails.style.display = "none";
            }

            if (distanceDetails) {
                distanceDetails.style.display = "block";
            }

        }


        // =====================================================
        // FAMILY DETAILS
        // =====================================================

        const family = student.family || {};


        setText(
            "fatherName",
            family.fatherName
        );

        setText(
            "fatherOccupation",
            family.fatherOccupation
        );

        setText(
            "motherName",
            family.motherName
        );

        setText(
            "motherOccupation",
            family.motherOccupation
        );

        setText(
            "guardianName",
            family.guardianName
        );

        setText(
            "emergencyContact",
            family.emergencyContact
        );


        setYesNo(
            "firstGenerationGraduate",
            family.firstGenerationGraduate
        );

        setYesNo(
            "scholarshipReceived",
            family.scholarshipReceived
        );

        setYesNo(
            "financialGuidanceRequired",
            family.financialGuidanceRequired
        );


        // =====================================================
        // ACADEMIC DETAILS
        // =====================================================

        displayAcademicDetails(
            student.semesters || []
        );


        // =====================================================
        // ARREAR DETAILS
        // =====================================================

        displayArrearDetails(
            student.semesters || [],
            student.arrears || []
        );


        // =====================================================
        // TECHNICAL DETAILS
        // =====================================================

        displayTechnicalDetails(
            student.technical || {}
        );


        // =====================================================
        // SELF EVALUATION
        // =====================================================

        displaySelfEvaluation(
            student.selfEvaluation || {}
        );


        // =====================================================
        // CAREER DETAILS
        // =====================================================

        displayCareerDetails(
            student.career || {}
        );


        // =====================================================
        // SHOW PROFILE
        // =====================================================

        loadingMessage.style.display = "none";

        errorMessage.style.display = "none";

        profileContent.style.display = "block";
    }


    // =========================================================
    // ACADEMIC DETAILS
    // =========================================================

    function displayAcademicDetails(semesters) {

        const academicEmpty =
            document.getElementById("academicEmpty");

        const academicTable =
            document.getElementById("academicTable");

        const academicTableBody =
            document.getElementById("academicTableBody");


        if (!academicTableBody) {
            return;
        }


        academicTableBody.innerHTML = "";


        if (
            !semesters ||
            semesters.length === 0
        ) {

            if (academicEmpty) {
                academicEmpty.style.display = "block";
            }

            if (academicTable) {
                academicTable.style.display = "none";
            }

            return;
        }


        if (academicEmpty) {
            academicEmpty.style.display = "none";
        }

        if (academicTable) {
            academicTable.style.display = "block";
        }


        semesters.forEach(semester => {

            const row =
                document.createElement("tr");


            const interests =
                Array.isArray(semester.areaOfInterest)
                    ? semester.areaOfInterest
                    : [];


            let interestHTML = "-";


            if (interests.length > 0) {

                interestHTML =
                    interests
                        .map(
                            interest =>
                                `<span class="interest-badge">
                                    ${escapeHTML(interest)}
                                </span>`
                        )
                        .join("");
            }


            row.innerHTML = `

                <td>
                    ${escapeHTML(
                        semester.semesterNumber ?? "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        semester.sgpa ?? "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        semester.cumulativeCgpa ?? "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        semester.attendancePercentage ?? "-"
                    )}
                </td>

                <td>
                    ${semester.arrearStatus === true
                        ? '<span class="yes-badge">Yes</span>'
                        : '<span class="no-badge">No</span>'
                    }
                </td>

                <td>
                    ${escapeHTML(
                        semester.numberOfArrears ?? 0
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        semester.academicAchievements || "-"
                    )}
                </td>

                <td>
                    ${interestHTML}
                </td>

            `;


            academicTableBody.appendChild(row);
        });
    }


    // =========================================================
    // ARREAR DETAILS
    // =========================================================

    function displayArrearDetails(
        semesters,
        arrears
    ) {

        const arrearSection =
            document.getElementById("arrearSection");

        const arrearTableBody =
            document.getElementById("arrearTableBody");


        if (!arrearSection || !arrearTableBody) {
            return;
        }


        arrearTableBody.innerHTML = "";


        // =====================================================
        // CHECK WHETHER ANY SEMESTER HAS ARREAR = YES
        // =====================================================

        const hasArrearSemester =
            semesters.some(
                semester =>
                    semester.arrearStatus === true
            );


        // =====================================================
        // CHECK WHETHER ACTUAL ARREAR RECORDS EXIST
        // =====================================================

        const hasArrearRecords =
            Array.isArray(arrears) &&
            arrears.length > 0;


        // =====================================================
        // IF NO ARREAR → HIDE ENTIRE SECTION
        // =====================================================

        if (
            !hasArrearSemester &&
            !hasArrearRecords
        ) {

            arrearSection.style.display = "none";

            return;
        }


        // =====================================================
        // ARREAR EXISTS → SHOW SECTION
        // =====================================================

        arrearSection.style.display = "block";


        // =====================================================
        // DISPLAY ARREAR RECORDS
        // =====================================================

        if (hasArrearRecords) {

            arrears.forEach(arrear => {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${escapeHTML(
                            arrear.semesterNumber ?? "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            arrear.subjectCode || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            arrear.subjectName || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            arrear.attempts ?? "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            arrear.status || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            arrear.clearedSemester ?? "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            arrear.gradeAfterClearing || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            arrear.reasonForDifficulty || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            arrear.remedialSupportRequired || "-"
                        )}
                    </td>

                `;


                arrearTableBody.appendChild(row);
            });

        } else {

            /*
             * This means the semester says
             * Arrear = Yes, but no detailed arrear
             * record has been entered yet.
             */

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td colspan="9"
                    class="text-center text-muted">

                    Arrear status is Yes, but detailed
                    arrear information has not been entered.

                </td>

            `;


            arrearTableBody.appendChild(row);
        }
    }


    // =========================================================
    // TECHNICAL DETAILS
    // =========================================================

    function displayTechnicalDetails(technical) {

        const section =
            document.getElementById("technicalSection");


        if (!section) {
            return;
        }


        const programmingLanguages =
            Array.isArray(
                technical.programmingLanguages
            )
                ? technical.programmingLanguages
                : [];


        const technicalSkills =
            Array.isArray(
                technical.technicalSkills
            )
                ? technical.technicalSkills
                : [];


        const certifications =
            Array.isArray(
                technical.certifications
            )
                ? technical.certifications
                : [];


        const projects =
            Array.isArray(
                technical.projects
            )
                ? technical.projects
                : [];


        setText(
            "programmingLanguages",
            programmingLanguages.length > 0
                ? programmingLanguages.join(", ")
                : "-"
        );


        setText(
            "technicalSkills",
            technicalSkills.length > 0
                ? technicalSkills.join(", ")
                : "-"
        );


        setText(
            "areaOfInterest",
            technical.areaOfInterest
        );


        setText(
            "preferredTechnicalDomain",
            technical.preferredTechnicalDomain
        );


        setText(
            "certifications",
            certifications.length > 0
                ? certifications.join(", ")
                : "-"
        );


        if (projects.length > 0) {

            const projectText =
                projects
                    .map(project => {

                        let text =
                            project.name || "";

                        if (project.description) {

                            text +=
                                ` - ${project.description}`;
                        }

                        if (project.githubLink) {

                            text +=
                                ` (${project.githubLink})`;
                        }

                        return text;
                    })
                    .join(" | ");


            setText(
                "projects",
                projectText
            );

        } else {

            setText(
                "projects",
                "-"
            );
        }


        setText(
            "hackathons",
            technical.hackathons
        );


        setText(
            "internshipExperience",
            technical.internshipExperience
        );


        setText(
            "communicationSkillLevel",
            technical.communicationSkillLevel
        );


        setText(
            "aptitudeSkillLevel",
            technical.aptitudeSkillLevel
        );


        // =====================================================
        // HIDE SECTION IF COMPLETELY EMPTY
        // =====================================================

        const technicalHasData =
            programmingLanguages.length > 0 ||
            technicalSkills.length > 0 ||
            certifications.length > 0 ||
            projects.length > 0 ||
            !isEmpty(technical.areaOfInterest) ||
            !isEmpty(technical.preferredTechnicalDomain) ||
            !isEmpty(technical.hackathons) ||
            !isEmpty(technical.internshipExperience) ||
            !isEmpty(technical.communicationSkillLevel) ||
            !isEmpty(technical.aptitudeSkillLevel);


        section.style.display =
            technicalHasData
                ? "block"
                : "none";
    }


    // =========================================================
    // SELF EVALUATION
    // =========================================================

    function displaySelfEvaluation(selfEvaluation) {

        const section =
            document.getElementById(
                "selfEvaluationSection"
            );


        if (!section) {
            return;
        }


        setText(
            "academicStrengths",
            selfEvaluation.academicStrengths
        );

        setText(
            "technicalStrengths",
            selfEvaluation.technicalStrengths
        );

        setText(
            "communicationStrengths",
            selfEvaluation.communicationStrengths
        );

        setText(
            "leadershipQualities",
            selfEvaluation.leadershipQualities
        );

        setText(
            "teamworkAbilities",
            selfEvaluation.teamworkAbilities
        );

        setText(
            "areasRequiringImprovement",
            selfEvaluation.areasRequiringImprovement
        );

        setText(
            "subjectsRequiringSupport",
            selfEvaluation.subjectsRequiringSupport
        );

        setText(
            "technicalSkillsToDevelop",
            selfEvaluation.technicalSkillsToDevelop
        );

        setText(
            "communicationAptitudeToImprove",
            selfEvaluation.communicationAptitudeToImprove
        );

        setText(
            "mentorSupportExpected",
            selfEvaluation.mentorSupportExpected
        );

        setText(
            "shortTermGoal",
            selfEvaluation.shortTermGoal
        );

        setText(
            "longTermGoal",
            selfEvaluation.longTermGoal
        );


        // =====================================================
        // CHECK IF SELF EVALUATION HAS DATA
        // =====================================================

        const selfEvaluationHasData =
            hasAnyData(selfEvaluation);


        section.style.display =
            selfEvaluationHasData
                ? "block"
                : "none";
    }


    // =========================================================
    // CAREER DETAILS
    // =========================================================

    function displayCareerDetails(career) {

        const section =
            document.getElementById(
                "careerSection"
            );


        if (!section) {
            return;
        }


        const placementDetails =
            document.getElementById(
                "placementDetails"
            );


        const higherStudiesDetails =
            document.getElementById(
                "higherStudiesDetails"
            );


        const entrepreneurshipDetails =
            document.getElementById(
                "entrepreneurshipDetails"
            );


        setText(
            "careerGoal",
            career.goal
        );


        // =====================================================
        // HIDE ALL CAREER SUB-SECTIONS FIRST
        // =====================================================

        if (placementDetails) {
            placementDetails.style.display = "none";
        }

        if (higherStudiesDetails) {
            higherStudiesDetails.style.display = "none";
        }

        if (entrepreneurshipDetails) {
            entrepreneurshipDetails.style.display = "none";
        }


        // =====================================================
        // PLACEMENT
        // =====================================================

        if (career.goal === "Placement") {

            if (placementDetails) {
                placementDetails.style.display = "block";
            }


            const placement =
                career.placement || {};


            setText(
                "targetCompanyType",
                placement.targetCompanyType
            );

            setText(
                "preferredRole",
                placement.preferredRole
            );

            setText(
                "placementPreparationStatus",
                placement.preparationStatus
            );
        }


        // =====================================================
        // HIGHER STUDIES
        // =====================================================

        if (career.goal === "Higher Studies") {

            if (higherStudiesDetails) {
                higherStudiesDetails.style.display =
                    "block";
            }


            const higherStudies =
                career.higherStudies || {};


            setText(
                "preferredCourse",
                higherStudies.preferredCourse
            );

            setText(
                "preferredCountry",
                higherStudies.preferredCountry
            );

            setText(
                "entranceExam",
                higherStudies.entranceExam
            );

            setText(
                "higherStudiesPreparationStatus",
                higherStudies.preparationStatus
            );
        }


        // =====================================================
        // ENTREPRENEURSHIP
        // =====================================================

        if (
            career.goal === "Entrepreneurship"
        ) {

            if (entrepreneurshipDetails) {
                entrepreneurshipDetails.style.display =
                    "block";
            }


            const entrepreneurship =
                career.entrepreneurship || {};


            setText(
                "businessIdea",
                entrepreneurship.businessIdea
            );

            setText(
                "entrepreneurshipDomain",
                entrepreneurship.domain
            );

            setText(
                "entrepreneurshipCurrentStage",
                entrepreneurship.currentStage
            );

            setText(
                "entrepreneurshipSupportRequired",
                entrepreneurship.supportRequired
            );
        }


        // =====================================================
        // HIDE CAREER SECTION IF NO CAREER DATA
        // =====================================================

        if (!career.goal) {

            section.style.display = "none";

        } else {

            section.style.display = "block";
        }
    }


    // =========================================================
    // EDIT PROFILE
    // =========================================================

    function editProfile() {

        window.location.href =
            `/create-student.html?id=${studentId}`;
    }


    if (editProfileButton) {

        editProfileButton.addEventListener(
            "click",
            editProfile
        );
    }


    if (bottomEditButton) {

        bottomEditButton.addEventListener(
            "click",
            editProfile
        );
    }


    // =========================================================
    // LOGOUT
    // =========================================================

    function logout() {

        sessionStorage.removeItem(
            "loggedInStudentId"
        );

        window.location.href =
            "/student-login.html";
    }


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logout
        );
    }


    if (bottomLogoutButton) {

        bottomLogoutButton.addEventListener(
            "click",
            logout
        );
    }


    // =========================================================
    // HTML ESCAPE FUNCTION
    // =========================================================

    function escapeHTML(value) {

        if (
            value === undefined ||
            value === null
        ) {
            return "";
        }


        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // =========================================================
    // START
    // =========================================================

    loadStudent();

});