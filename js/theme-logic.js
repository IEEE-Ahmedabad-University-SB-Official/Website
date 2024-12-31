// document.addEventListener('DOMContentLoaded', () => {
//     const themeToggleButton = document.getElementById('theme-toggle');
//     const themeIcon = document.querySelector('#theme-icon');
//     const themeDiv = document.querySelector('.theme-div');
    
//     // Function to toggle dark theme
//     const toggleDarkTheme = () => {
//         document.body.classList.toggle('darkTheme');
//         // Update button text based on the current theme
//         if (document.body.classList.contains('darkTheme')) {
//             themeToggleButton.textContent = 'light';
//             themeIcon.src = "/Images/sun-icon.svg"
//             localStorage.setItem('theme', 'dark'); // Save theme preference
//             for (const element of document.getElementsByClassName('imageBackGround')) {
//                 element.style.display = 'unset';
//             };
//         } else {
//             themeToggleButton.textContent = 'dark';
//             themeIcon.src = "/Images/moon-icon.svg"
//             localStorage.setItem('theme', 'light'); // Save theme preference
//             for (const element of document.getElementsByClassName('imageBackGround')) {
//                 element.style.display = 'none';
//             };
//         }
//     };
//     // Apply the saved theme preference on page load
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//         document.body.classList.add('darkTheme');
//         themeToggleButton.textContent = 'light';
//         themeIcon.src = "/Images/sun-icon.svg";
//         for (const element of document.getElementsByClassName('imageBackGround')) {
//             element.style.display = 'unset';
//         };
        
//     } else {
//         themeToggleButton.textContent = 'dark';
//         themeIcon.src = "/Images/moon-icon.svg"
//         for (const element of document.getElementsByClassName('imageBackGround')) {
//             element.style.display = 'none';
//         };
//     }

//     // Event listener for the theme toggle button
//     themeDiv.addEventListener('click', toggleDarkTheme);
// });

document.addEventListener('DOMContentLoaded', () => {
    const themeButton = document.getElementById('theme-button');
    const themeDropdown = document.getElementById('theme-dropdown');
    const darkThemeBtn = document.getElementById('dark-theme');
    const lightThemeBtn = document.getElementById('light-theme');
    const tickDark = document.getElementById('tick-dark');
    const tickLight = document.getElementById('tick-light');

    // Function to toggle the theme
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('darkTheme');
            document.body.classList.remove('lightTheme');
            tickDark.classList.add('show');
            tickLight.classList.remove('show');
            localStorage.setItem('ieee-website-theme', 'dark');
            for (const element of document.getElementsByClassName('aboutSection')) {
                element.style.backgroundImage = "url('./Images/pattern.png')";
                element.style.backgroundSize = "contain";
                element.style.backgroundRepeat = "no-repeat";
                element.style.backgroundPosition = "center";       
            }
        } else {
            document.body.classList.add('lightTheme');
            document.body.classList.remove('darkTheme');
            tickDark.classList.remove('show');
            tickLight.classList.add('show');
            localStorage.setItem('ieee-website-theme', 'light');
            for (const element of document.getElementsByClassName('aboutSection')) {
                element.style.backgroundImage = 'none';
            }
        }
    };

    // Apply the saved theme preference on page load
    const savedTheme = localStorage.getItem('ieee-website-theme') || 'light';
    applyTheme(savedTheme);

    // Toggle dropdown visibility on button click
    themeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        themeDropdown.style.display = themeDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Close the dropdown when clicking outside of it
    window.addEventListener('click', () => {
        if (themeDropdown.style.display === 'block') {
            themeDropdown.style.display = 'none';
        }
    });

    // Prevent dropdown from closing when clicking inside
    themeDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Event listeners for theme buttons
    darkThemeBtn.addEventListener('click', () => {
        applyTheme('dark');
    });

    lightThemeBtn.addEventListener('click', () => {
        applyTheme('light');
    });
});
