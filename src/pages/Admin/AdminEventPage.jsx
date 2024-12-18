import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AdminEventPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPoster, setCurrentPoster] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  // Form state
  const [formData, setFormData] = useState({
    eventId: '',
    eventName: '',
    eventDescription: '',
    speaker: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    venue: '',
    registrationLink: '',
    instaPostLink: '',
    eventPoster: null,
    oldEventPoster: ''
  });

  // Check authentication
  useEffect(() => {
    if (!sessionStorage.getItem('ieee-login-userId')) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch events data
  const fetchData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      eventId: '',
      eventName: '',
      eventDescription: '',
      speaker: '',
      eventDate: '',
      startTime: '',
      endTime: '',
      venue: '',
      registrationLink: '',
      instaPostLink: '',
      eventPoster: null,
      oldEventPoster: ''
    });
    setImagePreview(null);
    setCurrentPoster(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'eventPoster' && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(files[0]);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitFormData = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        submitFormData.append(key, formData[key]);
      }
    }

    if (!formData.eventPoster && currentPoster) {
      submitFormData.append('eventPoster', currentPoster);
    }

    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      const url = formData.eventId
        ? `${backendUrl}/api/events/update/${formData.eventId}`
        : `${backendUrl}/api/events/upload`;

      await axios.post(url, submitFormData, config);

      Swal.fire({
        title: formData.eventId ? 'Updated!' : 'Added!',
        text: formData.eventId ? 'Event updated successfully.' : 'Event added successfully.',
        icon: 'success'
      });

      closeModal();
      fetchData();
    } catch (error) {
      if (error.response?.data?.error?.message?.includes('File size too large')) {
        Swal.fire({
          title: 'Error',
          text: 'File size too large. Maximum allowed size is 10 MB',
          icon: 'error'
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong. Please try again later.',
          icon: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.post(`${backendUrl}/api/events/update/${id}`);
      const event = response.data.event;
      
      let dateString = '';
      if (event.eventDate) {
        const eventDate = new Date(event.eventDate);
        eventDate.setDate(eventDate.getDate() + 1);
        dateString = eventDate.toISOString().split('T')[0];
      }

      setFormData({
        eventId: event._id,
        eventName: event.eventName,
        eventDescription: event.eventDescription,
        speaker: event.speaker,
        eventDate: dateString,
        startTime: event.startTime,
        endTime: event.endTime,
        venue: event.venue,
        registrationLink: event.registrationLink,
        instaPostLink: event.instaPostLink,
        oldEventPoster: event.eventPoster
      });

      if (event.eventPoster) {
        setCurrentPoster(event.eventPoster);
        setImagePreview(event.eventPoster);
      }

      setShowModal(true);
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await axios.delete(`${backendUrl}/api/event/${id}`);
        await fetchData();
        Swal.fire('Deleted!', 'Your event has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting event:', error);
        Swal.fire('Error!', 'Something went wrong.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-center relative">
        <button 
          className="absolute left-[10%] px-5 py-2.5 bg-black text-white border-none rounded hover:bg-black/60 cursor-pointer text-base transition-all duration-100" 
          onClick={() => navigate('/admin')}
        >
          Admin page
        </button>
        <h1 className="flex-grow text-center">Event-admin Page</h1>
      </div>

      {/* Loader */}
      {loading && (
        <div className="hidden fixed z-50 top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 border-[12px] border-gray-200 rounded-full w-20 h-20 animate-spin border-t-blue-500" />
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-10 overflow-auto bg-black/40">
          <div className="bg-white mx-auto my-[10%] p-8 border border-gray-300 rounded-lg w-[50%] shadow-lg">
            <span 
              className="float-right text-2xl font-bold text-gray-400 hover:text-black cursor-pointer" 
              onClick={closeModal}
            >
              &times;
            </span>
            
            <form 
              onSubmit={handleSubmit} 
              encType="multipart/form-data"
              className="w-full gap-2.5"
            >
              <input
                className="w-full p-1.5 my-1 box-border border border-gray-300 rounded"
                type="hidden"
                name="eventId"
                value={formData.eventId}
              />

              <label htmlFor="eventName" className="col-span-2">Event Name<span style={{ color: 'red' }}>*</span>:</label>
              <input
                className="w-full p-1.5 my-1 box-border border border-gray-300 rounded"
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="eventDescription" className="col-span-2">Event Description<span style={{ color: 'red' }}>*</span>:</label>
              <textarea
                className="w-full p-1.5 my-1 box-border border border-gray-300 rounded"
                name="eventDescription"
                value={formData.eventDescription}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="speaker" className="col-span-2">Speaker Name:</label>
              <input
                className="w-full p-1.5 my-1 box-border border border-gray-300 rounded"
                type="text"
                name="speaker"
                value={formData.speaker}
                onChange={handleInputChange}
              />

              <label htmlFor="eventDate" className="col-span-2">Event Date<span style={{ color: 'red' }}>*</span>:</label>
              <input
                className="w-full p-1.5 my-1 box-border border border-gray-300 rounded"
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="startTime" className="col-span-2">Event Start Time<span style={{ color: 'red' }}>*</span>:</label>
              <input
                className="w-full p-1.5 my-1 box-border border border-gray-300 rounded"
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="endTime" className="col-span-2">Event End Time<span style={{ color: 'red' }}>*</span>:</label>
              <input
                className="w-full p-1.5 my-1 box-border border border-gray-300 rounded"
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="venue" className="col-span-2">Venue<span style={{ color: 'red' }}>*</span>:</label>
              <input
                className="w-full p-1.5 my-1 box-border border border-gray-300 rounded"
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="registrationLink" className="col-span-2">Registration Link<span style={{ color: 'red' }}>*</span>:</label>
              <input
                className="w-full p-1.5 my-1 box-border border border-gray-300 rounded"
                type="url"
                name="registrationLink"
                value={formData.registrationLink}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="instaPostLink" className="col-span-2">Instagram Post Link:</label>
              <input
                className="w-full p-1.5 my-1 box-border border border-gray-300 rounded"
                type="url"
                name="instaPostLink"
                value={formData.instaPostLink}
                onChange={handleInputChange}
              />

              <div className="col-span-2 border-2 border-dashed border-gray-300 p-5 text-center cursor-pointer">
                <label htmlFor="eventPoster" className="col-span-2">Event Poster<span style={{ color: 'red' }}>*</span>:</label>
                <input
                  className="w-full p-1.5 my-1 box-border border border-gray-300 rounded"
                  type="file"
                  name="eventPoster"
                  onChange={handleInputChange}
                  accept="image/*"
                />
                <input type="hidden" name="oldEventPoster" value={formData.oldEventPoster} />
                {imagePreview && (
                  <div className="mt-2.5">
                    <img src={imagePreview} alt="Preview" className="max-w-full max-h-[200px]" />
                  </div>
                )}
              </div>

              <button 
                type="submit"
                className="col-span-2 py-2.5 px-5 bg-green-500 text-white border-none rounded hover:bg-green-600 cursor-pointer text-base"
              >
                {formData.eventId ? 'Update Event' : 'Add Event'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <table className="w-4/5 border-collapse mx-auto mt-0">
        <thead>
          <tr>
            <th className="border border-gray-300 text-left p-2 bg-black/60 text-white">Event Name</th>
            <th className="border border-gray-300 text-left p-2 bg-black/60 text-white">Description</th>
            <th className="border border-gray-300 text-left p-2 bg-black/60 text-white">Date</th>
            <th className="border border-gray-300 text-left p-2 bg-black/60 text-white">Speaker</th>
            <th className="border border-gray-300 text-left p-2 bg-black/60 text-white">Time</th>
            <th className="border border-gray-300 text-left p-2 bg-black/60 text-white">Venue</th>
            <th className="border border-gray-300 text-left p-2 bg-black/60 text-white">Registration Link</th>
            <th className="border border-gray-300 text-left p-2 bg-black/60 text-white">Instagram Post</th>
            <th className="border border-gray-300 text-left p-2 bg-black/60 text-white">Poster</th>
            <th className="border border-gray-300 text-left p-2 bg-black/60 text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => {
            const eventDate = new Date(event.eventDate);
            const dateString = eventDate.getDate().toString().padStart(2, '0') + '-' + 
                             (eventDate.getMonth() + 1).toString().padStart(2, '0') + '-' + 
                             eventDate.getFullYear();
            
            return (
              <tr key={event._id} className="even:bg-gray-100">
                <td className="border border-gray-300 text-left p-2">{event.eventName}</td>
                <td className="border border-gray-300 text-left p-2" style={{ maxWidth: '280px' }}>{event.eventDescription}</td>
                <td className="border border-gray-300 text-left p-2">{dateString}</td>
                <td className="border border-gray-300 text-left p-2">{event.speaker}</td>
                <td className="border border-gray-300 text-left p-2">
                  {event.startTime === event.endTime 
                    ? event.startTime 
                    : `${event.startTime} - ${event.endTime}`}
                </td>
                <td className="border border-gray-300 text-left p-2">{event.venue}</td>
                <td className="border border-gray-300 text-left p-2">
                  <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                    Register Here
                  </a>
                </td>
                <td className="border border-gray-300 text-left p-2">
                  <a href={event.instaPostLink} target="_blank" rel="noopener noreferrer">
                    Instagram Post
                  </a>
                </td>
                <td className="border border-gray-300 text-left p-2">
                  <img src={event.eventPoster} alt="event poster" className="w-[300px] h-auto" />
                </td>
                <td className="border border-gray-300 text-left p-2">
                  <button 
                    onClick={() => handleEdit(event._id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(event._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Instructions */}
      <div className="w-4/5 mx-auto text-sm mt-4">
        <p className="my-1">{"Add Event - fill form to add new event"}</p>
        <p className="my-1">{"Edit - fill form to edit existing event"}</p>
        <p className="my-1">{"Delete - delete event from list"}</p>
        <p className="my-1">
          If any event has no two time (00:00 to 00:00) then, you need to enter same start time in "Event start Time" and "Event End Time".
        </p>
        <p className="my-1">"Speaker name" and "InstaPostlink" are optional fields</p>
      </div>

      {/* Add Event Button */}
      <button 
        onClick={() => setShowModal(true)}
        className="block mx-auto my-5 px-5 py-2.5 bg-green-500 text-white border-none rounded hover:bg-green-600 cursor-pointer text-base"
      >
        Add Event
      </button>
    </div>
  );
};

export default AdminEventPage