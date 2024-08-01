async function fetchAllMembers() {
    try {
        const response = await fetch('https://ieee-vishv-1.onrender.com/api/members');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const members = await response.json();

        // Categorize members based on department and position
        const categorizedMembers = categorizeMembers(members);

        // Render members
        renderMembers(categorizedMembers);
    } catch (error) {
        console.error('Error fetching all members:', error);
    }
}

function categorizeMembers(members) {
    const categorized = {
        obsChairperson: [],
        obsCoChairperson: [],
        obsSecretary: [],
        obsJointSecretary: [],
        obsTreasurer: [],
        cseTeam: [],
        contentTeam: [],
        graphicsTeam: [],
        logisticsTeam: [],
        rasTeam: [],
        socialmediaTeam: [],
        technicalTeam: []
    };

    members.forEach(member => {
        if (member.department === 'OBs') {
            if (member.position === 'Chairperson') categorized.obsChairperson.push(member);
            else if (member.position === 'Co - Chairperson') categorized.obsCoChairperson.push(member);
            else if (member.position === 'Secretary') categorized.obsSecretary.push(member);
            else if (member.position === 'Joint - Secretary') categorized.obsJointSecretary.push(member);
            else if (member.position === 'Treasurer') categorized.obsTreasurer.push(member);
        } else if(member.position !== 'Faculty'){
            const teamKey = `${member.department.toLowerCase()}Team`;
            if (categorized[teamKey]) {
                categorized[teamKey].push(member);
            } else {
                console.warn(`Unexpected department: ${member.department}`);
            }
        }
    });

    // Custom sorting logic to place "Head" before "Member" in teams
    for (let key in categorized) {
        if (key.endsWith('Team')) {
            categorized[key].sort((a, b) => {
                if (a.position === "Head") return -1; // "Head" comes before "Member"
                if (b.position === "Head") return 1;  // "Member" comes after "Head"
                return 0; // Leave the order unchanged for other cases
            });
        }
    }

    return categorized;
}

function renderMembers(categorized) {
    for (let category in categorized) {
        const container = document.getElementById(category);
        if (container) {
            container.innerHTML = ''; // Clear previous content
            const fragment = document.createDocumentFragment();

            categorized[category].forEach(member => {
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
        }
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

// Fetch and render all members data
fetchAllMembers();
fetchFaculty('OBs', 'Faculty', 'obsFaculty');
