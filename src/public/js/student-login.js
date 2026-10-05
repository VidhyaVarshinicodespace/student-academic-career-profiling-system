document
    .getElementById("studentLoginForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const email =
            document
                .getElementById("studentEmail")
                .value
                .trim()
                .toLowerCase();

        const password =
            document.getElementById("studentPassword").value;

        const message =
            document.getElementById("loginMessage");


        try {

            const response =
                await fetch("/api/students");

            if (!response.ok) {
                throw new Error("Unable to fetch student records");
            }

            const students =
                await response.json();


            const student =
                students.find(student =>
                    student.institutionalEmail &&
                    student.institutionalEmail.toLowerCase() === email &&
                    student.password === password
                );


            if (!student) {

                message.className =
                    "alert alert-danger mt-4";

                message.textContent =
                    "Invalid email ID or password.";

                message.classList.remove("d-none");

                return;
            }


            // Store only the student ID for the next page
            sessionStorage.setItem(
                "loggedInStudentId",
                student._id
            );


            message.className =
                "alert alert-success mt-4";

            message.textContent =
                "Login successful. Redirecting...";

            message.classList.remove("d-none");


            setTimeout(function () {

                window.location.href =
                    `/student-profile.html?id=${student._id}`;

            }, 700);


        } catch (error) {

            console.error(error);

            message.className =
                "alert alert-danger mt-4";

            message.textContent =
                "Unable to connect to the server.";

            message.classList.remove("d-none");

        }

    });