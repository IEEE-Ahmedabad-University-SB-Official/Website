import React, { useState } from 'react';
import { FaEnvelope, FaLinkedin, FaInstagram, FaMapMarkerAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import auContactUs1 from '../../assets/Images/contactusAU.jpg';

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const submitContactForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    const name = document.getElementById('fullName').value;
    const email = document.getElementById('emailAddress').value;
    const message = document.getElementById('messageText').value;

    if (!name || !email || !message) {
      Swal.fire({
        icon: 'error',
        title: 'All fields are required',
        text: 'Please fill in all the fields.'
      });
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.'
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/contact-us/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({ name, email, message })
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Your details have been submitted. We will contact you shortly.'
        });
        e.target.reset();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message || 'An error occurred. Please try again later.'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <section className="relative w-full min-h-screen scroll-mt-20" id="contactUs">
      {/* Map Background */}
      <div className="absolute inset-0 w-[95%] h-[70vh] mx-auto">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.6085372802418!2d72.55180577602258!3d23.03814131574564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848d5f86040f%3A0x7a0cc8b624851642!2sAhmedabad%20University!5e0!3m2!1sen!2sin!4v1715959567993!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Contact Form Container */}
      <div className="container mx-auto px-4 w-full md:w-[80%] max-w-[1400px]">
        <div className="relative top-[40vh]">
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-0 bg-white rounded-lg shadow-[-1px_10px_20px_rgba(0,0,0,_0.7)] overflow-hidden w-full">
            {/* Form Section */}
            <div className="p-4 sm:p-6 md:p-8 lg:p-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0088cc] mb-6 lg:mb-12">
                We'd Love To Hear From You!
              </h2>
              <form onSubmit={submitContactForm} className="space-y-6 lg:space-y-8">
                <div className='flex flex-col sm:flex-row gap-4 sm:gap-8 lg:gap-12'>
                  <div className="relative w-full">
                    <input
                      type="text"
                      id="fullName"
                      placeholder=" "
                      className="peer w-full px-0 py-2 sm:py-3 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-base lg:text-lg"
                      required
                    />
                    <label
                      htmlFor="fullName"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all
                      peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2
                      peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Full name
                    </label>
                  </div>
                  <div className="relative w-full">
                    <input
                      type="email"
                      id="emailAddress"
                      placeholder=" "
                      className="peer w-full px-0 py-2 sm:py-3 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-base lg:text-lg"
                      required
                    />
                    <label
                      htmlFor="emailAddress"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all
                      peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2
                      peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Email address
                    </label>
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    id="messageText"
                    placeholder=" "
                    rows="4"
                    className="peer w-full px-0 py-2 sm:py-3 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-base lg:text-lg resize-none"
                    required
                  ></textarea>
                  <label
                    htmlFor="messageText"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all
                    peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2
                    peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Message
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-[#0088cc] text-white py-2 sm:py-3 px-8 sm:px-12 rounded-none text-base lg:text-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>

            {/* Contact Details Section */}
            <div className="hidden lg:block relative min-h-[300px] lg:min-h-full">
              <img
                src={auContactUs1}
                alt="Contact"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/70">
                <div className="p-4 sm:p-6 lg:pl-8 h-full flex flex-col">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white my-4 sm:my-8">Contact Us</h3>
                  <div className="space-y-4 sm:space-y-6 h-full flex flex-col justify-center">
                    <a
                      href="mailto:ieee.sb@ahduni.edu.in"
                      className="flex items-center space-x-4 text-white hover:underline transition-colors"
                    >
                      <FaEnvelope className="text-xl min-w-[16px]" />
                      <span className="text-sm sm:text-base">ieee.sb@ahduni.edu.in</span>
                    </a>
                    <a
                      href="https://www.linkedin.com/company/ahmedabad-university-ieee-sb/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-4 text-white hover:underline transition-colors"
                    >
                      <FaLinkedin className="text-xl min-w-[16px]" />
                      <span className="text-sm sm:text-base">ahmedabad-university-ieee-sb</span>
                    </a>
                    <a
                      href="https://www.instagram.com/ieee_ausb"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-4 text-white hover:underline transition-colors"
                    >
                      <FaInstagram className="text-xl min-w-[16px]" />
                      <span className="text-sm sm:text-base">ieee_ausb</span>
                    </a>
                    <a
                      href="https://maps.app.goo.gl/bpwXyhJ7oC5nqqLH6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-4 text-white hover:underline transition-colors"
                    >
                      <FaMapMarkerAlt className="text-xl min-w-[16px]" />
                      <span className="text-sm sm:text-base">Ahmedabad University</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
            <div className='h-[400px]'></div>
      </div>
    </section>
  );
};

export default ContactUs; 