import React, { useRef, useState, useEffect } from 'react';
import useEvents from '../../hooks/useEvents';
import { FaArrowLeft, FaArrowRight, FaMicrophone, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const EventSkeleton = () => (
  <div className="py-10 md:py-20 bg-gradient-to-b from-gray-50 to-white font-montserrat">
    <div className="max-w-6xl mx-auto px-4">
      {/* Header Skeleton */}
      <div className="text-center mb-16">
        <div className="h-10 w-64 bg-gray-200 rounded-lg mx-auto mb-4"></div>
        <div className="w-24 h-1 bg-gray-200 mx-auto rounded-full"></div>
      </div>

      {/* Card Skeleton */}
      <div className="relative">
        <div className="min-w-full animate-pulse">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row h-full">
              {/* Image Skeleton */}
              <div className="md:w-1/3 aspect-[4/3] bg-gray-200"></div>

              {/* Content Skeleton */}
              <div className="md:w-2/3 p-8">
                {/* Date Badge Skeleton */}
                <div className="w-32 h-8 bg-gray-200 rounded-lg mb-4"></div>
                
                {/* Title Skeleton */}
                <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
                
                {/* Description Skeleton */}
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>

                {/* Details Skeleton */}
                <div className="space-y-4 mb-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>

                {/* Button Skeleton */}
                <div className="w-40 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const UpComingEvents = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { events, loading, error } = useEvents();
  const cardContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Handle scroll position updates
  useEffect(() => {
    const container = cardContainerRef.current;
    if (!container) return;

    const handleScrollUpdate = () => {
      const cardWidth = container.offsetWidth;
      const scrollPosition = container.scrollLeft;
      const newIndex = Math.round(scrollPosition / cardWidth);
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < (events.upcoming?.length || 0)) {
        setCurrentIndex(newIndex);
      }
    };

    const debounceScroll = () => {
      clearTimeout(container.scrollTimeout);
      container.scrollTimeout = setTimeout(handleScrollUpdate, 50);
    };

    container.addEventListener('scroll', debounceScroll);
    return () => {
      container.removeEventListener('scroll', debounceScroll);
      if (container.scrollTimeout) {
        clearTimeout(container.scrollTimeout);
      }
    };
  }, [currentIndex, events.upcoming?.length]);

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - cardContainerRef.current.offsetLeft);
    setScrollLeft(cardContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - cardContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    cardContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (!cardContainerRef.current) return;
    
    const cardWidth = cardContainerRef.current.offsetWidth;
    const currentScroll = cardContainerRef.current.scrollLeft;
    const targetIndex = Math.round(currentScroll / cardWidth);
    
    cardContainerRef.current.scrollTo({
      left: targetIndex * cardWidth,
      behavior: 'smooth'
    });
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX - cardContainerRef.current.offsetLeft);
    setScrollLeft(cardContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].clientX - cardContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    if (cardContainerRef.current) {
      cardContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (!cardContainerRef.current) return;
    
    const cardWidth = cardContainerRef.current.offsetWidth;
    const currentScroll = cardContainerRef.current.scrollLeft;
    const targetIndex = Math.round(currentScroll / cardWidth);
    
    cardContainerRef.current.scrollTo({
      left: targetIndex * cardWidth,
      behavior: 'smooth'
    });
  };

  const handleScroll = (direction) => {
    if (!cardContainerRef.current) return;
    
    const cardWidth = cardContainerRef.current.offsetWidth;
    let newIndex = currentIndex + direction;
    
    if (newIndex < 0) newIndex = events.upcoming.length - 1;
    if (newIndex >= events.upcoming.length) newIndex = 0;
    
    setCurrentIndex(newIndex);
    cardContainerRef.current.scrollTo({
      left: newIndex * cardWidth,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return <EventSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const upcomingEvents = events.upcoming || [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  };

  if (upcomingEvents.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="no-event-div">
          <p className="text-xl font-semibold mb-4">No Upcoming Events</p>
          <div className="flex items-center justify-center gap-2">
            <p>Explore Our</p>
            <a href="./pages/event-page.html" className="text-[#0088cc] hover:underline">
              Completed Events &gt;&gt;
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-0 md:py-20 bg-gradient-to-b from-gray-50 to-white font-montserrat">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <h1
              className="text-3xl md:text-5xl text-center font-extrabold text-gray-900 leading-[1.2] md:leading-[0.8] tracking-tight uppercase past-event-head"
              style={{
                textShadow: `
                  5px 5px rgba(128, 128, 128, 0.4),
                  10px 10px rgba(128, 128, 128, 0.2)
                `
              }}
            >
              Upcoming Events
          </h1>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows - Only visible on desktop */}
          {!loading && upcomingEvents.length > 0 && (
            <div className='hidden md:block'>
              <button 
                onClick={() => handleScroll(-1)}
                className="arrow left absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center group z-10 transition-all hover:scale-110"
              >
                <FaArrowLeft className="w-5 h-5 text-gray-600 transition-transform group-hover:-translate-x-1" />
              </button>

              <button 
                onClick={() => handleScroll(1)}
                className="arrow right absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center group z-10 transition-all hover:scale-110"
              >
                <FaArrowRight className="w-5 h-5 text-gray-600 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          )}

          {/* Cards Container with enhanced scroll snapping */}
          <div 
            ref={cardContainerRef}
            className={`flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide touch-pan-x select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {loading ? (
              <EventSkeleton />
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, index) => (
                <div 
                  key={index}
                  className="min-w-full snap-center"
                >
                  <div className="bg-gray-100 rounded-2xl shadow-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row h-full">
                      {/* Image Section - Left Side */}
                      <div className="md:flex-1 relative pt-4 md:pt-0 md:aspect-[1/1.414] bg-gray-100">
                        <img 
                          src={event.eventPoster} 
                          alt={event.eventName}
                          className="w-[70%] mx-auto md:w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>

                      {/* Content Section - Right Side */}
                      <div className="md:w-[70%] shrink-0 p-4 pb-6 md:p-8 flex flex-col">
                        {/* Date Badge */}
                        <div className="flex justify-center md:justify-start mb-4">
                          <div className="inline-block bg-blue-100 px-4 py-2 rounded-lg">
                            <p className="text-[#0088cc] font-medium">
                              {formatDate(event.eventDate)}
                            </p>
                          </div>
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                          {event.eventName}
                        </h2>

                        <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 line-clamp-3 font-normal">
                          {event.eventDescription}
                        </p>

                        <div className="space-y-0 md:space-y-4 mb-4 md:mb-8">
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
                              {event.startTime === event.endTime 
                                ? event.startTime 
                                : `${event.startTime} - ${event.endTime}`}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 text-gray-700">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                              <FaMapMarkerAlt className="w-5 h-5 text-[#0088cc]" />
                            </div>
                            <p className="text-sm md:text-base">{event.venue}</p>
                          </div>
                        </div>

                        <a 
                          href={event.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto inline-flex items-center justify-center gap-2 bg-[#0088cc] text-white py-3 px-4 md:px-6 rounded-lg text-sm md:text-lg font-medium transition-all hover:bg-[#0171a9] active:scale-95 z-0"
                        >
                          Register Now
                          <FaArrowRight className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center py-12">
                <p className="text-xl font-semibold mb-4">No Upcoming Events</p>
                <div className="flex items-center justify-center gap-2">
                  <p>Explore Our</p>
                  <a href="./pages/event-page.html" className="text-[#0088cc] hover:underline">
                    Completed Events &gt;&gt;
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pagination Dots with improved sync */}
        {upcomingEvents.length > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            {upcomingEvents.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-[#0088cc] w-8' 
                    : 'bg-gray-300 w-2'
                }`}
                aria-label={`Slide ${index + 1} of ${upcomingEvents.length}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpComingEvents;


