async function fetchMembers(department, position, elementId) {
    try {
        const response = await fetch(`https://ieee-vishv-1.onrender.com/api/members-front?department=${department}&position=${position}`);
        const Members = await response.json();
        const container = document.getElementById(elementId);
        
        // Custom sorting logic to place "Head" before "Member"
        Members.sort((a, b) => {
            if (a.position === "Head") return -1; // "Head" comes before "Member"
            if (b.position === "Head") return 1;  // "Member" comes after "Head"
            return 0; // Leave the order unchanged for other cases
        });

        Members.forEach(Member => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card-img">
                    <img src="${Member.profile_image}" alt="${Member.name}">
                </div>
                <div class="card-content">
                    <div class="card-box box-1">
                        <h3>${Member.name}</h3>
                        <div class="position">${Member.position}</div>
                    </div>
                    <div class="card-box2 box-4">
                        <h3>Socials</h3>
                        <div class="social">
                            <a href="${Member.instagramProfile}" target="_blank" class="icon" id="instagram">
                                <i class="fab fa-instagram"></i>
                            </a>
                            <a href="${Member.linkedinProfile}" target="_blank" class="icon" id="linkedin">
                                <i class="fab fa-linkedin"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching Members:', error);
    }
}

// Fetch faculty Members
fetchMembers('OBs', 'Faculty', 'obsFaculty');

// Fetch OBs Members
fetchMembers('OBs', 'Chairperson', 'obsChairperson');
fetchMembers('OBs', 'Co - Chairperson', 'obsCoChairperson');
fetchMembers('OBs', 'Secretary', 'obsSecretary');
fetchMembers('OBs', 'Joint - Secretary', 'obsJointSecretary');
fetchMembers('OBs', 'Treasurer', 'obsTreasurer');

// Fetch CSE team Members
fetchMembers('CSE', 'Head', 'cseTeam');
fetchMembers('CSE', 'Member', 'cseTeam');

// Fetch Content team Members
fetchMembers('Content', 'Head', 'contentTeam');
fetchMembers('Content', 'Member', 'contentTeam');

// Fetch Graphics team Members
fetchMembers('Graphics', 'Head', 'graphicsTeam');
fetchMembers('Graphics', 'Member', 'graphicsTeam');

// Fetch Logistics team Members
fetchMembers('Logistics', 'Head', 'logisticsTeam');
fetchMembers('Logistics', 'Member', 'logisticsTeam');

// Fetch RAS team Members
fetchMembers('RAS', 'Head', 'rasTeam');
fetchMembers('RAS', 'Member', 'rasTeam');

// Fetch Social Media team Members
fetchMembers('Social media', 'Head', 'socialmediaTeam');
fetchMembers('Social media', 'Member', 'socialmediaTeam');

// Fetch Technical team Members
fetchMembers('Technical', 'Head', 'technicalTeam');
fetchMembers('Technical', 'Member', 'technicalTeam');