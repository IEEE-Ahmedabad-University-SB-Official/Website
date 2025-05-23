import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AdminEventPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPoster, setCurrentPoster] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [filterYear, setFilterYear] = useState("all");
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const apikey = import.meta.env.VITE_API_KEY;

  // Form state
  const [formData, setFormData] = useState({
    eventId: "",
    eventName: "",
    eventDescription: "",
    speaker: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    venue: "",
    registrationLink: "",
    instaPostLink: "",
    eventPoster: null,
    oldEventPoster: "",
  });

  // Check authentication
  useEffect(() => {
    if (!sessionStorage.getItem("ieee-login-userId")) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch events data
  const fetchData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/events`, {
        headers: {
            'x-api-key': apikey
        }
    });
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      const years = [
        ...new Set(
          events.map((event) => new Date(event.eventDate).getFullYear())
        ),
      ].sort((a, b) => b - a); // Sort years in descending order
      setAvailableYears(years);
    }
  }, [events]);

  const filteredEvents = events.filter((event) => {
    if (filterYear === "all") return true;
    return new Date(event.eventDate).getFullYear().toString() === filterYear;
  });

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      eventId: "",
      eventName: "",
      eventDescription: "",
      speaker: "",
      eventDate: "",
      startTime: "",
      endTime: "",
      venue: "",
      registrationLink: "",
      instaPostLink: "",
      eventPoster: null,
      oldEventPoster: "",
    });
    setImagePreview(null);
    setCurrentPoster(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "eventPoster" && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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
      submitFormData.append("eventPoster", currentPoster);
    }

    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      const url = formData.eventId
        ? `${backendUrl}/api/events/update/${formData.eventId}`
        : `${backendUrl}/api/events/upload`;

      await axios.post(url, submitFormData, {
        headers: {
            'x-api-key': apikey
        }
    });

      Swal.fire({
        title: formData.eventId ? "Updated!" : "Added!",
        text: formData.eventId
          ? "Event updated successfully."
          : "Event added successfully.",
        icon: "success",
      });

      closeModal();
      fetchData();
    } catch (error) {
      if (
        error.response?.data?.error?.message?.includes("File size too large")
      ) {
        Swal.fire({
          title: "Error",
          text: "File size too large. Maximum allowed size is 10 MB",
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again later.",
          icon: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/events/update/${id}`, {
          headers: {
            'x-api-key': apikey
          }
        }
      );
      const event = response.data.event;

      let dateString = "";
      if (event.eventDate) {
        const eventDate = new Date(event.eventDate);
        eventDate.setDate(eventDate.getDate() + 1);
        dateString = eventDate.toISOString().split("T")[0];
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
        oldEventPoster: event.eventPoster,
      });

      if (event.eventPoster) {
        setCurrentPoster(event.eventPoster);
        setImagePreview(event.eventPoster);
      }

      setShowModal(true);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await axios.delete(`${backendUrl}/api/event/${id}`, {
          headers: {
            'x-api-key': apikey
          }
        });
        await fetchData();
        Swal.fire("Deleted!", "Your event has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting event:", error);
        Swal.fire("Error!", "Something went wrong.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReadMore = (event) => {
    setSelectedEvent(event);
  };

  const closeEventDetail = () => {
    setSelectedEvent(null);
  };

  // Add this date formatting function at the top of your component
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="font-poppins m-0 p-0 min-h-screen bg-[#121212] flex-col justify-center">
      <div className="max-w-screen-2xl mx-auto px-5 flex flex-col items-center justify-center relative py-4 ">
        <button
          className="sm:absolute flex items- sm:left-[0] px-5 py-2.5 bg-black text-white rounded border border-gray-400 hover:bg-gray-700 transition sm:w-auto w-fit mb-4 sm:mb-0"
          onClick={() => navigate("/admin/dashboard")}
        >
          Admin Page
        </button>
        <h1 className="text-center font-bold text-white text-3xl">
          Event Admin Page
        </h1>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-5 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#1f1f1f] rounded-lg p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <span className="text-white">Filter by Year:</span>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full sm:w-auto bg-[#2d2d2d] text-white px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Years</option>
              {availableYears.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-green-600 text-white rounded text-base hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Event
          </button>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-4 sm:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-[#1f1f1f] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300 border border-gray-800"
            >
              <div className="pt-4 sm:pt-0 sm:pl-4 flex flex-col sm:flex-row h-full">
                <div className="w-full sm:w-48 h-64 object-fill sm:h-auto relative">
                  <img
                    className="w-full h-full object-contain" // Changed from object-cover to object-contain
                    src={event.eventPoster || "https://via.placeholder.com/150"}
                    alt={event.eventName}
                  />
                </div>

                <div className="flex-1 p-4 sm:p-6 flex flex-col">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                        {event.eventName}
                      </h3>
                      <div className=" flex gap-2">
                        <button
                          onClick={() => handleEdit(event._id)}
                          className="p-2 h-fit bg-gray-900 bg-opacity-75 rounded-full text-white hover:bg-blue-600 transition"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="p-2 h-fit bg-gray-900 bg-opacity-75 rounded-full text-red-500 hover:bg-red-600 hover:text-white transition"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="relative mb-4">
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {event.eventDescription}
                      </p>
                      <button
                        onClick={() => handleReadMore(event)}
                        className="text-blue-500 hover:text-blue-400 text-sm font-medium mt-1"
                      >
                        Read More
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2 bg-[#2d2d2d] p-2 rounded-lg">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-gray-300">
                          {formatDate(event.eventDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-[#2d2d2d] p-2 rounded-lg">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-gray-300">
                          {event.startTime} - {event.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-[#2d2d2d] p-2 rounded-lg">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-gray-300">{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-[#2d2d2d] p-2 rounded-lg">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="text-gray-300">
                          {event.speaker || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-400 text-sm bg-[#2d2d2d] px-3 py-1 rounded-full"
                    >
                      <svg
                        className="w-4 h-4 "
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                        />
                      </svg>
                      Register
                    </a>
                    {event.instaPostLink && (
                      <a
                        href={event.instaPostLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className=" flex items-center gap-1 text-pink-500 hover:text-pink-400 text-sm bg-[#2d2d2d] px-3 py-1 rounded-full"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[1000] p-4">
          <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-gray-200 text-xl font-bold">
                {formData.eventId ? "Edit Event" : "Add Event"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-200 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-gray-300">
              {/* Event Name */}
              <div>
                <label className="block font-medium mb-1">
                  Event Name<span className="text-red-500">*</span>:
                </label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  className="bg-[#2d2d2d] w-full p-2.5 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Event Description */}
              <div>
                <label className="block font-medium mb-1">
                  Event Description<span className="text-red-500">*</span>:
                </label>
                <textarea
                  name="eventDescription"
                  value={formData.eventDescription}
                  onChange={handleInputChange}
                  className="bg-[#2d2d2d] w-full p-2.5 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  rows="4"
                  required
                />
              </div>

              {/* Speaker */}
              <div>
                <label className="block font-medium mb-1">Speaker:</label>
                <input
                  type="text"
                  name="speaker"
                  value={formData.speaker}
                  onChange={handleInputChange}
                  className="bg-[#2d2d2d] w-full p-2.5 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Event Date */}
              <div>
                <label className="block font-medium mb-1">
                  Event Date<span className="text-red-500">*</span>:
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  className="bg-[#2d2d2d] w-full p-2.5 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">
                    Start Time<span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="bg-[#2d2d2d] w-full p-2.5 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    End Time<span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="bg-[#2d2d2d] w-full p-2.5 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block font-medium mb-1">
                  Venue<span className="text-red-500">*</span>:
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  className="bg-[#2d2d2d] w-full p-2.5 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Links */}
              <div>
                <label className="block font-medium mb-1">
                  Registration Link<span className="text-red-500">*</span>:
                </label>
                <input
                  type="url"
                  name="registrationLink"
                  value={formData.registrationLink}
                  onChange={handleInputChange}
                  className="bg-[#2d2d2d] w-full p-2.5 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Instagram Post Link:
                </label>
                <input
                  type="url"
                  name="instaPostLink"
                  value={formData.instaPostLink}
                  onChange={handleInputChange}
                  className="bg-[#2d2d2d] w-full p-2.5 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Event Poster */}
              <div className="border-2 border-dashed border-gray-300 p-4 rounded">
                <label className="block font-medium mb-2">
                  Event Poster<span className="text-red-500">*</span>:
                </label>
                <input
                  type="file"
                  name="eventPoster"
                  onChange={handleInputChange}
                  accept="image/*"
                  className=" bg-[#434343]w-full"
                />
                {imagePreview && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-[200px] max-h-[200px] object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : formData.eventId
                  ? "Update Event"
                  : "Add Event"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Add this modal for event details */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4"
          onClick={closeEventDetail}
        >
          <div
            className="bg-[#1a1a1a] rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-modal-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-4 sm:p-6">
              <button
                onClick={closeEventDetail}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  className="w-full sm:w-64 h-48 sm:h-auto object-cover rounded-lg shadow-md"
                  src={
                    selectedEvent.eventPoster ||
                    "https://via.placeholder.com/150"
                  }
                  alt="Event"
                />
                <div className="flex-1 ">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {selectedEvent.eventName}
                  </h2>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {selectedEvent.eventDescription}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-white">
                        {formatDate(selectedEvent.eventDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-white">
                        {selectedEvent.startTime} - {selectedEvent.endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-white">{selectedEvent.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="text-white">
                        {selectedEvent.speaker || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6 ">
                    <a
                      href={selectedEvent.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                        />
                      </svg>
                      Register Now
                    </a>
                    {selectedEvent.instaPostLink && (
                      <a
                        href={selectedEvent.instaPostLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        View on Instagram
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEventPage;
