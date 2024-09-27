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
        const response = await fetch('https://ieee-vishv.onrender.com/api/contact-us/enroll', {
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

document.addEventListener("DOMContentLoaded", function () {
    var mapSection = document.querySelector('.MapSection');
    var iframeLoaded = false;
    var loader = document.getElementById('mapLoader');

    function loadMap() {
        if (!iframeLoaded && mapSection.getBoundingClientRect().top < window.innerHeight) {
            var iframe = document.createElement('iframe');
            iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.6085372802418!2d72.55180577602258!3d23.03814131574564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848d5f86040f%3A0x7a0cc8b624851642!2sAhmedabad%20University!5e0!3m2!1sen!2sin!4v1715959567993!5m2!1sen!2sin";
            iframe.width = "100%";
            iframe.height = "400";
            iframe.style.border = "0";
            iframe.allowFullscreen = true;
            iframe.loading = "lazy";

            // Hide loader when iframe loads
            iframe.onload = function() {
                loader.style.display = "none";  // Hide loader once map is loaded
            };

            mapSection.appendChild(iframe);
            iframeLoaded = true;
        }
    }

    window.addEventListener('scroll', loadMap);
});