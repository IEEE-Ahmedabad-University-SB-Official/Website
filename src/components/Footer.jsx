import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './Footer.css'; 
import { MdEmail } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import auLogo from "../assets/Images/AU_logo.webp"
import ieeelogo from "../assets/Images/IEEE-LOGO-WHITE.png"

const Footer = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
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
        <section className="FooterSection">
            <div className="textContent">
                <div className="footerSection" id="footer">
                    <div className="footerClass">
                        <div className="OurGoalsSection">
                            <div id="headerOurGoals">
                                <p>Our Goals</p>
                            </div>
                            <div id="OurGoalsDescription">
                                <p>At IEEE Ahmedabad University Student Branch (IEEE AU SB), we are dedicated to fostering a vibrant community of innovators, engineers, and tech enthusiasts by promoting technological excellence, facilitating professional growth, building a collaborative network, enhancing learning opportunities, fostering innovation and creativity, and engaging with the community.</p>
                            </div>
                            <div id="socialLinks">
                                <a target="_blank" rel="noopener noreferrer" href="mailto:ieee.sb@ahduni.edu.in">
                                    <MdEmail size={18}/>
                                </a>
                                <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/ieee_ausb?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">
                                    <FaInstagram size={18} />
                                </a>
                                <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/company/ahmedabad-university-ieee-sb/">
                                    <FaLinkedin size={18} />
                                </a>
                            </div>
                        </div>
                        <div className="VerticallineFooter">
                            <div></div>
                        </div>
                        <div className="siteMap">
                            <div id="SiteMapHeader">
                                <p>Site map</p>
                            </div>
                            <div id="SiteMapContent">
                                <a href="#Home">Home</a>
                                <a href="#aboutUs">About Us</a>
                                <a href="/pages/event-page.html">Events</a>
                                <a href="./pages/commitee-page.html">Committee</a>
                                <a href="#contactUs">Contact Us</a>
                            </div>
                        </div>
                        <div className="ContactUsSection">
                            <div className="ContactUsHeader">
                                <p>Contact Us</p>
                            </div>
                            <div className="ContactUsContent">
                                <div id="emailSection">
                                    <MdEmail />
                                    <a target="_blank" rel="noopener noreferrer" href="mailto:ieee.sb@ahduni.edu.in">
                                        Email: ieee.sb@ahduni.edu.in
                                    </a>
                                </div>
                                <div id="addressSection">
                                    <FaMapMarkerAlt />
                                    <p>Address:<br />Ahmedabad University<br />Navrangpura<br />Ahmedabad-380009</p>
                                </div>
                            </div>
                        </div>
                        <div className="GetUpdates">
                            {loading && <div id="loader" className="loader"></div>}
                            <div className="GetUpdatesHeader">
                                <p>Get Updates</p>
                            </div>
                            <div className="GetUpdatesContent" style={{ opacity: loading ? 0.3 : 1 }}>
                                <div id="yourNameButton">
                                    <div><FaUser color='black'/></div>
                                    <input 
                                        type="text" 
                                        placeholder="Your name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div id="yourEmailButton">
                                    <div><MdEmail color='black'/></div>
                                    <input 
                                        type="email" 
                                        placeholder="Your email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                                <div id="Submitbutton">
                                    <button type="button" onClick={handleSubmit}>
                                        Get Updates →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="imgs">
                    <a href="/">
                        <img className="ieee-footer" src={ieeelogo} alt="IEEE Logo" />
                    </a>
                    <a target="_blank" rel="noopener noreferrer" href="https://ahduni.edu.in/">
                        <img className="au-footer" src={auLogo} alt="AU Logo" />
                    </a>
                </div>
            </div>
            <div className="copyrightSection">
                <hr className="nav-line3" />
                <div className="bottom-div">
                    <h4>
                        © IEEE AU SB 2024. All Rights Reserved | Developed by{' '}
                        <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/vishv-boda-806ab5289/">
                            Vishv Boda
                        </a>{' '}
                        &{' '}
                        <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/deeppatelDW1631/">
                            Deep Patel
                        </a>
                        , IEEE AU SB
                    </h4>
                </div>
            </div>
        </section>
    );
};

export default Footer;
