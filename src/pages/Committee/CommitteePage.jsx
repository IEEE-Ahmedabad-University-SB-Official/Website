import React, { useEffect, useRef } from 'react'
import DesktopNavbar from '../../components/common/DesktopNavbar'
import MobileNavbar from '../../components/common/MobileNavbar'
import Footer from '../../components/common/Footer'
import './CommitteePage.css';

const CommitteePage = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const facultyFetched = useRef(false); // Flag to track if faculty has been fetched

  useEffect(() => {
    // Fetch and render all members data asynchronously
    fetchAllMembers();

    // Fetch and render faculty data asynchronously only once
    if (!facultyFetched.current) {
      fetchFaculty('OBs', 'Faculty', 'obsFaculty');
      facultyFetched.current = true; // Set the flag to true after fetching
    }
  }, []);

  async function fetchAllMembers() {
    try {
      const response = await fetch(`${backendUrl}/api/members`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const members = await response.json();
      const categorizedMembers = categorizeMembers(members);
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
        } else if (member.position !== 'Faculty') {
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
      const response = await fetch(`${backendUrl}/api/members-front?department=${department}&position=${position}`);
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
      container.innerHTML = '<p>Failed to load members. Please try again later.</p>';
  }
}

  return (
    <div className=''>
      <DesktopNavbar />
      <MobileNavbar />

      <div className='full-page'>
      <div className="heading">
        <h1>IEEE committee Members</h1>
      </div>

      <hr className="nav-line1" />

      <div className="navbar">
        <a href="#obs">Office Bearers</a>
        <a href="#cse">Computer Society</a>
        <a href="#content">Content</a>
        <a href="#graphics">Graphics</a>
        <a href="#logistics">Logistics</a>
        <a href="#ras">Robotics and Automation Society</a>
        <a href="#socialmedia">Social Media</a>
        <a href="#technical">Technical</a>
      </div>
      <hr className="nav-line2" />

      <div className="page-container">
        {/* <div className="option"> */}
          <div id="ieeeSection" className="ieee">
            <hr className="nav-line4" />

            {/* OBs Section */}
            <div className="obs" id="obs">
              <h1>Faculty</h1>
              <div className="faculty">
                <div id="obsFaculty"></div>
              </div>
            </div>

            <hr className="nav-line4" />

            <div className="obs" id="obs">
              <h1>Office Bearers</h1>
              <div className="obscard">
                <div className="frow">
                  <div id="obsChairperson"></div>
                  <div id="obsCoChairperson"></div>
                </div>
                <div className="srow">
                  <div id="obsSecretary"></div>
                  <div id="obsJointSecretary"></div>
                  <div id="obsTreasurer"></div>
                </div>
              </div>
            </div>

            <hr className="nav-line4" />

            {/* CSE Team */}
            <div id="cse" className="team">
              <h1>Computer Society</h1>
              <div className="team-data" id="cseTeam"></div>
            </div>

            <hr className="nav-line4" />

            {/* Content Team */}
            <div id="content" className="team">
              <h1>Content Team</h1>
              <div className="team-data" id="contentTeam"></div>
            </div>

            <hr className="nav-line4" />

            {/* Graphics Team */}
            <div id="graphics" className="team">
              <h1>Graphics Team</h1>
              <div className="team-data" id="graphicsTeam"></div>
            </div>

            <hr className="nav-line4" />

            {/* Logistics Team */}
            <div id="logistics" className="team">
              <h1>Logistics Team</h1>
              <div className="team-data" id="logisticsTeam"></div>
            </div>

            <hr className="nav-line4" />

            {/* RAS Team */}
            <div id="ras" className="team">
              <h1>Robotics and Automation Society</h1>
              <div className="team-data" id="rasTeam"></div>
            </div>

            <hr className="nav-line4" />

            {/* Social Media Team */}
            <div id="socialmedia" className="team">
              <h1>Social Media Team</h1>
              <div className="team-data" id="socialmediaTeam"></div>
            </div>

            <hr className="nav-line4" />

            {/* Technical Team */}
            <div id="technical" className="team">
              <h1>Technical Team</h1>
              <div className="team-data" id="technicalTeam"></div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CommitteePage