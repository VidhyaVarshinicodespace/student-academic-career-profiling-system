// Get the student category dropdown
const category = document.getElementById("category");

// Get the hostel field
const hostelField = document.getElementById("hostelField");

// Get the distance field
const distanceField = document.getElementById("distanceField");

// Get the input fields
const hostelName = document.getElementById("hostelName");
const distanceToCollege = document.getElementById("distanceToCollege");


// Function to show the correct field
function updateCategoryFields() {

    // Hide both fields first
    hostelField.classList.add("d-none");
    distanceField.classList.add("d-none");

    // Remove required validation
    hostelName.required = false;
    distanceToCollege.required = false;


    // If Hosteller is selected
    if (category.value === "Hosteller") {

        hostelField.classList.remove("d-none");

        hostelName.required = true;
    }


    // If Day Scholar is selected
    else if (category.value === "Day Scholar") {

        distanceField.classList.remove("d-none");

        distanceToCollege.required = true;
    }
}


// Run whenever the category changes
category.addEventListener("change", updateCategoryFields);