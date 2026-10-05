async function loadDashboard() {
    try {
        const response = await fetch("/api/students");

        if (!response.ok) {
            throw new Error("Failed to fetch students");
        }

        const students = await response.json();

        // Dashboard statistics
        document.getElementById("totalStudents").textContent = students.length;

        const hostellers = students.filter(
            student => student.category === "Hosteller"
        ).length;

        const dayScholars = students.filter(
            student => student.category === "Day Scholar"
        ).length;

        document.getElementById("hostellers").textContent = hostellers;
        document.getElementById("dayScholars").textContent = dayScholars;

        // Student table
        const tableBody = document.getElementById("studentTableBody");

        tableBody.innerHTML = "";

        if (students.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        No student records found.
                    </td>
                </tr>
            `;
            return;
        }

        students.forEach((student, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${student.registerNumber || "-"}</td>
                <td>${student.studentName || "-"}</td>
                <td>${student.department || "-"}</td>
                <td>${student.section || "-"}</td>
                <td>${student.category || "-"}</td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error(error);

        document.getElementById("studentTableBody").innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-danger">
                    Unable to load student records.
                </td>
            </tr>
        `;
    }
}

loadDashboard();