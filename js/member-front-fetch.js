async function fetchMembers(department, position, elementId) {
    try {
        const response = await fetch(`http://localhost:3000/members-front?department=${department}&position=${position}`);
        const members = await response.json();
        const container = document.getElementById(elementId);
        
        members.forEach(member => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card-img">
                    <img src="/uploads/members/${member.profile_image}" alt="${member.name}">
                </div>
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
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching members:', error);
    }
}

// Fetch faculty members
fetchMembers('obs', 'Faculty', 'obsFaculty');

// Fetch OBs members
fetchMembers('obs', 'Chairperson', 'obsChairperson');
fetchMembers('obs', 'Co - Chairperson', 'obsCoChairperson');
fetchMembers('obs', 'Secretary', 'obsSecretary');
fetchMembers('obs', 'Joint - Secretary', 'obsJointSecretary');
fetchMembers('obs', 'Treasurer', 'obsTreasurer');

// Fetch CSE team members
fetchMembers('cse', 'head', 'cseTeam');
fetchMembers('cse', 'member', 'cseTeam');

// Fetch Content team members
fetchMembers('content', 'head', 'contentTeam');
fetchMembers('content', 'member', 'contentTeam');

// Fetch Graphics team members
fetchMembers('graphics', 'head', 'graphicsTeam');
fetchMembers('graphics', 'member', 'graphicsTeam');

// Fetch Logistics team members
fetchMembers('logistics', 'head', 'logisticsTeam');
fetchMembers('logistics', 'member', 'logisticsTeam');

// Fetch RAS team members
fetchMembers('ras', 'head', 'rasTeam');
fetchMembers('ras', 'member', 'rasTeam');

// Fetch Social Media team members
fetchMembers('social media', 'head', 'socialmediaTeam');
fetchMembers('social media', 'member', 'socialmediaTeam');

// Fetch Technical team members
fetchMembers('technical', 'head', 'technicalTeam');
fetchMembers('technical', 'member', 'technicalTeam');