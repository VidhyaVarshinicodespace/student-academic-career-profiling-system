document
    .getElementById("facultyLoginForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const facultyId =
            document.getElementById("facultyId").value.trim();

        const password =
            document.getElementById("facultyPassword").value;

        const message =
            document.getElementById("loginMessage");


        /*
         * Temporary project login
         *
         * We will move authentication to the backend
         * later. For now this is only to build and test
         * the Faculty Dashboard flow.
         */

        if (facultyId === "faculty01" && password === "faculty123") {

            message.className =
                "alert alert-success mt-4";

            message.textContent =
                "Faculty login successful. Redirecting...";

            message.classList.remove("d-none");


            setTimeout(function () {

                window.location.href =
                    "/faculty-dashboard.html";

            }, 800);

        }

        else {

            message.className =
                "alert alert-danger mt-4";

            message.textContent =
                "Invalid Faculty ID or Password.";

            message.classList.remove("d-none");

        }

    });