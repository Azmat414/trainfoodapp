document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    var firstName = document.getElementById('first_name').value;
    var lastName = document.getElementById('last_name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm_password').value;
    
    var validationMessages = document.getElementById('validationMessages');
    validationMessages.innerHTML = ''; // Clear previous validation messages
    
    // Validation checks
    if (!firstName.trim()) {
        validationMessages.innerHTML += '<div class="alert alert-danger" role="alert">First name is required</div>';
        return;
    }
    
    if (!lastName.trim()) {
        validationMessages.innerHTML += '<div class="alert alert-danger" role="alert">Last name is required</div>';
        return;
    }
    
    if (!email.trim()) {
        validationMessages.innerHTML += '<div class="alert alert-danger" role="alert">Email is required</div>';
        return;
    }

    // Check if email is valid format
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        validationMessages.innerHTML += '<div class="alert alert-danger" role="alert">Invalid email format</div>';
        return;
    }

    if (!password.trim()) {
        validationMessages.innerHTML += '<div class="alert alert-danger" role="alert">Password is required</div>';
        return;
    }

    if (password.length < 8) {
        validationMessages.innerHTML += '<div class="alert alert-danger" role="alert">Password must be at least 8 characters long</div>';
        return;
    }

    if (password !== confirmPassword) {
        validationMessages.innerHTML += '<div class="alert alert-danger" role="alert">Passwords do not match</div>';
        return;
    }

    // If all validation passes, submit the form
    this.submit();
});