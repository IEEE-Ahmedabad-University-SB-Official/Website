import React, { useState } from 'react';
import { MdEmail } from "react-icons/md";
import { FaInstagram, FaLinkedin, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import Swal from 'sweetalert2';
import auLogo from "../../assets/Images/AU_logo.webp";
import ieeelogo from "../../assets/Images/IEEE-LOGO-WHITE.png";

const Footer = () => {
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async () => {
        if (!validateEmail(formData.email)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address.'
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${backendUrl}/api/updates/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name: formData.name, 
                    email: formData.email 
                })
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'You will now receive updates from IEEE AU SB via email.'
                });
                setFormData({ name: '', email: '' });
            } else {
                if (result.message === 'Email already exists') {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Warning',
                        text: 'This email ID is already registered. Please try with another email ID.'
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'An error occurred. Please try again later.'
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred. Please try again later.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full overflow-x-hidden">
            <div className="bg-[#1c1c1c] text-[#f8f8f8db] pt-8 md:pt-0">
                <div className="flex flex-col justify-center items-center w-full">
                    {/* Main content grid */}
                    <div className="flex flex-col md:flex-row gap-12 md:gap-[6%] mx-[5%] mt-[2.5%]">
                        {/* Our Goals Section */}
                        <div className="flex flex-col h-full md:w-[30%] gap-4">
                            <div className="text-[1.25rem] font-semibold text-[rgba(255,255,255,0.818)] pb-[3px] relative after:content-[''] after:absolute after:pb-[3px] after:w-[1.5em] after:left-1/2 after:-translate-x-1/2 md:after:left-0 md:after:translate-x-0 after:bottom-0 after:border-b after:border-[rgba(255,255,255,0.631)]">
                                <p className="text-center md:text-left">Our Goals</p>
                            </div>
                            <div className="text-center md:text-justify text-[0.9rem] font-light text-[rgba(255,255,255,0.754)]">
                                <p>At IEEE Ahmedabad University Student Branch (IEEE AU SB), we are dedicated to fostering a vibrant community of innovators, engineers, and tech enthusiasts by promoting technological excellence, facilitating professional growth, building a collaborative network, enhancing learning opportunities, fostering innovation and creativity, and engaging with the community.</p>
                            </div>
                            <div className="flex flex-row justify-center md:justify-start gap-[1%]">
                                {['mailto:ieee.sb@ahduni.edu.in', 'https://www.instagram.com/ieee_ausb', 'https://www.linkedin.com/company/ahmedabad-university-ieee-sb/'].map((link, index) => (
                                    <a
                                        key={index}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-[2.5em] w-[2.5em] bg-[#404040] transition-all duration-200 flex justify-center items-center border-b-2 border-transparent hover:border-white hover:scale-110"
                                    >
                                        {index === 0 ? <MdEmail size={18}/> : index === 1 ? <FaInstagram size={18}/> : <FaLinkedin size={18}/>}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Vertical Line - Only visible on md and up */}
                        <div className="hidden md:block w-[1px] bg-[rgba(255,255,255,0.604)]" />

                        {/* Site Map */}
                        <div className="flex flex-col h-full w-full md:w-[150px] gap-[8%] text-[rgba(255,255,255,0.754)]">
                            <div className="relative mb-4">
                                <p className="text-[1.25rem] font-semibold text-[rgba(255,255,255,0.818)] pb-[3px] text-center md:text-left after:content-[''] after:absolute after:pb-[3px] after:w-[1.5em] after:left-1/2 after:-translate-x-1/2 md:after:left-0 md:after:translate-x-0 after:bottom-0 after:border-b after:border-[rgba(255,255,255,0.631)]">
                                    Site map
                                </p>
                            </div>
                            <div className="flex flex-col items-center md:items-start gap-2">
                                {['Home', 'About Us', 'Events', 'Committee', 'Contact Us'].map((item, index) => (
                                    <a
                                        key={index}
                                        href={`#${item.toLowerCase().replace(' ', '')}`}
                                        className="text-[1rem] transition-all duration-300 hover:text-white"
                                    >
                                        {item}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Contact Us Section */}
                        <div className="flex flex-col gap-[8%] items-center md:items-start">
                            <div className="relative">
                                <p className="text-[1.25rem] font-semibold text-[rgba(255,255,255,0.818)] pb-[3px] text-center md:text-left after:content-[''] after:absolute after:pb-[3px] after:w-[1.5em] after:left-1/2 after:-translate-x-1/2 md:after:left-0 md:after:translate-x-0 after:bottom-0 after:border-b after:border-[rgba(255,255,255,0.631)]">
                                    Contact Us
                                </p>
                            </div>
                            <div className="flex flex-col gap-[0.6em] text-[1rem] items-center md:items-start">
                                <div className="flex items-center gap-4">
                                    <MdEmail />
                                    <a href="mailto:ieee.sb@ahduni.edu.in" className="hover:text-white transition-all duration-300">
                                        Email: ieee.sb@ahduni.edu.in
                                    </a>
                                </div>
                                <div className="flex items-start gap-4">
                                    <FaMapMarkerAlt className="mt-1" />
                                    <p className="text-[rgba(255,255,255,0.518)] hover:text-[rgba(255,255,255,0.818)]">
                                        Address:<br />
                                        Ahmedabad University<br />
                                        Navrangpura<br />
                                        Ahmedabad-380009
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Get Updates Section */}
                        <div className="flex flex-col gap-[8%] w-full md:w-[23.5em] items-center md:items-start">
                            <div className="relative w-full">
                                <p className="text-[1.25rem] font-semibold text-[rgba(255,255,255,0.818)] pb-[3px] text-center md:text-left after:content-[''] after:absolute after:pb-[3px] after:w-[1.5em] after:left-1/2 after:-translate-x-1/2 md:after:left-0 md:after:translate-x-0 after:bottom-0 after:border-b after:border-[rgba(255,255,255,0.631)]">
                                    Get Updates
                                </p>
                            </div>
                            <div className="flex flex-col gap-4 w-full max-w-[23.5em]">
                                <div className="flex w-full">
                                    <div className="h-[3em] w-[3em] flex justify-center items-center bg-white">
                                        <FaUser color="black" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full h-[3em] pl-1 text-[#2f2f2f] outline-none text-base"
                                    />
                                </div>
                                <div className="flex w-full">
                                    <div className="h-[3em] w-[3em] flex justify-center items-center bg-white">
                                        <MdEmail color="black" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Your email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full h-[3em] pl-1 text-[#2f2f2f] outline-none text-base"
                                    />
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    className="h-[3.7em] w-full text-[0.84rem] font-semibold bg-white text-[#2f2f2f] transition-all duration-200 hover:bg-transparent hover:border-2 hover:border-white hover:text-white"
                                >
                                    Get Updates →
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Logos */}
                    <div className="flex flex-col md:flex-row justify-center items-center pt-12 md:pt-8 pb-4 md:pb-8 gap-8 md:gap-4">
                        <a href="/">
                            <img src={ieeelogo} alt="IEEE Logo" className="w-[250px] cursor-pointer" />
                        </a>
                        <a href="https://ahduni.edu.in/" target="_blank" rel="noopener noreferrer">
                            <img src={auLogo} alt="AU Logo" className="w-[200px] bg-white cursor-pointer" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="flex justify-center items-center flex-col bg-[#1c1c1c] text-[0.9rem] p-4">
                <hr className="w-[92%] my-[0.4rem] h-[1px] bg-[rgba(255,255,255,0.209)]" />
                <h4 className="m-[5px] pt-2 font-normal text-[rgba(255,255,255,0.80)] text-center px-4">
                    © IEEE AU SB 2024. All Rights Reserved | Developed by{' '}
                    <a href="https://www.linkedin.com/in/vishv-boda-806ab5289/" target="_blank" rel="noopener noreferrer" 
                       className="text-[rgba(255,255,255,0.4)] underline hover:text-[rgba(255,255,255,0.75)]">
                        Vishv Boda
                    </a>
                    {' '}&{' '}
                    <a href="https://www.linkedin.com/in/deeppatelDW1631/" target="_blank" rel="noopener noreferrer"
                       className="text-[rgba(255,255,255,0.4)] underline hover:text-[rgba(255,255,255,0.75)]">
                        Deep Patel
                    </a>
                    , IEEE AU SB
                </h4>
            </div>
        </section>
    );
};

export default Footer;

