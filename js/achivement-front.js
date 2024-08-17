document.addEventListener("DOMContentLoaded", function () {
    const achievementsContainer = document.querySelector('.container');

    function fetchAchievements() {
        axios.get('https://ieee-vishv.onrender.com/api/achievements')
            .then(response => {
                if (response.data.length === 0) {
                    displayNoAchievements();
                } else {
                    renderAchievements(response.data);
                }
            })
            .catch(error => {
                displayErrorMessage('Error in database connection');
                console.error('Error fetching achievements:', error);
            });
    }

    function renderAchievements(data) {

        data.forEach(achievement => {
            const achievementDiv = document.createElement('div');
            const hrLine = document.createElement('hr');
            achievementDiv.className = 'achievement-div';

            achievementDiv.innerHTML = `
                <div class="achi-img">
                    <img src="${achievement.achievementImage}" alt="${achievement.achievementName}">
                </div>
                <div class="achi-text">
                    <p class="head">${achievement.achievementName}</p>
                    <p class="paragraph">${achievement.achievementDescription}</p>
                </div>
            `;

            achievementsContainer.appendChild(achievementDiv);
            achievementsContainer.appendChild(hrLine);
        });
    }

    function displayErrorMessage(message) {
        achievementsContainer.innerHTML = `<div class="error-message">${message}</div>`;
    }

    function displayNoAchievements() {
        achievementsContainer.innerHTML = '<div class="no-achievements">No achievements found</div>';
    }

    fetchAchievements();
});
