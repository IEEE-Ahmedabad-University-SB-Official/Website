import { useState, useEffect } from 'react';
import axios from 'axios';

const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/events`);
      const allEvents = response.data;
      const currentDate = new Date();

      // Split events into upcoming and past
      const upcomingEvents = allEvents
        .filter(event => new Date(event.eventDate) >= currentDate)
        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

      const pastEvents = allEvents
        .filter(event => new Date(event.eventDate) < currentDate)
        .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));

      setEvents({ upcoming: upcomingEvents, past: pastEvents });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events");
      setLoading(false);
    }
  };

  return { events, loading, error };
};

export default useEvents; 