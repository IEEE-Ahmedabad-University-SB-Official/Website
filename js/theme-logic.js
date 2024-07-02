document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('#theme-icon');
    const themeDiv = document.querySelector('.theme-div');
    
    // Function to toggle dark theme
    const toggleDarkTheme = () => {
        document.body.classList.toggle('darkTheme');
        // Update button text based on the current theme
        if (document.body.classList.contains('darkTheme')) {
            themeToggleButton.textContent = 'light';
            themeIcon.src = "/Images/sun-icon.svg"
            localStorage.setItem('theme', 'dark'); // Save theme preference
            for (const element of document.getElementsByClassName('imageBackGround')) {
                element.style.display = 'unset';
            };
        } else {
            themeToggleButton.textContent = 'dark';
            themeIcon.src = "/Images/moon-icon.svg"
            localStorage.setItem('theme', 'light'); // Save theme preference
            for (const element of document.getElementsByClassName('imageBackGround')) {
                element.style.display = 'none';
            };
        }
    };
    // Apply the saved theme preference on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('darkTheme');
        themeToggleButton.textContent = 'light';
        themeIcon.src = "/Images/sun-icon.svg";
        for (const element of document.getElementsByClassName('imageBackGround')) {
            element.style.display = 'unset';
        };
        
    } else {
        themeToggleButton.textContent = 'dark';
        themeIcon.src = "/Images/moon-icon.svg"
        for (const element of document.getElementsByClassName('imageBackGround')) {
            element.style.display = 'none';
        };
    }

    // Event listener for the theme toggle button
    themeDiv.addEventListener('click', toggleDarkTheme);
});