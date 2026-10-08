document
    .getElementById("studentLoginForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const registerNumber =
            document
                .getElementById("registerNumber")
                .value
                .trim()
                .toUpperCase();

        const password =
            document
                .getElementById("studentPassword")
                .value;

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


            // Find student using register number and password
            const student =
                students.find(student => {

                    const storedRegisterNumber =
                        student.registerNumber
                            ? student.registerNumber
                                .trim()
                                .toUpperCase()
                            : "";

                    return (
                        storedRegisterNumber === registerNumber &&
                        student.password === password
                    );

                });


            // Invalid login
            if (!student) {

                message.className =
                    "alert alert-danger mt-4";

                message.textContent =
                    "Invalid register number or password.";

                message.classList.remove("d-none");

                return;
            }


            // Store logged-in student ID
            sessionStorage.setItem(
                "loggedInStudentId",
                student._id
            );


            // Login successful
            message.className =
                "alert alert-success mt-4";

            message.textContent =
                "Login successful. Redirecting...";

            message.classList.remove("d-none");


            // Redirect to student profile
            setTimeout(function () {

                window.location.href =
                    `/student-profile.html?id=${student._id}`;

            }, 700);

        }


        catch (error) {

            console.error("Student login error:", error);

            message.className =
                "alert alert-danger mt-4";

            message.textContent =
                "Unable to connect to the server.";

            message.classList.remove("d-none");

        }

    });