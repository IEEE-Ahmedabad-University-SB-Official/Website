import { useState, useEffect } from 'react';
// import axios from 'axios';
import { committeeData } from '../assets/committeeData.js';

const useMembers = () => {
  const [members, setMembers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const backendUrl = import.meta.env.VITE_BACKEND_URL;
  // const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    // fetchMembers();
    const processedMembers = committeeData.map(member => ({
      name: member['Full Name'],
      position: member.Position,
      profile_image: member['One Professional Photo'],
      linkedinProfile: member['Linkedin Profile'],
      join_year: member.join_year,
      team: member.Team,
      _id: member['Enrollment number '] + member['Full Name'], // create a unique id
    }));
    const categorizedMembers = categorizeMembers(processedMembers);
    setMembers(categorizedMembers);
    setLoading(false);
  }, []);

  // const fetchMembers = async () => {
  //   try {
  //     // Fetch all members
  //     const response = await axios.get(`${backendUrl}/api/members`, {
  //       headers: {
  //         'x-api-key': apiKey
  //       }
  //     });
      
  //     // Fetch faculty members
  //     const facultyResponse = await axios.get(`${backendUrl}/api/members-front?department=OBs&position=Faculty`, {
  //       headers: {
  //         'x-api-key': apiKey
  //       }
  //     });

  //     const categorizedMembers = categorizeMembers(response.data);
  //     setMembers({
  //       ...categorizedMembers,
  //       faculty: facultyResponse.data
  //     });
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching members:", error);
  //     if (error.response?.status === 403) {
  //       setError("Invalid API key");
  //     } else if (error.code === 'ERR_NETWORK') {
  //       setError("Network error - Please check your connection");
  //     } else {
  //       setError("Failed to load members");
  //     }
  //     setLoading(false);
  //   }
  // };

  const categorizeMembers = (members) => {
    const categorized = {
      obsChairperson: [],
      obsCoChairperson: [],
      obsSecretary: [],
      obsJointSecretary: [],
      obsTreasurer: [],
      cseTeam: [],
      graphicsTeam: [],
      rasTeam: [],
      logisticsandtechnicalTeam: [],
      socialmediaandcontentTeam: [],
      eeeTeam: [],
      wieTeam: [],
      faculty: []
    };

    members.forEach(member => {
        if (member.position === 'OBs') {
            categorized.obsChairperson.push(member); // Simplified
        } else if (member.position === 'Faculty') {
            categorized.faculty.push(member);
        } else {
            let teamKey;
            switch(member.team) {
                case 'CS Team':
                    teamKey = 'cseTeam';
                    break;
                case 'Graphics Team':
                    teamKey = 'graphicsTeam';
                    break;
                case 'RAS Team':
                    teamKey = 'rasTeam';
                    break;
                case 'Logistic and technical Team':
                    teamKey = 'logisticsandtechnicalTeam';
                    break;
                case 'Social Media and Content':
                    teamKey = 'socialmediaandcontentTeam';
                    break;
                case 'EEE Team':
                    teamKey = 'eeeTeam';
                    break;
                case 'WIE':
                    teamKey = 'wieTeam';
                    break;
                default:
                    teamKey = null;
            }

            if(teamKey && categorized[teamKey]) {
                categorized[teamKey].push(member);
            }
        }
    });

    // Sort teams to place "Head" or "Department Head" before "Member"
    Object.keys(categorized).forEach(key => {
      if (key.endsWith('Team')) {
        categorized[key].sort((a, b) => {
          if (a.position === "Department Head" || a.position === "Head") return -1;
          if (b.position === "Department Head" || b.position === "Head") return 1;
          return 0;
        });
      }
    });

    return categorized;
  };

  return { members, loading, error };
};

export default useMembers; 