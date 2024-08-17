async function submitForm() {
    const nameInput = document.querySelector('#yourNameButton input');
    const emailInput = document.querySelector('#yourEmailButton input');
    const name = nameInput.value;
    const email = emailInput.value;

    if (!validateEmail(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Email',
            text: 'Please enter a valid email address.'
        });
        return;
    }

    const loader = document.querySelector('.GetUpdates #loader');
    const getUpdatesContent = document.querySelector('.GetUpdates .GetUpdatesContent');

    loader.style.display = 'flex';
    getUpdatesContent.style.opacity = '0.3';  // Adjust the opacity for the form

    try {
        const response = await fetch('https://ieee-vishv.onrender.com/api/updates/enroll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email })
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'You will now receive updates from IEEE AU SB via email.'
            });
            nameInput.value = '';  // Clear the name input
            emailInput.value = ''; // Clear the email input
        } else {
            if (result.message === 'Email already exists') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: 'This email ID is already registered. Please try with another email ID.'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred. Please try again later.'
                });
            }
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred. Please try again later.'
        });
    } finally {
        loader.style.display = 'none';
        getUpdatesContent.style.opacity = '1'; // Restore opacity for the form
    }
}

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}
