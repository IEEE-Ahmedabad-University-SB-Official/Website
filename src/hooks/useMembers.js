import { useState, useEffect } from 'react';
import axios from 'axios';

const useMembers = () => {
  const [members, setMembers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      // Fetch all members
      const response = await axios.get(`${backendUrl}/api/members`, {
        headers: {
          'x-api-key': apiKey
        }
      });
      
      // Fetch faculty members
      const facultyResponse = await axios.get(`${backendUrl}/api/members-front?department=OBs&position=Faculty`, {
        headers: {
          'x-api-key': apiKey
        }
      });

      const categorizedMembers = categorizeMembers(response.data);
      setMembers({
        ...categorizedMembers,
        faculty: facultyResponse.data
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching members:", error);
      if (error.response?.status === 403) {
        setError("Invalid API key");
      } else if (error.code === 'ERR_NETWORK') {
        setError("Network error - Please check your connection");
      } else {
        setError("Failed to load members");
      }
      setLoading(false);
    }
  };

  const categorizeMembers = (members) => {
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
        }
      }
    });

    // Sort teams to place "Head" before "Member"
    Object.keys(categorized).forEach(key => {
      if (key.endsWith('Team')) {
        categorized[key].sort((a, b) => {
          if (a.position === "Head") return -1;
          if (b.position === "Head") return 1;
          return 0;
        });
      }
    });

    return categorized;
  };

  return { members, loading, error };
};

export default useMembers; 