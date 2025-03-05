import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const PastEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("https://ieeeausb.onrender.com/api/events");
      const allEvents = response.data;
      const currentDate = new Date();

      // Filter and sort past events
      const pastEvents = allEvents
        .filter(event => new Date(event.eventDate) < currentDate)
        .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));

      setEvents(pastEvents);
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

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  };

  const getCardStyle = (index) => {
    const diff = (index - currentIndex + events.length) % events.length;
    const zIndex = events.length - diff;
    
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
    } else if (diff === events.length - 1) { // Previous card
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

  return (
    <div className="py-20 bg-white overflow-hidden">
      <div className=" mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left side - Large "PAST EVENTS" text */}
          <div className="md:w-[25%] flex items-center justify-center md:justify-start">
            <div className="text-center">
              <h1 className="text-[10rem] text-left ml-8 font-bold text-gray-900 leading-[0.8] tracking-tight">
                PAST
                <br />
                EVENTS
              </h1>
            </div>
          </div>

          {/* Right side - Stacked cards */}
          <div className="md:w-2/3 relative h-[500px] flex items-center justify-center perspective-1000">
            {/* Cards Stack */}
            <div className="relative w-full h-full preserve-3d">
              {events.map((event, index) => (
                <div
                  key={event._id}
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm transition-all duration-500 ease-in-out"
                  style={getCardStyle(index)}
                >
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
                    {/* Image Container */}
                    <div className="aspect-[3/4] relative">
                      <img
                        src={event.eventPoster}
                        alt={event.eventName}
                        className="w-full h-full object-cover"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                      {/* Know More Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                        }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition-colors"
                      >
                        Know More
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Navigation buttons - Now inside the cards container */}
              <button
                onClick={handlePrev}
                className="absolute left-96 top-1/2 -translate-y-1/2 z-50 bg-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform"
              >
                <FaArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-50 bg-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform"
              >
                <FaArrowRight className="w-6 h-6 text-gray-600" />
              </button>
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