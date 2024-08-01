document.addEventListener("DOMContentLoaded", function () {
    const achievementsContainer = document.querySelector('.container');

    function fetchAchievements() {
        axios.get('https://ieee-vishv-1.onrender.com/api/achievements')
            .then(response => {
                renderAchievements(response.data);
            })
            .catch(error => console.error('Error fetching achievements:', error));
    }

    function renderAchievements(data) {
        achievementsContainer.innerHTML = '<h1 style="text-align: center;">Achievements</h1>';

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

    fetchAchievements();
});
