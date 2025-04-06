import React, { useState, useEffect } from 'react';
import useEvents from '../../hooks/useEvents';
import { FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const EventCardSkeleton = ({ index }) => {
  // Mimic the same positioning logic as actual cards
  const getSkeletonStyle = (index) => {
    if (index === 0) { // Current card
      return {
        transform: 'translateX(0) scale(1) rotate(0deg)',
        zIndex: 3,
        opacity: 1
      };
    } else if (index === 1) { // Next card
      return {
        transform: 'translateX(25%) scale(0.85) rotate(5deg)',
        zIndex: 2,
        opacity: 0.3
      };
    } else if (index === 2) { // Previous card
      return {
        transform: 'translateX(-25%) scale(0.85) rotate(-5deg)',
        zIndex: 1,
        opacity: 0.3
      };
    }
  };

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm transition-all duration-500 ease-in-out"
      style={getSkeletonStyle(index)}
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative animate-pulse">
        <div className="aspect-[3/4] relative">
          {/* Skeleton for image */}
          <div className="w-full h-full bg-gray-200"></div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
          {/* Know More Button Skeleton */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

const PastEventsSkeleton = () => (
  <div className="py-20 bg-white overflow-hidden">
    <div className="mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left side - Large "PAST EVENTS" text skeleton */}
        <div className="md:w-[25%] flex items-center justify-center md:justify-start">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-32 w-[10rem] bg-gray-200 mb-8"></div>
              <div className="h-32 w-[10rem] bg-gray-200"></div>
            </div>
          </div>
        </div>

        {/* Right side - Stacked cards skeleton */}
        <div className="md:w-2/3 relative h-[500px] flex items-center justify-center perspective-1000">
          <div className="relative w-full h-full preserve-3d">
            {/* Show 3 skeleton cards with proper positioning */}
            {[0, 1, 2].map((index) => (
              <EventCardSkeleton key={index} index={index} />
            ))}

            {/* Skeleton Navigation buttons */}
            <div className="absolute left-96 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PastEvents = () => {
  const { events, loading, error } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.past.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.past.length) % events.past.length);
  };

  // Handle touch events for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    // Reset touch values
    setTouchStart(0);
    setTouchEnd(0);
  };

  const getCardStyle = (index) => {
    const diff = (index - currentIndex + events.past.length) % events.past.length;
    const zIndex = events.past.length - diff;
    
    // Different styles for mobile and desktop
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      if (diff === 0) { // Current card
        return {
          transform: 'translateX(0) scale(1)',
          zIndex,
          opacity: 1
        };
      } else {
        return {
          transform: `translateX(${diff > 0 ? '100%' : '-100%'}) scale(0.9)`,
          zIndex,
          opacity: 0
        };
      }
    } else {
      if (diff === 0) { // Current card
        return {
          transform: 'translateX(0) scale(1) rotate(0deg)',
          zIndex,
          opacity: 1
        };
      } else if (diff === 1) { // Next card
        return {
          transform: 'translateX(25%) scale(0.85) rotate(5deg)',
          zIndex,
          opacity: 0.3
        };
      } else if (diff === events.past.length - 1) { // Previous card
        return {
          transform: 'translateX(-25%) scale(0.85) rotate(-5deg)',
          zIndex,
          opacity: 0.3
        };
      } else { // Hidden cards
        return {
          transform: 'translateX(0) scale(0.7)',
          zIndex,
          opacity: 0
        };
      }
    }
  };

  // Modal for event details
  const EventModal = ({ event, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-zoomIn">
        <div className="relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-600 hover:text-gray-900 z-10"
          >
            <FaTimes className="w-6 h-6" />
          </button>
          
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <img 
              src={event.eventPoster} 
              alt={event.eventName} 
              className="w-full h-auto object-contain rounded-lg"
            />
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">{event.eventName}</h2>
              <p className="text-gray-600">{event.eventDescription}</p>
              <div className="space-y-2">
                <p><span className="font-semibold">Date:</span> {formatDate(event.eventDate)}</p>
                <p>
                  <span className="font-semibold">Time:</span> {
                    event.startTime === event.endTime 
                      ? event.startTime 
                      : `${event.startTime} - ${event.endTime}`
                  }
                </p>
                <p><span className="font-semibold">Venue:</span> {event.venue}</p>
                {event.speaker && (
                  <p><span className="font-semibold">Speaker:</span> {event.speaker}</p>
                )}
              </div>
              {event.instaPostLink && (
                <a 
                  href={event.instaPostLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-600 hover:underline"
                >
                  View Instagram Post
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <PastEventsSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const pastEvents = events.past || [];

  return (
    <div className="py-10 md:py-20 bg-white overflow-hidden">
      <div className="mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Left side - Large "PAST EVENTS" text */}
          <div className="md:w-[25%] flex items-center justify-center md:justify-start">
            <div className="text-center">
              <h1
                className="text-4xl md:text-[10rem] text-center md:text-left md:ml-8 font-extrabold text-gray-900 leading-[1.2] md:leading-[0.8] tracking-tight uppercase past-event-head flex flex-row md:flex-col gap-4 md:gap-0"
                style={{
                  textShadow: `
                    4px 4px rgba(128, 128, 128, 0.4),
                    8px 8px rgba(128, 128, 128, 0.2)
                  `
                }}
              >
                <span className="block mb-4 md:mb-8">Past</span>
                <span className="block">Events</span>
              </h1>
            </div>
          </div>

          {/* Right side - Stacked cards */}
          <div className="md:w-2/3 relative h-[400px] md:h-[500px] flex items-center justify-center perspective-1000">
            {/* Cards Stack */}
            <div 
              className="relative w-full h-full preserve-3d flex items-center justify-center"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {pastEvents.map((event, index) => (
                <div
                  key={event._id}
                  className="absolute md:left-1/2 md:-translate-x-1/2 -translate-y-1/2 w-full max-w-[280px] md:max-w-sm transition-all duration-500 ease-in-out"
                  style={getCardStyle(index)}
                >
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
                    {/* Image Container */}
                    <div className="aspect-[3/4] relative">
                      <img
                        src={event.eventPoster}
                        alt={event.eventName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                      {/* Know More Button */}
                      <button 
                        onClick={() => setSelectedEvent(event)}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition-colors text-sm"
                      >
                        Know More
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Navigation buttons - Visible on both mobile and desktop */}
              <div className="block">
                <button
                  onClick={handlePrev}
                  className="absolute left-0 md:left-96 top-1/2 -translate-y-1/2 z-50 bg-white/90 md:bg-white rounded-full p-2 md:p-3 shadow-lg hover:scale-110 transition-transform mx-2 md:mx-0"
                  aria-label="Previous event"
                >
                  <FaArrowLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-600" />
                </button>
                
                <button
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-50 bg-white/90 md:bg-white rounded-full p-2 md:p-3 shadow-lg hover:scale-110 transition-transform mx-2 md:mx-0"
                  aria-label="Next event"
                >
                  <FaArrowRight className="w-4 h-4 md:w-6 md:h-6 text-gray-600" />
                </button>
              </div>

              {/* Mobile Pagination Dots - Moved up slightly to avoid overlap with arrows */}
              <div className="flex md:hidden justify-center items-center gap-2 absolute -bottom-2 left-0 right-0">
                {pastEvents.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-[#0088cc] w-8' 
                        : 'bg-gray-300 w-2'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <EventModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
};

export default PastEvents;