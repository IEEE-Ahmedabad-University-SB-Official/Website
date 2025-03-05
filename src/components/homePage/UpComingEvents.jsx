import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight, FaMicrophone, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const EventSkeleton = () => (
  <div className="min-w-full animate-pulse">
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row h-full">
        {/* Image Skeleton */}
        <div className="md:w-1/2 aspect-[4/3] bg-gray-200"></div>

        {/* Content Skeleton */}
        <div className="md:w-1/2 p-8">
          {/* Title Skeleton */}
          <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
          
          {/* Description Skeleton */}
          <div className="space-y-2 mb-6">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>

          {/* Details Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const UpComingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardContainerRef = useRef(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("https://ieeeausb.onrender.com/api/events");
      const allEvents = response.data;
      const currentDate = new Date();

      // Filter and sort upcoming events
      const upcomingEvents = allEvents
        .filter(event => new Date(event.eventDate) >= currentDate)
        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

      setEvents(upcomingEvents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events");
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  };

  const handleScroll = (direction) => {
    if (cardContainerRef.current) {
      const cardWidth = cardContainerRef.current.firstChild?.offsetWidth || 0;
      const remInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const totalCardWidth = cardWidth + remInPixels;
      cardContainerRef.current.scrollBy({
        left: direction * totalCardWidth,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="no-event-div">
          <p className="text-xl font-semibold mb-4">No Upcoming Events</p>
          <div className="flex items-center justify-center gap-2">
            <p>Explore Our</p>
            <a href="./pages/event-page.html" className="text-blue-600 hover:underline">
              Completed Events &gt;&gt;
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white font-montserrat">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upcoming Events
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          {!loading && events.length > 0 && (
            <>
              <button 
                onClick={() => handleScroll(-1)}
                className="arrow left absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center group z-10 transition-all hover:scale-110"
              >
                <FaArrowLeft className="w-5 h-5 text-gray-600 transition-transform group-hover:-translate-x-1" />
              </button>

              <button 
                onClick={() => handleScroll(1)}
                className="arrow right absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center group z-10 transition-all hover:scale-110"
              >
                <FaArrowRight className="w-5 h-5 text-gray-600 transition-transform group-hover:translate-x-1" />
              </button>
            </>
          )}

          {/* Cards Container */}
          <div 
            ref={cardContainerRef}
            className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading ? (
              <EventSkeleton />
            ) : events.length > 0 ? (
              events.map((event, index) => (
                <div 
                  key={index}
                  className="min-w-full snap-center"
                >
                  <div className="bg-gray-100 rounded-2xl shadow-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row h-full">
                      {/* Image Section - Left Side */}
                      <div className="md:flex-1 relative aspect-[1/1.414] bg-gray-100">
                        <img 
                          src={event.eventPoster} 
                          alt={event.eventName}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>

                      {/* Content Section - Right Side */}
                      <div className="md:w-[70%] shrink-0 p-8 flex flex-col">
                        {/* Date Badge */}
                        <div className="mb-4">
                          <div className="inline-block bg-blue-100 px-4 py-2 rounded-lg">
                            <p className="text-blue-600 font-medium">
                              {formatDate(event.eventDate)}
                            </p>
                          </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                          {event.eventName}
                        </h2>

                        <p className="text-gray-600 mb-6 line-clamp-3 font-normal">
                          {event.eventDescription}
                        </p>

                        <div className="space-y-4 mb-8">
                          {event.speaker && (
                            <div className="flex items-center gap-4 text-gray-700">
                              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                <FaMicrophone className="w-5 h-5 text-blue-600" />
                              </div>
                              <p>{event.speaker}</p>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-gray-700">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                              <FaClock className="w-5 h-5 text-blue-600" />
                            </div>
                            <p>
                              {event.startTime === event.endTime 
                                ? event.startTime 
                                : `${event.startTime} - ${event.endTime}`}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 text-gray-700">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                              <FaMapMarkerAlt className="w-5 h-5 text-blue-600" />
                            </div>
                            <p>{event.venue}</p>
                          </div>
                        </div>

                        <a 
                          href={event.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-medium transition-all hover:bg-blue-700 active:scale-95"
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
                  <a href="./pages/event-page.html" className="text-blue-600 hover:underline">
                    Completed Events &gt;&gt;
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpComingEvents;


