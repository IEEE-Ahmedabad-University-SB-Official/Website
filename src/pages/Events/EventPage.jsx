// src/pages/Home/HomePage.js
import React, { useState } from 'react';
import DesktopNavbar from '../../components/common/DesktopNavbar'
import MobileNavbar from '../../components/common/MobileNavbar'
import Footer from '../../components/common/Footer';
import { motion } from 'framer-motion';
import useEvents from '../../hooks/useEvents';
import { FaMicrophone, FaClock, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

// Skeleton loader for event card
const EventCardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl shadow-lg overflow-hidden"
  >
    <div className="flex flex-col md:flex-row">
      {/* Image Section Skeleton */}
      <div className="md:w-1/3 relative pt-4 md:pt-0">
        <div className="w-[70%] h-[200px] mx-auto my-4 bg-gray-200 animate-pulse" />
      </div>

      {/* Content Section Skeleton */}
      <div className="md:w-2/3 p-4 md:p-8">
        {/* Date Badge Skeleton */}
        <div className="mb-4">
          <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Title Skeleton */}
        <div className="w-3/4 h-8 bg-gray-200 rounded mb-4 animate-pulse" />

        {/* Description Skeleton */}
        <div className="space-y-2 mb-6">
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-4/6 h-4 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Info Items Skeleton */}
        <div className="space-y-4 mb-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Button Skeleton */}
        <div className="w-40 h-12 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  </motion.div>
);

// Year Section Skeleton
const YearSectionSkeleton = () => (
  <div className="mb-16">
    <div className="sticky top-24 left-0 w-24 h-16 rounded-lg bg-gray-200 animate-pulse" />
    <div className="ml-[180px] space-y-8">
      {[1, 2, 3].map((item) => (
        <EventCardSkeleton key={item} />
      ))}
    </div>
  </div>
);

function EventPage() {
  const { events, loading, error } = useEvents();
  const [currentDateTime] = useState(new Date());

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <DesktopNavbar />
        <MobileNavbar />
        
        <div className="container mx-auto px-4 py-16 pt-32">
          {/* Title Skeleton */}
          <div className="w-72 h-12 bg-gray-200 rounded mb-16 mx-auto animate-pulse" />
          
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[140px] top-0 bottom-0 w-1 bg-[#0088cc]"></div>
            
            {/* Render multiple year sections */}
            {[1, 2].map((year) => (
              <YearSectionSkeleton key={year} />
            ))}
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  // Combine and group all events by year
  const allEvents = [...(events.upcoming || []), ...(events.past || [])];
  const groupedEvents = allEvents.reduce((acc, event) => {
    const year = new Date(event.eventDate).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(event);
    return acc;
  }, {});

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  };

  const isEventPast = (eventDate, endTime) => {
    const [hours, minutes] = endTime.split(':').map(Number);
    const eventDateTime = new Date(eventDate);
    eventDateTime.setHours(hours, minutes);
    return eventDateTime < currentDateTime;
  };

  const getRegistrationButton = (event) => {
    const isPast = isEventPast(event.eventDate, event.endTime);

    if (isPast) {
      return (
        <button 
          disabled
          className="inline-flex items-center justify-center gap-2 bg-gray-400 text-white py-3 px-6 rounded-lg text-lg font-medium cursor-not-allowed opacity-75"
        >
          Event Completed
        </button>
      );
    }

    if (!event.registrationLink) {
      return (
        <button 
          disabled
          className="inline-flex items-center justify-center gap-2 bg-yellow-500 text-white py-3 px-6 rounded-lg text-lg font-medium cursor-not-allowed opacity-75"
        >
          Registration Closed
        </button>
      );
    }

    return (
      <a 
        href={event.registrationLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 bg-[#0088cc] text-white py-3 px-6 rounded-lg text-lg font-medium transition-all hover:bg-[#0171a9] active:scale-95"
      >
        Register Now
        <FaArrowRight className="w-5 h-5" />
      </a>
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      <DesktopNavbar />
      <MobileNavbar />

      <div className="container mx-auto px-4 py-16 pt-32">
        <h1 className="text-4xl md:text-5xl text-center font-extrabold text-gray-900 mb-16 uppercase"
            style={{
              textShadow: `
                5px 5px rgba(128, 128, 128, 0.4),
                10px 10px rgba(128, 128, 128, 0.2)
              `
            }}>
          IEEE Events
        </h1>
        
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[140px] top-0 bottom-0 w-1 bg-[#0088cc]"></div>

          {Object.entries(groupedEvents)
            .sort(([yearA], [yearB]) => yearB - yearA)
            .map(([year, yearEvents]) => (
              <div key={year} className="mb-16">
                <motion.div 
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="sticky top-24 left-0 w-24 h-16 rounded-lg bg-[#0088cc] text-white flex items-center justify-center text-3xl font-bold z-10"
                >
                  {year}
                </motion.div>

                <div className="ml-[180px] space-y-8">
                  {yearEvents.map((event, index) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                        isEventPast(event.eventDate, event.endTime) ? 'opacity-75' : ''
                      }`}
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Image Section */}
                        <div className="md:w-1/3 relative pt-4 md:pt-0">
                          <img 
                            src={event.eventPoster} 
                            alt={event.eventName}
                            className="w-[70%] mx-auto md:w-[70%] my-4 object-contain border-[1px] border-gray-200"
                            loading="lazy"
                          />
                        </div>

                        {/* Content Section */}
                        <div className="md:w-2/3 p-4 md:p-8">
                          {/* Date Badge */}
                          <div className="mb-4">
                            <div className="inline-block bg-blue-100 px-4 py-2 rounded-lg">
                              <p className="text-[#0088cc] font-medium">
                                {formatDate(event.eventDate)}
                              </p>
                            </div>
                          </div>

                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                            {event.eventName}
                          </h3>

                          <p className="text-sm md:text-base text-gray-600 mb-6 ">
                            {event.eventDescription}
                          </p>

                          <div className="space-y-1 mb-6">
                            {event.speaker && (
                              <div className="flex items-center gap-4 text-gray-700">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                  <FaMicrophone className="w-5 h-5 text-[#0088cc]" />
                                </div>
                                <p className="text-sm md:text-base">{event.speaker}</p>
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-gray-700">
                              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                <FaClock className="w-5 h-5 text-[#0088cc]" />
                              </div>
                              <p className="text-sm md:text-base">
                                {event.startTime} - {event.endTime}
                              </p>
                            </div>

                            <div className="flex items-center gap-4 text-gray-700">
                              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                <FaMapMarkerAlt className="w-5 h-5 text-[#0088cc]" />
                              </div>
                              <p className="text-sm md:text-base">{event.venue}</p>
                            </div>
                          </div>

                          {getRegistrationButton(event)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default EventPage;
