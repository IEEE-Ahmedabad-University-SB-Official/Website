import React, { useState } from 'react';
import DesktopNavbar from '../../components/common/DesktopNavbar';
import MobileNavbar from '../../components/common/MobileNavbar';
import Footer from '../../components/common/Footer';
import useMembers from '../../hooks/useMembers';
import { motion } from 'framer-motion';
import { FaInstagram, FaLinkedin, FaFileAlt } from 'react-icons/fa';

// Skeleton loader for member card
const MemberCardSkeleton = () => (
  <div className="relative w-full">
    {/* Mobile/Tablet Layout Skeleton */}
    <div className="flex md:hidden items-center w-full bg-white rounded-lg shadow-sm p-3 gap-4">
      <div className="w-[90px] h-[120px] bg-gray-200 rounded-lg animate-pulse" />
      <div className="flex flex-col flex-1 min-w-0 space-y-2">
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
        <div className="flex gap-3">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>

    {/* Desktop Layout Skeleton - Hidden on Mobile */}
    <div className="hidden md:block relative w-[225px] h-[300px]">
      <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
      </div>
    </div>
  </div>
);

// Skeleton loader for section
const SectionSkeleton = () => (
  <section className="py-8">
    <div className="flex flex-col items-center">
      <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 w-full md:w-auto">
        {[1, 2, 3, 4].map(i => (
          <MemberCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </section>
);

const MemberCard = ({ member }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="relative md:w-[225px] md:h-[300px] w-full cursor-pointer overflow-hidden group"
  >
    {/* Mobile/Tablet Layout */}
    <div className="flex md:hidden items-center w-full bg-white rounded-lg shadow-sm p-3 gap-4">
      <img 
        src={member.profile_image} 
        alt={member.name} 
        className="w-[90px] object-cover rounded-lg"gap-8
        loading="lazy"
      />
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="font-bold text-left text-xl text-gray-900 truncate">{member.name}</h3>
        <p className="text-sm text-left text-gray-600 mb-2">{member.position}</p>
        <div className="flex gap-3">
          {member.instagramProfile && member.position !== "Faculty" && (
            <a 
              href={member.instagramProfile} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-[#E4405F] transition-colors"
            >
              <FaInstagram size={20} />
            </a>
          )}
          {member.linkedinProfile && member.position !== "Faculty" && (
            <a 
              href={member.linkedinProfile} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-[#0a66c2] transition-colors"
            >
              <FaLinkedin size={20} />
            </a>
          )}
          {member.position === "Faculty" && member.linkedinProfile && (
            <a 
              href={member.linkedinProfile} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-green-400 transition-colors"
            >
              <FaFileAlt size={20} />
            </a>
          )}
        </div>
      </div>
    </div>

    {/* Desktop Layout - Hidden on Mobile */}
    <div className="hidden md:block">
      <div className="absolute inset-0 transition-all duration-600 ease-bezier group-hover:scale-85 group-hover:brightness-45">
        <img 
          src={member.profile_image} 
          alt={member.name} 
          className="w-[250px] h-[300px] object-contain"
          loading="lazy"
        />
      </div>
      
      {/* Grid container for hover boxes */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        {/* Top-left info box */}
        <div className="col-start-1 row-start-1 p-2 bg-black/45 backdrop-blur-md transition-all duration-500 opacity-0 flex flex-col justify-center items-center text-white transform -translate-x-full -translate-y-full group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0">
          <h3 className="text-center font-bold">{member.name}</h3>
          <div className="pt-3 text-center">{member.position}</div>
        </div>
        
        {/* Bottom-right socials box */}
        <div className="col-start-2 row-start-2 p-2 bg-black/45 backdrop-blur-md transition-all duration-500 opacity-0 flex flex-col items-center justify-center text-white transform translate-x-full translate-y-full group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0">
          <h3 className="font-bold mb-2">Socials</h3>
          <div className="flex justify-center gap-4">
            {member.instagramProfile && member.position !== "Faculty" && (
              <a 
                href={member.instagramProfile} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-[#E4405F] transition-colors"
              >
                <FaInstagram size={24} />
              </a>
            )}
            {member.linkedinProfile && member.position !== "Faculty" && (
              <a 
                href={member.linkedinProfile} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-[#0a66c2] transition-colors"
              >
                <FaLinkedin size={24} />
              </a>
            )}
            {member.position === "Faculty" && member.linkedinProfile && (
              <a 
                href={member.linkedinProfile} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-green-400 transition-colors"
              >
                <FaFileAlt size={24} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const CommitteePage = () => {
  const { members, loading, error } = useMembers();
  const [selectedYear, setSelectedYear] = useState("2024");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <DesktopNavbar />
        <MobileNavbar />
        <div className="container mx-auto px-4 py-12 pt-8 md:pt-32">
          <div className="h-12 w-96 bg-gray-200 rounded mb-16 mx-auto animate-pulse"></div>
          <div className="flex justify-center gap-4 mb-8">
            {[1, 2].map(i => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="flex flex-col items-center">
            <SectionSkeleton />
            <SectionSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  // Filter members by selected year
  const filterMembersByYear = (membersList) => {
    if (!membersList) return [];
    return membersList.filter(member => {
      const joinYear = member.join_year.toString();
      return joinYear === selectedYear;
    });
  };

  // Get filtered members
  const filteredFaculty = filterMembersByYear(members.faculty);
  const filteredOfficeBearers = [
    ...filterMembersByYear(members.obsChairperson),
    ...filterMembersByYear(members.obsCoChairperson),
    ...filterMembersByYear(members.obsSecretary),
    ...filterMembersByYear(members.obsJointSecretary),
    ...filterMembersByYear(members.obsTreasurer)
  ];

  const teams = [
    { id: 'computersociety', title: 'Computer Society', data: filterMembersByYear(members.cseTeam) },
    { id: 'content', title: 'Content Team', data: filterMembersByYear(members.contentTeam) },
    { id: 'graphics', title: 'Graphics Team', data: filterMembersByYear(members.graphicsTeam) },
    { id: 'logistics', title: 'Logistics Team', data: filterMembersByYear(members.logisticsTeam) },
    { id: 'roboticsandautomationsociety', title: 'Robotics and Automation Society', data: filterMembersByYear(members.rasTeam) },
    { id: 'socialmedia', title: 'Social Media Team', data: filterMembersByYear(members.socialmediaTeam) },
    { id: 'technical', title: 'Technical Team', data: filterMembersByYear(members.technicalTeam) },
  ].filter(team => team.data?.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <DesktopNavbar />
      <MobileNavbar />

      <div className="container mx-auto px-4 py-16 pt-8 md:pt-32">
        <h1 className="text-4xl md:text-5xl text-center font-extrabold text-gray-900 mb-8 uppercase"
            style={{
              textShadow: `
                5px 5px rgba(128, 128, 128, 0.4),
                10px 10px rgba(128, 128, 128, 0.2)
              `
            }}>
          IEEE Committee Members
        </h1>

        {/* Year Selection */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-4 mb-8 md:mb-12 flex-wrap px-4"
        >
          {[2024, 2023].map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year.toString())}
              className={`px-4 py-2 rounded-lg transition-all transform hover:scale-105 active:scale-95 ${
                selectedYear === year.toString()
                ? 'bg-[#0088cc] text-white shadow-lg'
                : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {year}
            </button>
          ))}
        </motion.div>

        <div className="relative">
          {/* Content */}
          <div className="space-y-8">
            {/* Faculty Section */}
            {filteredFaculty?.length > 0 && (
              <motion.section 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <div className="">
                  <h2 className="text-2xl font-bold mb-8 text-gray-900 text-center">Faculty</h2>
                  <div className="flex flex-wrap justify-center gap-6 md:gap-6">
                    {filteredFaculty.map(member => (
                      <MemberCard key={`faculty-${member._id}`} member={member} />
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* Office Bearers Section */}
            {filteredOfficeBearers.length > 0 && (
              <motion.section 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
                id="officebearers"
              >
                <div className="">
                  <h2 className="text-2xl font-bold mb-8 text-gray-900 text-center">Office Bearers</h2>
                  <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                    {filteredOfficeBearers.map(member => (
                      <MemberCard key={`obs-${member._id}-${member.role}`} member={member} />
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* Teams Sections */}
            {teams.map(team => (
              <motion.section 
                key={team.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
                id={team.id}
              >
                <div className="text-center max-w-6xl mx-auto">
                  <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">{team.title}</h2>
                  <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                    {team.data.map(member => (
                      <MemberCard key={`${team.id}-${member._id}`} member={member} />
                    ))}
                  </div>
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CommitteePage;