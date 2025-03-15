import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loaderTimeout = setTimeout(() => {
      document.querySelector(".loader-container").classList.add("hidden");
      const container = document.querySelector(".container");
      container.classList.remove("hidden");
      container.classList.add("animate-fadeIn");
    }, 850);

    return () => clearTimeout(loaderTimeout);
  }, [navigate]);

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-sans overflow-auto relative">
      {/* Background Pattern - Enhanced with multiple layers */}
      <div className="absolute inset-0 grid-pattern-small -z-10" />
      <div className="absolute inset-0 grid-pattern-large -z-10" />

      {/* Loader */}
      <div className="loader-container h-[95vh] flex justify-center items-center">
        <div className="w-12 aspect-square border-2 border-blue-500 animate-spin" />
      </div>

      {/* Content Container - Added padding for mobile */}
      <div className="container hidden w-full max-w-7xl flex flex-col gap-8 pb-8 px-4 md:px-6 lg:px-8">
        {/* Profile Icon */}
        <div
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-lg shadow-lg border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
          onClick={() => navigateTo("/admin/users")}
        >
          <span className="text-2xl">👨🏻‍💻</span>
        </div>

        {/* Heading */}
        <h1 className="mt-8 mb-4 text-5xl md:text-7xl text-center font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] tracking-wider">IEEE AU SB</h1>

        {/* Content Rows - Updated heights and spacing */}
        <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-8">
          <div
            onClick={() => navigateTo("/admin/committee")}
            className="flex-1 p-6 md:p-8 h-[200px] md:h-[140px] rounded-lg bg-[rgba(70,130,180,0.1)] border-l-4 border-[#4682b4] backdrop-blur-lg shadow-lg cursor-pointer hover:-translate-y-1 hover:bg-[rgba(70,130,180,0.2)] transition-all"
          >
            <h2 className="text-xl md:text-2xl font-bold mb-3">Members</h2>
            <p className="text-md md:text-lg text-gray-300">Information about members of IEEE.</p>
          </div>
          
          <div
            onClick={() => navigateTo("/admin/events")}
            className="flex-1 p-6 md:p-8 h-[200px] md:h-[140px] rounded-lg bg-[rgba(255,99,71,0.1)] border-l-4 border-[#ff6347] backdrop-blur-lg shadow-lg cursor-pointer hover:-translate-y-1 hover:bg-[rgba(255,99,71,0.2)] transition-all"
          >
            <h2 className="text-xl md:text-2xl font-bold mb-3">Events</h2>
            <p className="text-md md:text-lg text-gray-300">Upcoming and past events.</p>
          </div>
          
          <div
            onClick={() => navigateTo("/admin/achievements")}
            className="flex-1 p-6 md:p-8 h-[200px] md:h-[140px] rounded-lg bg-[rgba(60,179,113,0.1)] border-l-4 border-[#3cb371] backdrop-blur-lg shadow-lg cursor-pointer hover:-translate-y-1 hover:bg-[rgba(60,179,113,0.2)] transition-all"
          >
            <h2 className="text-xl md:text-2xl font-bold mb-3">Achievements</h2>
            <p className="text-md md:text-lg text-gray-300">Achievements and milestones.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-8">
          <div
            onClick={() => navigateTo("/admin/contact-us")}
            className="flex-1 p-6 md:p-8 h-[200px] md:h-[140px] rounded-lg bg-[rgba(218,112,214,0.1)] border-l-4 border-[#da70d6] backdrop-blur-lg shadow-lg cursor-pointer hover:-translate-y-1 hover:bg-[rgba(218,112,214,0.2)] transition-all"
          >
            <h2 className="text-xl md:text-2xl font-bold mb-3">Contact Us Responses</h2>
            <p className="text-md md:text-lg text-gray-300">View responses from the contact us form.</p>
          </div>
          
          <div
            onClick={() => navigateTo("/admin/get-updates")}
            className="flex-1 p-6 md:p-8 h-[200px] md:h-[140px] rounded-lg bg-[rgba(255,215,0,0.1)] border-l-4 border-[#ffd700] backdrop-blur-lg shadow-lg cursor-pointer hover:-translate-y-1 hover:bg-[rgba(255,215,0,0.2)] transition-all"
          >
            <h2 className="text-xl md:text-2xl font-bold mb-3">Get Update Responses</h2>
            <p className="text-md md:text-lg text-gray-300">Stay updated with the latest responses.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
