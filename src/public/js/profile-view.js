let students = [];

async function loadStudents() {

    try {

        const response = await fetch("/api/students");

        if (!response.ok) {
            throw new Error("Failed to fetch students");
        }

        students = await response.json();

        const select = document.getElementById("studentSelect");

        select.innerHTML = "";

        students.forEach((student, index) => {

            const option = document.createElement("option");

            option.value = index;

            option.textContent =
                `${student.registerNumber} - ${student.studentName}`;

            select.appendChild(option);

        });

        // Show first student initially
        if (students.length > 0) {
            displayStudent(0);
        }

    } catch (error) {

        console.error(error);

        document.getElementById("studentSelect").innerHTML =
            `<option>Unable to load students</option>`;

    }
}


function displayStudent(index) {

    const student = students[index];

    if (!student) {
        return;
    }


    // Personal details

    document.getElementById("registerNumber").textContent =
        student.registerNumber || "-";

    document.getElementById("studentName").textContent =
        student.studentName || "-";

    document.getElementById("dateOfBirth").textContent =
        student.dateOfBirth
            ? new Date(student.dateOfBirth).toLocaleDateString()
            : "-";

    document.getElementById("gender").textContent =
        student.gender || "-";

    document.getElementById("department").textContent =
        student.department || "-";

    document.getElementById("section").textContent =
        student.section || "-";

    document.getElementById("institutionalEmail").textContent =
        student.institutionalEmail || "-";

    document.getElementById("category").textContent =
        student.category || "-";


    // Academic details

    const academicMessage =
        document.getElementById("academicMessage");

    const academicTable =
        document.getElementById("academicTable");

    const tableBody =
        document.getElementById("semesterTableBody");


    tableBody.innerHTML = "";


    if (student.semesters && student.semesters.length > 0) {

        academicMessage.classList.add("d-none");

        academicTable.classList.remove("d-none");


        student.semesters.forEach(semester => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${semester.semesterNumber || "-"}</td>
                <td>${semester.sgpa || "-"}</td>
                <td>${semester.cumulativeCgpa || "-"}</td>
                <td>${semester.attendancePercentage || "-"}%</td>
                <td>${semester.numberOfArrears || 0}</td>
            `;

            tableBody.appendChild(row);

        });

    } else {

        academicMessage.classList.remove("d-none");

        academicTable.classList.add("d-none");

    }

}


// Change student when dropdown changes

document
    .getElementById("studentSelect")
    .addEventListener("change", function () {

        displayStudent(this.value);

    });


loadStudents();