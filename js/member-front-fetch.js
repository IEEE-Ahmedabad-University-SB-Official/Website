async function fetchMembers(department, position, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = ''; // Clear previous content

    try {
        const response = await fetch(`https://ieee-vishv-1.onrender.com/api/members-front?department=${department}&position=${position}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const members = await response.json();

        const fragment = document.createDocumentFragment();
        members.forEach(member => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card-img">
                    <img src="${member.profile_image}" alt="${member.name}" loading="lazy">
                </div>
                <div class="card-content">
                    <div class="card-box box-1">
                        <h3>${member.name}</h3>
                        <div class="position">${member.position}</div>
                    </div>
                    <div class="card-box2 box-4">
                        <h3>Socials</h3>
                        <div class="social">
                            <a href="${member.instagramProfile}" target="_blank" class="icon" id="instagram">
                                <i class="fab fa-instagram"></i>
                            </a>
                            <a href="${member.linkedinProfile}" target="_blank" class="icon" id="linkedin">
                                <i class="fab fa-linkedin"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            fragment.appendChild(card);
        });
        container.appendChild(fragment);
    } catch (error) {
        console.error(`Error fetching members for ${department} ${position}:`, error);
        // Optionally display an error message in the UI
        container.innerHTML = '<p>Failed to load members. Please try again later.</p>';
    }
}

async function fetchTeams(department, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = ''; // Clear previous content

    try {
        const response = await fetch(`https://ieee-vishv-1.onrender.com/api/members-by-department?department=${department}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const members = await response.json();

        // Custom sorting logic to place "Head" before "Member"
        members.sort((a, b) => {
            if (a.position === "Head") return -1; // "Head" comes before "Member"
            if (b.position === "Head") return 1;  // "Member" comes after "Head"
            return 0; // Leave the order unchanged for other cases
        });

        const fragment = document.createDocumentFragment();
        members.forEach(member => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card-img">
                    <img src="${member.profile_image}" alt="${member.name}" loading="lazy">
                </div>
                <div class="card-content">
                    <div class="card-box box-1">
                        <h3>${member.name}</h3>
                        <div class="position">${member.position}</div>
                    </div>
                    <div class="card-box2 box-4">
                        <h3>Socials</h3>
                        <div class="social">
                            <a href="${member.instagramProfile}" target="_blank" class="icon" id="instagram">
                                <i class="fab fa-instagram"></i>
                            </a>
                            <a href="${member.linkedinProfile}" target="_blank" class="icon" id="linkedin">
                                <i class="fab fa-linkedin"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            fragment.appendChild(card);
        });
        container.appendChild(fragment);
    } catch (error) {
        console.error(`Error fetching teams for ${department}:`, error);
        // Optionally display an error message in the UI
        container.innerHTML = '<p>Failed to load team members. Please try again later.</p>';
    }
}

async function fetchFaculty(department, position, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = ''; // Clear previous content

    try {
        const response = await fetch(`https://ieee-vishv-1.onrender.com/api/members-front?department=${department}&position=${position}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const members = await response.json();

        const fragment = document.createDocumentFragment();
        members.forEach(member => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card-img">
                    <img src="${member.profile_image}" alt="${member.name}" loading="lazy">
                </div>
                <div class="card-content">
                    <div class="card-box box-1">
                        <h3>${member.name}</h3>
                        <div class="position">${member.position}</div>
                    </div>
                    <div class="card-box2 box-4">
                        <div class="faculty-card">
                            <a class="fac-know-more" href="${member.instagramProfile}" >Know more
                            </a>
                            <a href="${member.instagramProfile}">
                            <img src="../Images/browser.png"></img>
                            </a>
                        </div>    
                    </div>
                </div>
            `;
            fragment.appendChild(card);
        });
        container.appendChild(fragment);
    } catch (error) {
        console.error(`Error fetching members for ${department} ${position}:`, error);
        // Optionally display an error message in the UI
        container.innerHTML = '<p>Failed to load members. Please try again later.</p>';
    }
}

async function fetchAllData() {
    try {
        await Promise.all([
            fetchFaculty('OBs', 'Faculty', 'obsFaculty'),
            fetchMembers('OBs', 'Chairperson', 'obsChairperson'),
            fetchMembers('OBs', 'Co - Chairperson', 'obsCoChairperson'),
            fetchMembers('OBs', 'Secretary', 'obsSecretary'),
            fetchMembers('OBs', 'Joint - Secretary', 'obsJointSecretary'),
            fetchMembers('OBs', 'Treasurer', 'obsTreasurer'),
            fetchTeams('CSE', 'cseTeam'),
            fetchTeams('Content', 'contentTeam'),
            fetchTeams('Graphics', 'graphicsTeam'),
            fetchTeams('Logistics', 'logisticsTeam'),
            fetchTeams('RAS', 'rasTeam'),
            fetchTeams('Social media', 'socialmediaTeam'),
            fetchTeams('Technical', 'technicalTeam')
        ]);
    } catch (error) {
        console.error('Error fetching all data:', error);
    }
}

fetchAllData();
