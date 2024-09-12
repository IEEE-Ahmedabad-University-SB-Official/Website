// Select the images by their class names
const ieeeImg = document.querySelector('.ieee-footer');
const auImg = document.querySelector('.au-footer');

// Add click event listener for the IEEE image
ieeeImg.addEventListener('click', function() {
    window.open('../index.html', '_blank'); // Open index.html in a new tab
});

// Add click event listener for the AU image
auImg.addEventListener('click', function() {
    window.open('https://ahduni.edu.in/', '_blank'); // Open the AU website in a new tab
});
