let students = [];


// ===============================
// LOAD STUDENTS
// ===============================

async function loadStudents() {

    try {

        const response = await fetch("/api/students");

        if (!response.ok) {
            throw new Error("Failed to fetch students");
        }

        students = await response.json();

        console.log("Students loaded:", students);

        updateSummary();

        applyFilters();

    } catch (error) {

        console.error(error);

        document.getElementById("studentTableBody").innerHTML = `
            <tr>
                <td colspan="10" class="text-center text-danger">
                    Unable to load student records.
                </td>
            </tr>
        `;
    }
}


// ===============================
// SUMMARY
// ===============================

function updateSummary() {

    document.getElementById("totalStudents").textContent =
        students.length;

    const hostellers = students.filter(
        student => student.category === "Hosteller"
    ).length;

    const dayScholars = students.filter(
        student => student.category === "Day Scholar"
    ).length;

    document.getElementById("hostellers").textContent =
        hostellers;

    document.getElementById("dayScholars").textContent =
        dayScholars;
}


// ===============================
// GET CAREER GOAL
// ===============================

function getCareerGoal(student) {

    // Normal structure
    if (
        student.career &&
        student.career.goal
    ) {
        return student.career.goal;
    }

    // Backup in case careerGoal was stored separately
    if (student.careerGoal) {
        return student.careerGoal;
    }

    return "";
}


// ===============================
// GET CGPA
// ===============================

function getLatestCGPA(student) {

    // If a top-level CGPA exists
    if (
        student.cgpa !== undefined &&
        student.cgpa !== null &&
        student.cgpa !== ""
    ) {
        return Number(student.cgpa);
    }


    // Check semester records
    if (
        !student.semesters ||
        student.semesters.length === 0
    ) {
        return 0;
    }


    // Find semesters having cumulative CGPA
    const validSemesters =
        student.semesters.filter(semester =>

            semester.cumulativeCgpa !== undefined &&
            semester.cumulativeCgpa !== null &&
            semester.cumulativeCgpa !== ""

        );


    if (validSemesters.length > 0) {

        const latestSemester =
            validSemesters[validSemesters.length - 1];

        return Number(
            latestSemester.cumulativeCgpa
        );
    }


    // Backup: use SGPA if cumulative CGPA isn't available
    const validSGPA =
        student.semesters.filter(semester =>

            semester.sgpa !== undefined &&
            semester.sgpa !== null &&
            semester.sgpa !== ""

        );


    if (validSGPA.length > 0) {

        const latestSemester =
            validSGPA[validSGPA.length - 1];

        return Number(latestSemester.sgpa);
    }


    return 0;
}


// ===============================
// CHECK ARREAR
// ===============================

function hasArrear(student) {

    // 1. Check arrears array
    if (
        Array.isArray(student.arrears) &&
        student.arrears.length > 0
    ) {
        return true;
    }


    // 2. Check semester arrear information
    if (
        Array.isArray(student.semesters)
    ) {

        for (const semester of student.semesters) {

            // arrearStatus = true
            if (
                semester.arrearStatus === true
            ) {
                return true;
            }


            // numberOfArrears > 0
            if (
                Number(semester.numberOfArrears) > 0
            ) {
                return true;
            }

        }
    }


    // 3. Check top-level arrearStatus
    if (
        student.arrearStatus === true
    ) {
        return true;
    }


    // 4. Check numberOfArrears at top level
    if (
        Number(student.numberOfArrears) > 0
    ) {
        return true;
    }


    return false;
}


// ===============================
// APPLY FILTERS
// ===============================

