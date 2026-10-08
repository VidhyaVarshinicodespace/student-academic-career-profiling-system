document.addEventListener("DOMContentLoaded", function () {

    // =========================================================
    // BASIC SETUP
    // =========================================================

    const form = document.getElementById("studentForm");
    const submitButton = document.getElementById("submitButton");
    const cancelButton = document.getElementById("cancelButton");
    const pageTitle = document.getElementById("pageTitle");

    const params = new URLSearchParams(window.location.search);
    const studentId = params.get("id");
    const isEditMode = !!studentId;

    let semesterCounter = 0;


    // =========================================================
    // HELPER FUNCTIONS
    // =========================================================

    function element(id) {
        return document.getElementById(id);
    }


    function getValue(id) {
        const el = element(id);

        if (!el) {
            return "";
        }

        return el.value ?? "";
    }


    function setValue(id, value) {
        const el = element(id);

        if (!el) {
            return;
        }

        el.value =
            value === undefined || value === null
                ? ""
                : value;
    }


    function getNumber(id) {
        const value = getValue(id);

        if (value === "") {
            return undefined;
        }

        const number = Number(value);

        return Number.isNaN(number)
            ? undefined
            : number;
    }


    function setNumber(id, value) {
        const el = element(id);

        if (!el) {
            return;
        }

        el.value =
            value === undefined || value === null
                ? ""
                : value;
    }


    function getChecked(id) {
        const el = element(id);

        return el ? el.checked : false;
    }


    function setChecked(id, value) {
        const el = element(id);

        if (!el) {
            return;
        }

        el.checked = Boolean(value);
    }


    function setSelect(id, value) {
        const el = element(id);

        if (!el) {
            return;
        }

        if (value !== undefined && value !== null) {
            el.value = value;
        }
    }


    function getArray(id) {
        const value = getValue(id);

        if (!value.trim()) {
            return [];
        }

        return value
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);
    }


    function setArray(id, values) {
        const el = element(id);

        if (!el) {
            return;
        }

        if (!Array.isArray(values)) {
            el.value = "";
            return;
        }

        el.value = values.join(", ");
    }


    function getCardNumber(card, selector) {

        const input = card.querySelector(selector);

        if (!input || input.value === "") {
            return undefined;
        }

        const number = Number(input.value);

        return Number.isNaN(number)
            ? undefined
            : number;
    }


    // =========================================================
    // HOSTELLER / DAY SCHOLAR
    // =========================================================

    function updateCategoryFields() {

        const category = getValue("category");

        const hostelFields =
            element("hostelFields");

        const distanceFields =
            element("distanceFields");


        if (category === "Hosteller") {

            if (hostelFields) {
                hostelFields.style.display = "block";
            }

            if (distanceFields) {
                distanceFields.style.display = "none";
            }

        } else if (category === "Day Scholar") {

            if (hostelFields) {
                hostelFields.style.display = "none";
            }

            if (distanceFields) {
                distanceFields.style.display = "block";
            }

        } else {

            if (hostelFields) {
                hostelFields.style.display = "none";
            }

            if (distanceFields) {
                distanceFields.style.display = "none";
            }
        }
    }


    const category = element("category");

    if (category) {

        category.addEventListener(
            "change",
            updateCategoryFields
        );

        updateCategoryFields();
    }


    // =========================================================
    // CAREER GOAL
    // =========================================================

    function updateCareerFields() {

        const goal = getValue("careerGoal");

        const placementFields =
            element("placementFields");

        const higherStudiesFields =
            element("higherStudiesFields");

        const entrepreneurshipFields =
            element("entrepreneurshipFields");


        if (placementFields) {

            placementFields.style.display =
                goal === "Placement"
                    ? "block"
                    : "none";
        }


        if (higherStudiesFields) {

            higherStudiesFields.style.display =
                goal === "Higher Studies"
                    ? "block"
                    : "none";
        }


        if (entrepreneurshipFields) {

            entrepreneurshipFields.style.display =
                goal === "Entrepreneurship"
                    ? "block"
                    : "none";
        }
    }


    const careerGoal = element("careerGoal");

    if (careerGoal) {

        careerGoal.addEventListener(
            "change",
            updateCareerFields
        );

        updateCareerFields();
    }


    // =========================================================
    // INTEREST OPTIONS
    // =========================================================

    const interestOptions = [
        "DBMS",
        "CNS",
        "Machine Learning",
        "Artificial Intelligence",
        "Web Development",
        "Cloud Computing",
        "Cyber Security",
        "Data Science",
        "Networking"
    ];


    function createInterestOptions(
        selected = [],
        uniqueNumber
    ) {

        return interestOptions.map(
            (interest, index) => {

                const id =
                    `semester-${uniqueNumber}-interest-${index}`;

                const isSelected =
                    selected.includes(interest);

                return `
                    <div class="col-md-4 mb-2">

                        <div class="form-check">

                            <input
                                type="checkbox"
                                class="form-check-input semester-interest"
                                value="${interest}"
                                id="${id}"
                                ${isSelected ? "checked" : ""}
                            >

                            <label
                                class="form-check-label"
                                for="${id}"
                            >
                                ${interest}
                            </label>

                        </div>

                    </div>
                `;
            }
        ).join("");
    }


    // =========================================================
    // SEMESTER CONTAINER
    // =========================================================

    const semesterContainer =
        element("semesterContainer");


    // =========================================================
    // CREATE SEMESTER CARD
    // =========================================================

    function createSemesterCard(semester = {}) {

        semesterCounter++;

        const card =
            document.createElement("div");

        card.className =
            "semester-card border rounded p-3 mb-3";


        const semesterNumber =
            semester.semesterNumber ||
            semesterCounter;


        const selectedInterests =
            Array.isArray(semester.areaOfInterest)
                ? semester.areaOfInterest
                : [];


        card.innerHTML = `

            <div class="d-flex justify-content-between align-items-center mb-3">

                <h5>
                    Semester ${semesterNumber}
                </h5>

                ${
                    semesterCounter > 1
                        ? `
                            <button
                                type="button"
                                class="btn btn-danger btn-sm remove-semester"
                            >
                                Remove
                            </button>
                        `
                        : ""
                }

            </div>


            <div class="row g-3">

                <div class="col-md-3">

                    <label class="form-label">
                        Semester Number
                    </label>

                    <input
                        type="number"
                        class="form-control semester-number"
                        min="1"
                        value="${semesterNumber}"
                    >

                </div>


                <div class="col-md-3">

                    <label class="form-label">
                        SGPA
                    </label>

                    <input
                        type="number"
                        class="form-control semester-sgpa"
                        min="0"
                        max="10"
                        step="0.01"
                        value="${semester.sgpa ?? ""}"
                    >

                </div>


                <div class="col-md-3">

                    <label class="form-label">
                        CGPA
                    </label>

                    <input
                        type="number"
                        class="form-control semester-cgpa"
                        min="0"
                        max="10"
                        step="0.01"
                        value="${semester.cumulativeCgpa ?? ""}"
                    >

                </div>


                <div class="col-md-3">

                    <label class="form-label">
                        Attendance (%)
                    </label>

                    <input
                        type="number"
                        class="form-control semester-attendance"
                        min="0"
                        max="100"
                        step="0.01"
                        value="${semester.attendancePercentage ?? ""}"
                    >

                </div>


                <div class="col-md-4">

                    <label class="form-label">
                        Arrear Status
                    </label>

                    <select
                        class="form-select semester-arrear-status"
                    >

                        <option value="false">
                            No
                        </option>

                        <option value="true">
                            Yes
                        </option>

                    </select>

                </div>


                <div class="col-md-4">

                    <label class="form-label">
                        Number of Arrears
                    </label>

                    <input
                        type="number"
                        class="form-control semester-number-arrears"
                        min="0"
                        value="${semester.numberOfArrears ?? 0}"
                    >

                </div>


                <div class="col-md-4">

                    <label class="form-label">
                        Academic Achievements
                    </label>

                    <input
                        type="text"
                        class="form-control semester-achievements"
                        value="${semester.academicAchievements || ""}"
                    >

                </div>


                <div class="col-12">

                    <label class="form-label">
                        Area of Interest
                    </label>

                    <div class="row">

                        ${createInterestOptions(
                            selectedInterests,
                            semesterCounter
                        )}

                    </div>

                </div>

            </div>
        `;


        semesterContainer.appendChild(card);


        // Set arrear status

        const arrearSelect =
            card.querySelector(
                ".semester-arrear-status"
            );

        arrearSelect.value =
            semester.arrearStatus === true
                ? "true"
                : "false";


        arrearSelect.addEventListener(
            "change",
            updateArrearSection
        );


        // Remove semester

        const removeButton =
            card.querySelector(
                ".remove-semester"
            );


        if (removeButton) {

            removeButton.addEventListener(
                "click",
                function () {

                    card.remove();

                    renumberSemesters();

                    updateArrearSection();
                }
            );
        }
    }


    // =========================================================
    // RENUMBER SEMESTERS
    // =========================================================

    function renumberSemesters() {

        if (!semesterContainer) {
            return;
        }


        const cards =
            semesterContainer.querySelectorAll(
                ".semester-card"
            );


        cards.forEach(
            (card, index) => {

                const number =
                    index + 1;


                const heading =
                    card.querySelector("h5");


                if (heading) {

                    heading.textContent =
                        `Semester ${number}`;
                }


                const input =
                    card.querySelector(
                        ".semester-number"
                    );


                if (input) {

                    input.value =
                        number;
                }
            }
        );
    }


    // =========================================================
    // ADD SEMESTER BUTTON
    // =========================================================

    if (semesterContainer) {

        const academicSection =
            semesterContainer.parentElement;


        const addSemesterButton =
            document.createElement("button");


        addSemesterButton.type =
            "button";


        addSemesterButton.className =
            "btn btn-outline-primary mb-3";


        addSemesterButton.textContent =
            "+ Add Semester";


        addSemesterButton.addEventListener(
            "click",
            function () {

                createSemesterCard();

                updateArrearSection();
            }
        );


        academicSection.appendChild(
            addSemesterButton
        );
    }


    // =========================================================
    // INITIAL SEMESTER
    // =========================================================

    if (semesterContainer) {

        semesterContainer.innerHTML = "";

        semesterCounter = 0;

        createSemesterCard({
            semesterNumber: 1,
            areaOfInterest: []
        });
    }


    // =========================================================
    // ARREAR SECTION
    // =========================================================

    function getArrearSection() {

        const subjectCode =
            element("arrearSubjectCode");

        if (!subjectCode) {
            return null;
        }


        let current =
            subjectCode.parentElement;


        while (
            current &&
            current !== document.body
        ) {

            const text =
                current.innerText || "";


            if (
                text.includes("Arrear Details") &&
                (
                    text.includes("Subject Code") ||
                    text.includes("Subject Name")
                )
            ) {

                return current;
            }


            current =
                current.parentElement;
        }


        return null;
    }


    function updateArrearSection() {

        const statuses =
            document.querySelectorAll(
                ".semester-arrear-status"
            );


        let hasArrear = false;


        statuses.forEach(
            select => {

                if (select.value === "true") {

                    hasArrear = true;
                }
            }
        );


        const arrearSection =
            getArrearSection();


        if (arrearSection) {

            arrearSection.style.display =
                hasArrear
                    ? "block"
                    : "none";
        }
    }


    // =========================================================
    // COLLECT SEMESTERS
    // =========================================================

    function collectSemesters() {

        if (!semesterContainer) {
            return [];
        }


        const cards =
            semesterContainer.querySelectorAll(
                ".semester-card"
            );


        const semesters = [];


        cards.forEach(card => {

            const semesterNumber =
                Number(
                    card.querySelector(
                        ".semester-number"
                    ).value
                );


            const sgpa =
                getCardNumber(
                    card,
                    ".semester-sgpa"
                );


            const cgpa =
                getCardNumber(
                    card,
                    ".semester-cgpa"
                );


            const attendance =
                getCardNumber(
                    card,
                    ".semester-attendance"
                );


            const numberOfArrears =
                getCardNumber(
                    card,
                    ".semester-number-arrears"
                );


            const arrearStatus =
                card.querySelector(
                    ".semester-arrear-status"
                ).value === "true";


            const achievements =
                card.querySelector(
                    ".semester-achievements"
                ).value.trim();


            const interests =
                Array.from(
                    card.querySelectorAll(
                        ".semester-interest:checked"
                    )
                ).map(
                    checkbox => checkbox.value
                );


            const hasAcademicData =
                sgpa !== undefined ||
                cgpa !== undefined ||
                attendance !== undefined ||
                numberOfArrears !== undefined ||
                arrearStatus ||
                achievements !== "" ||
                interests.length > 0;


            if (!hasAcademicData) {
                return;
            }


            semesters.push({

                semesterNumber,

                sgpa,

                cumulativeCgpa: cgpa,

                attendancePercentage:
                    attendance,

                arrearStatus,

                numberOfArrears:
                    numberOfArrears ?? 0,

                academicAchievements:
                    achievements,

                areaOfInterest:
                    interests
            });
        });


        return semesters;
    }


    // =========================================================
    // COLLECT ARREARS
    // =========================================================

    function collectArrears() {

        const semesters =
            collectSemesters();


        const arrears = [];


        semesters.forEach(
            semester => {

                if (
                    semester.arrearStatus !== true
                ) {
                    return;
                }


                const subjectCode =
                    getValue(
                        "arrearSubjectCode"
                    );


                const subjectName =
                    getValue(
                        "arrearSubjectName"
                    );


                const attempts =
                    getNumber(
                        "arrearAttempts"
                    );


                const status =
                    getValue(
                        "arrearStatus"
                    );


                const clearedSemester =
                    getNumber(
                        "clearedSemester"
                    );


                const gradeAfterClearing =
                    getValue(
                        "gradeAfterClearing"
                    );


                const reasonForDifficulty =
                    getValue(
                        "reasonForDifficulty"
                    );


                const remedialSupportRequired =
                    getValue(
                        "remedialSupportRequired"
                    );


                if (
                    subjectCode ||
                    subjectName ||
                    attempts ||
                    status ||
                    clearedSemester ||
                    gradeAfterClearing ||
                    reasonForDifficulty ||
                    remedialSupportRequired
                ) {

                    arrears.push({

                        semesterNumber:
                            semester.semesterNumber,

                        subjectCode,

                        subjectName,

                        attempts,

                        status:
                            status || undefined,

                        clearedSemester,

                        gradeAfterClearing,

                        reasonForDifficulty,

                        remedialSupportRequired
                    });
                }
            }
        );


        return arrears;
    }


    // =========================================================
    // COLLECT COMPLETE STUDENT
    // =========================================================

    function collectStudentData() {

        const data = {

            // PERSONAL

            studentName:
                getValue("studentName"),

            registerNumber:
                getValue("registerNumber"),

            dateOfBirth:
                getValue("dateOfBirth") ||
                undefined,

            gender:
                getValue("gender"),

            department:
                getValue("department"),

            section:
                getValue("section"),

            institutionalEmail:
                getValue("institutionalEmail"),

            personalEmail:
                getValue("personalEmail"),

            mobile:
                getValue("mobile"),

            residentialAddress:
                getValue("residentialAddress"),

            category:
                getValue("category") ||
                undefined,

            hostelName:
                getValue("hostelName"),

            distanceToCollege:
                getNumber(
                    "distanceToCollege"
                ),


            // FAMILY

            family: {

                fatherName:
                    getValue("fatherName"),

                fatherOccupation:
                    getValue("fatherOccupation"),

                fatherIncomeRange:
                    getValue("fatherIncomeRange"),

                fatherMobile:
                    getValue("fatherMobile"),

                motherName:
                    getValue("motherName"),

                motherOccupation:
                    getValue("motherOccupation"),

                motherIncomeRange:
                    getValue("motherIncomeRange"),

                motherMobile:
                    getValue("motherMobile"),

                guardianName:
                    getValue("guardianName"),

                emergencyContact:
                    getValue("emergencyContact"),

                firstGenerationGraduate:
                    getChecked(
                        "firstGenerationGraduate"
                    ),

                scholarshipReceived:
                    getChecked(
                        "scholarshipReceived"
                    ),

                financialGuidanceRequired:
                    getChecked(
                        "financialGuidanceRequired"
                    )
            },


            // ACADEMIC

            semesters:
                collectSemesters(),


            // ARREARS

            arrears:
                collectArrears(),


            // TECHNICAL

            technical: {

                programmingLanguages:
                    getArray(
                        "programmingLanguages"
                    ),

                technicalSkills:
                    getArray(
                        "technicalSkills"
                    ),

                areaOfInterest:
                    getValue(
                        "technicalAreaOfInterest"
                    ),

                preferredTechnicalDomain:
                    getValue(
                        "preferredTechnicalDomain"
                    ),

                certifications:
                    getArray(
                        "certifications"
                    ),

                projects: [],

                hackathons:
                    getValue("hackathons"),

                internshipExperience:
                    getValue(
                        "internshipExperience"
                    ),

                githubProfile:
                    getValue("githubProfile"),

                linkedinProfile:
                    getValue("linkedinProfile"),

                hackerrankProfile:
                    getValue(
                        "hackerrankProfile"
                    ),

                hackerearthProfile:
                    getValue(
                        "hackerearthProfile"
                    ),

                communicationSkillLevel:
                    getValue(
                        "communicationSkillLevel"
                    ),

                aptitudeSkillLevel:
                    getValue(
                        "aptitudeSkillLevel"
                    )
            },


            // SELF EVALUATION

            selfEvaluation: {

                academicStrengths:
                    getValue(
                        "academicStrengths"
                    ),

                technicalStrengths:
                    getValue(
                        "technicalStrengths"
                    ),

                communicationStrengths:
                    getValue(
                        "communicationStrengths"
                    ),

                leadershipQualities:
                    getValue(
                        "leadershipQualities"
                    ),

                teamworkAbilities:
                    getValue(
                        "teamworkAbilities"
                    ),

                areasRequiringImprovement:
                    getValue(
                        "areasRequiringImprovement"
                    ),

                subjectsRequiringSupport:
                    getValue(
                        "subjectsRequiringSupport"
                    ),

                technicalSkillsToDevelop:
                    getValue(
                        "technicalSkillsToDevelop"
                    ),

                communicationAptitudeToImprove:
                    getValue(
                        "communicationAptitudeToImprove"
                    ),

                mentorSupportExpected:
                    getValue(
                        "mentorSupportExpected"
                    ),

                shortTermGoal:
                    getValue(
                        "shortTermGoal"
                    ),

                longTermGoal:
                    getValue(
                        "longTermGoal"
                    )
            },


            // CAREER

            career: {

                goal:
                    getValue("careerGoal")
            }
        };


        // PLACEMENT

        if (
            data.career.goal ===
            "Placement"
        ) {

            data.career.placement = {

                targetCompanyType:
                    getValue(
                        "targetCompanyType"
                    ),

                preferredRole:
                    getValue(
                        "preferredRole"
                    ),

                preparationStatus:
                    getValue(
                        "placementPreparationStatus"
                    )
            };
        }


        // HIGHER STUDIES

        if (
            data.career.goal ===
            "Higher Studies"
        ) {

            data.career.higherStudies = {

                preferredCourse:
                    getValue(
                        "preferredCourse"
                    ),

                preferredCountry:
                    getValue(
                        "preferredCountry"
                    ),

                entranceExam:
                    getValue(
                        "entranceExam"
                    ),

                preparationStatus:
                    getValue(
                        "higherStudiesPreparationStatus"
                    )
            };
        }


        // ENTREPRENEURSHIP

        if (
            data.career.goal ===
            "Entrepreneurship"
        ) {

            data.career.entrepreneurship = {

                businessIdea:
                    getValue(
                        "businessIdea"
                    ),

                domain:
                    getValue(
                        "entrepreneurshipDomain"
                    ),

                currentStage:
                    getValue(
                        "entrepreneurshipCurrentStage"
                    ),

                supportRequired:
                    getValue(
                        "entrepreneurshipSupportRequired"
                    )
            };
        }


        return data;
    }


    // =========================================================
    // POPULATE FORM
    // =========================================================

    function populateForm(student) {

        console.log(
            "POPULATING STUDENT:",
            student
        );


        // -----------------------------------------------------
        // PERSONAL DETAILS
        // -----------------------------------------------------

        setValue(
            "studentName",
            student.studentName
        );


        setValue(
            "registerNumber",
            student.registerNumber
        );


        setValue(
            "dateOfBirth",
            student.dateOfBirth
                ? student.dateOfBirth.substring(0, 10)
                : ""
        );


        setSelect(
            "gender",
            student.gender
        );


        setValue(
            "department",
            student.department
        );


        setValue(
            "section",
            student.section
        );


        setValue(
            "institutionalEmail",
            student.institutionalEmail
        );


        setValue(
            "personalEmail",
            student.personalEmail
        );


        setValue(
            "mobile",
            student.mobile
        );


        setValue(
            "residentialAddress",
            student.residentialAddress
        );


        setSelect(
            "category",
            student.category
        );


        setValue(
            "hostelName",
            student.hostelName
        );


        setNumber(
            "distanceToCollege",
            student.distanceToCollege
        );


        updateCategoryFields();


        // -----------------------------------------------------
        // FAMILY DETAILS
        // -----------------------------------------------------

        const family =
            student.family || {};


        setValue(
            "fatherName",
            family.fatherName
        );


        setValue(
            "fatherOccupation",
            family.fatherOccupation
        );


        setValue(
            "fatherIncomeRange",
            family.fatherIncomeRange
        );


        setValue(
            "fatherMobile",
            family.fatherMobile
        );


        setValue(
            "motherName",
            family.motherName
        );


        setValue(
            "motherOccupation",
            family.motherOccupation
        );


        setValue(
            "motherIncomeRange",
            family.motherIncomeRange
        );


        setValue(
            "motherMobile",
            family.motherMobile
        );


        setValue(
            "guardianName",
            family.guardianName
        );


        setValue(
            "emergencyContact",
            family.emergencyContact
        );


        setChecked(
            "firstGenerationGraduate",
            family.firstGenerationGraduate
        );


        setChecked(
            "scholarshipReceived",
            family.scholarshipReceived
        );


        setChecked(
            "financialGuidanceRequired",
            family.financialGuidanceRequired
        );


        // -----------------------------------------------------
        // ACADEMIC DETAILS
        // -----------------------------------------------------

        if (semesterContainer) {

            semesterContainer.innerHTML = "";

            semesterCounter = 0;


            if (
                Array.isArray(student.semesters) &&
                student.semesters.length > 0
            ) {

                student.semesters.forEach(
                    semester => {

                        createSemesterCard(
                            semester
                        );
                    }
                );

            } else {

                createSemesterCard({
                    semesterNumber: 1,
                    areaOfInterest: []
                });
            }
        }


        // -----------------------------------------------------
        // TECHNICAL DETAILS
        // -----------------------------------------------------

        const technical =
            student.technical || {};


        setArray(
            "programmingLanguages",
            technical.programmingLanguages
        );


        setArray(
            "technicalSkills",
            technical.technicalSkills
        );


        setValue(
            "technicalAreaOfInterest",
            technical.areaOfInterest
        );


        setValue(
            "preferredTechnicalDomain",
            technical.preferredTechnicalDomain
        );


        setArray(
            "certifications",
            technical.certifications
        );


        setValue(
            "hackathons",
            technical.hackathons
        );


        setValue(
            "internshipExperience",
            technical.internshipExperience
        );


        setValue(
            "githubProfile",
            technical.githubProfile
        );


        setValue(
            "linkedinProfile",
            technical.linkedinProfile
        );


        setValue(
            "hackerrankProfile",
            technical.hackerrankProfile
        );


        setValue(
            "hackerearthProfile",
            technical.hackerearthProfile
        );


        setValue(
            "communicationSkillLevel",
            technical.communicationSkillLevel
        );


        setValue(
            "aptitudeSkillLevel",
            technical.aptitudeSkillLevel
        );


        // -----------------------------------------------------
        // SELF EVALUATION
        // -----------------------------------------------------

        const selfEvaluation =
            student.selfEvaluation || {};


        setValue(
            "academicStrengths",
            selfEvaluation.academicStrengths
        );


        setValue(
            "technicalStrengths",
            selfEvaluation.technicalStrengths
        );


        setValue(
            "communicationStrengths",
            selfEvaluation.communicationStrengths
        );


        setValue(
            "leadershipQualities",
            selfEvaluation.leadershipQualities
        );


        setValue(
            "teamworkAbilities",
            selfEvaluation.teamworkAbilities
        );


        setValue(
            "areasRequiringImprovement",
            selfEvaluation.areasRequiringImprovement
        );


        setValue(
            "subjectsRequiringSupport",
            selfEvaluation.subjectsRequiringSupport
        );


        setValue(
            "technicalSkillsToDevelop",
            selfEvaluation.technicalSkillsToDevelop
        );


        setValue(
            "communicationAptitudeToImprove",
            selfEvaluation.communicationAptitudeToImprove
        );


        setValue(
            "mentorSupportExpected",
            selfEvaluation.mentorSupportExpected
        );


        setValue(
            "shortTermGoal",
            selfEvaluation.shortTermGoal
        );


        setValue(
            "longTermGoal",
            selfEvaluation.longTermGoal
        );


        // -----------------------------------------------------
        // CAREER
        // -----------------------------------------------------

        const career =
            student.career || {};


        setSelect(
            "careerGoal",
            career.goal
        );


        if (career.placement) {

            setValue(
                "targetCompanyType",
                career.placement.targetCompanyType
            );


            setValue(
                "preferredRole",
                career.placement.preferredRole
            );


            setValue(
                "placementPreparationStatus",
                career.placement.preparationStatus
            );
        }


        if (career.higherStudies) {

            setValue(
                "preferredCourse",
                career.higherStudies.preferredCourse
            );


            setValue(
                "preferredCountry",
                career.higherStudies.preferredCountry
            );


            setValue(
                "entranceExam",
                career.higherStudies.entranceExam
            );


            setValue(
                "higherStudiesPreparationStatus",
                career.higherStudies.preparationStatus
            );
        }


        if (career.entrepreneurship) {

            setValue(
                "businessIdea",
                career.entrepreneurship.businessIdea
            );


            setValue(
                "entrepreneurshipDomain",
                career.entrepreneurship.domain
            );


            setValue(
                "entrepreneurshipCurrentStage",
                career.entrepreneurship.currentStage
            );


            setValue(
                "entrepreneurshipSupportRequired",
                career.entrepreneurship.supportRequired
            );
        }


        updateCareerFields();

        updateArrearSection();


        // -----------------------------------------------------
        // EDIT MODE
        // -----------------------------------------------------

        if (pageTitle) {

            pageTitle.textContent =
                "Edit Student Profile";
        }


        if (submitButton) {

            submitButton.textContent =
                "Update Student Profile";
        }


        console.log(
            "FORM POPULATED SUCCESSFULLY"
        );
    }


    // =========================================================
    // LOAD STUDENT
    // =========================================================

    async function loadStudent() {

        if (!isEditMode) {
            return;
        }


        console.log(
            "Loading student:",
            studentId
        );


        try {

            const response =
                await fetch(
                    `/api/students/${studentId}`
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to load student profile."
                );
            }


            const student =
                await response.json();


            console.log(
                "STUDENT LOADED:",
                student
            );


            populateForm(student);


        } catch (error) {

            console.error(
                "LOAD ERROR:",
                error
            );


            alert(
                "Failed to load student details."
            );
        }
    }


    // =========================================================
    // SUBMIT FORM
    // =========================================================

    if (form) {

        form.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                try {

                    const data =
                        collectStudentData();


                    if (!data.studentName) {

                        alert(
                            "Please enter Student Name."
                        );

                        return;
                    }


                    if (!data.registerNumber) {

                        alert(
                            "Please enter Register Number."
                        );

                        return;
                    }


                    if (!data.institutionalEmail) {

                        alert(
                            "Please enter Institutional Email."
                        );

                        return;
                    }


                    if (submitButton) {

                        submitButton.disabled =
                            true;

                        submitButton.textContent =
                            isEditMode
                                ? "Updating..."
                                : "Saving...";
                    }


                    const url =
                        isEditMode
                            ? `/api/students/${studentId}`
                            : "/api/students";


                    const method =
                        isEditMode
                            ? "PUT"
                            : "POST";


                    const response =
                        await fetch(
                            url,
                            {
                                method: method,

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(data)
                            }
                        );


                    const result =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            result.message ||
                            result.error ||
                            "Failed to save student."
                        );
                    }


                    alert(
                        isEditMode
                            ? "Student profile updated successfully!"
                            : "Student profile created successfully!"
                    );


                    const savedId =
                        result._id ||
                        studentId;


                    if (savedId) {

                        window.location.href =
                            `/student-profile.html?id=${savedId}`;

                    } else {

                        window.location.href =
                            "/faculty-dashboard.html";
                    }


                } catch (error) {

                    console.error(
                        "SAVE ERROR:",
                        error
                    );


                    alert(
                        error.message ||
                        "Failed to save student."
                    );


                } finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            isEditMode
                                ? "Update Student Profile"
                                : "Save Student Profile";
                    }
                }
            }
        );
    }


    // =========================================================
    // CANCEL BUTTON
    // =========================================================

    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            function () {

                if (studentId) {

                    window.location.href =
                        `/student-profile.html?id=${studentId}`;

                } else {

                    window.location.href =
                        "/faculty-dashboard.html";
                }
            }
        );
    }


    // =========================================================
    // START
    // =========================================================

    loadStudent();

});