import React, { useState } from 'react';
import { MdEmail } from "react-icons/md";
import { FaInstagram, FaLinkedin, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import Swal from 'sweetalert2';
import auLogo from "../../assets/Images/AU_logo.webp";
import ieeelogo from "../../assets/Images/IEEE-LOGO-WHITE.png";
import ieeeBlueLogo from "../../assets/Images/Logo.png";
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();
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

    const themeStyles = {
        light: {
            background: 'bg-gray-200',
            text: 'text-gray-800',
            subtext: 'text-gray-600 hover:text-gray-900',
            border: 'border-gray-300',
            socialBg: 'bg-gray-300 hover:border-gray-600 text-gray-600',
            inputBg: 'bg-white',
            inputText: 'text-gray-800',
            buttonBg: 'bg-[#0088cc] hover:bg-[#0171a9]',
            buttonText: 'text-white',
            divider: 'bg-gray-400/60'
        },
        dark: {
            background: 'bg-[#1c1c1c]',
            text: 'text-[#f8f8f8db]',
            subtext: 'text-[rgba(255,255,255,0.754)]',
            border: 'border-[rgba(255,255,255,0.631)]',
            socialBg: 'bg-[#404040] hover:border-white text-gray-100',
            inputBg: 'bg-white',
            inputText: 'text-[#2f2f2f]',
            buttonBg: 'bg-white hover:bg-transparent hover:border-2 hover:border-white',
            buttonText: 'text-[#2f2f2f] hover:text-white',
            divider: 'bg-[rgba(255,255,255,0.209)]'
        }
    };

    const styles = themeStyles[theme];

    return (
        <section className="w-full overflow-x-hidden">
            <div className={`${styles.background} ${styles.text} pt-8 md:pt-0`}>
                <div className="flex flex-col justify-center items-center w-full">
                    {/* Main content grid */}
                    <div className="flex flex-col md:flex-row gap-12 md:gap-[6%] mx-[5%] mt-[2.5%]">
                        {/* Our Goals Section */}
                        <div className="flex flex-col h-full md:w-[30%] gap-4">
                            <div className={`text-[1.25rem] font-semibold pb-[3px] relative after:content-[''] after:absolute after:pb-[3px] after:w-[1.5em] after:left-1/2 after:-translate-x-1/2 md:after:left-0 md:after:translate-x-0 after:bottom-0 after:border-b ${styles.border}`}>
                                <p className="text-center md:text-left">Our Goals</p>
                            </div>
                            <div className={`text-center md:text-justify text-[0.9rem] font-light ${styles.subtext}`}>
                                <p>At IEEE Ahmedabad University Student Branch (IEEE AU SB), we are dedicated to fostering a vibrant community of innovators, engineers, and tech enthusiasts by promoting technological excellence, facilitating professional growth, building a collaborative network, enhancing learning opportunities, fostering innovation and creativity, and engaging with the community.</p>
                            </div>
                            <div className="flex flex-row justify-center md:justify-start gap-[1%]">
                                {['mailto:ieee.sb@ahduni.edu.in', 'https://www.instagram.com/ieee_ausb', 'https://www.linkedin.com/company/ahmedabad-university-ieee-sb/'].map((link, index) => (
                                    <a
                                        key={index}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`h-[2.5em] w-[2.5em] transition-all duration-200 flex justify-center items-center border-b-2 border-transparent ${styles.socialBg}`}
                                    >
                                        {index === 0 ? <MdEmail size={18}/> : index === 1 ? <FaInstagram size={18}/> : <FaLinkedin size={18}/>}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Vertical Line */}
                        <div className={`hidden md:block w-[1px] ${styles.divider}`} />

                        {/* Site Map */}
                        <div className="flex flex-col h-full w-full md:w-[150px] gap-[8%]">
                            <div className="relative mb-4">
                                <p className={`text-[1.25rem] font-semibold pb-[3px] text-center md:text-left after:content-[''] after:absolute after:pb-[3px] after:w-[1.5em] after:left-1/2 after:-translate-x-1/2 md:after:left-0 md:after:translate-x-0 after:bottom-0 after:border-b ${styles.border}`}>
                                    Site map
                                </p>
                            </div>
                            <div className="flex flex-col items-center md:items-start gap-2">
                                {['Home', 'About Us', 'Events', 'Committee', 'Contact Us'].map((item, index) => (
                                    <a
                                        key={index}
                                        href={`#${item.toLowerCase().replace(' ', '')}`}
                                        className={`text-[1rem] transition-all duration-300 ${styles.subtext} hover:${styles.text}`}
                                    >
                                        {item}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Contact Us Section */}
                        <div className="flex flex-col gap-[8%] items-center md:items-start">
                            <div className="relative">
                                <p className={`text-[1.25rem] font-semibold pb-[3px] text-center md:text-left after:content-[''] after:absolute after:pb-[3px] after:w-[1.5em] after:left-1/2 after:-translate-x-1/2 md:after:left-0 md:after:translate-x-0 after:bottom-0 after:border-b ${styles.border}`}>
                                    Contact Us
                                </p>
                            </div>
                            <div className="flex flex-col gap-[0.6em] text-[1rem] items-center md:items-start">
                                <div className="flex items-center gap-4">
                                    <MdEmail />
                                    <a href="mailto:ieee.sb@ahduni.edu.in" className={`${styles.subtext} hover:${styles.text} transition-all duration-300`}>
                                        Email: ieee.sb@ahduni.edu.in
                                    </a>
                                </div>
                                <div className="flex items-start gap-4">
                                    <FaMapMarkerAlt className="mt-1" />
                                    <p className={`${styles.subtext} hover:${styles.text}`}>
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
                                <p className={`text-[1.25rem] font-semibold pb-[3px] text-center md:text-left after:content-[''] after:absolute after:pb-[3px] after:w-[1.5em] after:left-1/2 after:-translate-x-1/2 md:after:left-0 md:after:translate-x-0 after:bottom-0 after:border-b ${styles.border}`}>
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
                                        className={`w-full h-[3em] pl-1 ${styles.inputText} outline-none text-base`}
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
                                        className={`w-full h-[3em] pl-1 ${styles.inputText} outline-none text-base`}
                                    />
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    className={`h-[3.7em] w-full ${styles.buttonBg} ${styles.buttonText} transition-all duration-200`}
                                >
                                    Get Updates →
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Logos */}
                    <div className="flex flex-col md:flex-row justify-center items-center pt-12 md:pt-8 pb-4 md:pb-8 gap-8 md:gap-4">
                        <a href="/">
                            <img src={theme === 'dark' ? ieeelogo : ieeeBlueLogo} alt="IEEE Logo" className="w-[250px] cursor-pointer" />
                        </a>
                        <a href="https://ahduni.edu.in/" target="_blank" rel="noopener noreferrer">
                            <img src={auLogo} alt="AU Logo" className="w-[200px] bg-white cursor-pointer" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className={`flex justify-center items-center flex-col ${styles.background} text-[0.9rem] p-4`}>
                <hr className={`w-[92%] my-[0.4rem] border-0 h-[1px] ${styles.divider}`} />
                <h4 className={`m-[5px] pt-2 font-normal ${styles.text} text-center px-4`}>
                    © IEEE AU SB 2025. All Rights Reserved | Developed by{' '}
                    <a href="https://www.linkedin.com/in/vishvboda/" target="_blank" rel="noopener noreferrer" 
                       className={`${styles.subtext} underline hover:${styles.text}`}>
                        Vishv Boda
                    </a>
                    {' '}&{' '}
                    <a href="https://www.linkedin.com/in/deeppatelDW1631/" target="_blank" rel="noopener noreferrer"
                       className={`${styles.subtext} underline hover:${styles.text}`}>
                        Deep Patel
                    </a>
                    , IEEE AU SB
                </h4>
            </div>
        </section>
    );
};

export default Footer;

