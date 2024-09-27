// Select the images by their class names
const ieeeImg = document.querySelector('.ieee-footer');
const auImg = document.querySelector('.au-footer');

// Add click event listener for the IEEE image
ieeeImg.addEventListener('click', function() {
    window.location.href = '../index.html'; // Redirect to index.html
});

// Add click event listener for the AU image
auImg.addEventListener('click', function() {
    window.location.href = 'https://ahduni.edu.in/'; // Redirect to google.com
});