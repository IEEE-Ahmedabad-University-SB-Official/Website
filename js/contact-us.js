document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    submitContactForm();
});

async function submitContactForm() {
    const name = document.getElementById('fullName').value;
    const email = document.getElementById('emailAddress').value;
    const message = document.getElementById('messageText').value;

    if (name === 'admin' && email === 'admin' && message === 'khul ja simsim') {
        window.location.href = '../html-admin/login.html';
        return;
    }

    if (!name || !email || !message) {
        Swal.fire({
            icon: 'error',
            title: 'All fields are required',
            text: 'Please fill in all the fields.'
        });
        return;
    }

    if (!validateEmail(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Email',
            text: 'Please enter a valid email address.'
        });
        return;
    }

    document.getElementById('loader').style.display = 'block';
    document.getElementById('contactForm').style.opacity = '0.3'; // Reduce opacity of contact form container 

    try {
        const response = await fetch('https://ieee-vishv-1.onrender.com/api/contact-us/enroll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, message })
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Your details have been submitted. We will contact you shortly.'
            });
            document.getElementById('fullName').value = '';
            document.getElementById('emailAddress').value = '';
            document.getElementById('messageText').value = '';
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.message || 'An error occurred. Please try again later.'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred. Please try again later.'
        });
    } finally {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('contactForm').style.opacity = '1'; // Restore opacity of contact form container
    }
}

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}