function applyFilters() {

    let filteredStudents = [...students];


    // --------------------------------
    // SEARCH
    // --------------------------------

    const search =
        document
            .getElementById("searchInput")
            .value
            .trim()
            .toLowerCase();


    if (search !== "") {

        filteredStudents =
            filteredStudents.filter(student => {

                const registerNumber =
                    String(
                        student.registerNumber || ""
                    ).toLowerCase();

                const studentName =
                    String(
                        student.studentName || ""
                    ).toLowerCase();


                return (
                    registerNumber.includes(search) ||
                    studentName.includes(search)
                );

            });
    }


    // --------------------------------
    // CATEGORY
    // --------------------------------

    const category =
        document.getElementById("categoryFilter").value;


    if (category !== "All") {

        filteredStudents =
            filteredStudents.filter(student =>

                student.category === category

            );
    }


    // --------------------------------
    // CAREER GOAL
    // --------------------------------

    const career =
        document.getElementById("careerFilter").value;


    if (career !== "All") {

        filteredStudents =
            filteredStudents.filter(student => {

                const studentCareer =
                    getCareerGoal(student);

                return studentCareer === career;

            });
    }


    // --------------------------------
    // ARREAR STATUS
    // --------------------------------

    const arrear =
        document.getElementById("arrearFilter").value;


    if (arrear === "Arrear") {

        filteredStudents =
            filteredStudents.filter(student =>
                hasArrear(student)
            );
    }


    if (arrear === "No Arrear") {

        filteredStudents =
            filteredStudents.filter(student =>
                !hasArrear(student)
            );
    }


    // --------------------------------
    // CGPA SORTING
    // --------------------------------

    const cgpaSort =
        document.getElementById("cgpaSort").value;


    if (cgpaSort === "High") {

        filteredStudents.sort((a, b) => {

            return (
                getLatestCGPA(b) -
                getLatestCGPA(a)
            );

        });
    }


    if (cgpaSort === "Low") {

        filteredStudents.sort((a, b) => {

            return (
                getLatestCGPA(a) -
                getLatestCGPA(b)
            );

        });
    }


    // Display results
    displayStudents(filteredStudents);
}


// ===============================
// DISPLAY STUDENTS
// ===============================

function displayStudents(studentList) {

    const tableBody =
        document.getElementById("studentTableBody");


    tableBody.innerHTML = "";


    document.getElementById("resultCount").textContent =
        `${studentList.length} Student${studentList.length !== 1 ? "s" : ""}`;


    if (studentList.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center">
                    No matching student records found.
                </td>
            </tr>
        `;

        return;
    }


    studentList.forEach((student, index) => {

        const cgpa =
            getLatestCGPA(student);


        const arrear =
            hasArrear(student);


        const careerGoal =
            getCareerGoal(student);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${index + 1}
            </td>

            <td>
                ${student.registerNumber || "-"}
            </td>

            <td>
                ${student.studentName || "-"}
            </td>

            <td>
                ${student.department || "-"}
            </td>

            <td>
                ${student.section || "-"}
            </td>

            <td>
                ${student.category || "-"}
            </td>

            <td>
                ${careerGoal || "-"}
            </td>

            <td>
                ${
                    cgpa > 0
                        ? cgpa.toFixed(2)
                        : "-"
                }
            </td>

            <td>
                ${
                    arrear
                        ? '<span class="badge bg-danger">Yes</span>'
                        : '<span class="badge bg-success">No</span>'
                }
            </td>

            <td>

                <button
                    class="btn btn-sm btn-outline-primary me-1"
                    onclick="viewStudent('${student._id}')"
                >
                    View
                </button>

                <button
                    class="btn btn-sm btn-outline-warning"
                    onclick="editStudent('${student._id}')"
                >
                    Edit
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });
}


// ===============================
// VIEW STUDENT
// ===============================

function viewStudent(id) {

    window.location.href =
        `/profile-view.html?id=${id}`;
}


// ===============================
// EDIT STUDENT
// ===============================

function editStudent(id) {

    window.location.href =
        `/create-student.html?id=${id}`;
}


// ===============================
// FILTER EVENTS
// ===============================

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        applyFilters
    );


document
    .getElementById("categoryFilter")
    .addEventListener(
        "change",
        applyFilters
    );


document
    .getElementById("careerFilter")
    .addEventListener(
        "change",
        applyFilters
    );


document
    .getElementById("arrearFilter")
    .addEventListener(
        "change",
        applyFilters
    );


document
    .getElementById("cgpaSort")
    .addEventListener(
        "change",
        applyFilters
    );


// ===============================
// CLEAR FILTERS
// ===============================

document
    .getElementById("clearFilters")
    .addEventListener(
        "click",
        function () {

            document.getElementById("searchInput").value = "";

            document.getElementById("categoryFilter").value =
                "All";

            document.getElementById("careerFilter").value =
                "All";

            document.getElementById("arrearFilter").value =
                "All";

            document.getElementById("cgpaSort").value =
                "None";


            applyFilters();

        }
    );


// ===============================
// START
// ===============================

loadStudents();