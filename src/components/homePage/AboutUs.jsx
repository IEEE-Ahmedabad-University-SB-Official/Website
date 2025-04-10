import React from 'react';
import aboutImage from '../../assets/Images/aboutAu7.jpg';

const AboutUs = () => {
    return (
        <section 
            id="aboutUs" 
            className="relative pt-16 pb-8 md:py-32 bg-gradient-to-br from-gray-50 to-gray-100"
        >
            <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-center">
                    {/* Image Section */}
                    <div className="relative aspect-square mb-16 lg:mb-0 max-w-[600px] mx-auto">
                        <div className="absolute inset-0 bg-[#0088cc]/20 transform -rotate-6 rounded-3xl z-0" />
                        <div className="absolute inset-0 bg-gray-100 transform rotate-3 rounded-3xl z-0" />
                        <div className="relative h-full w-full overflow-hidden rounded-3xl border-4 border-[#0088cc]/30">
                            <img 
                                id="aboutImage" 
                                src={aboutImage} 
                                alt="About AU" 
                                className="w-full h-full object-cover object-center transform hover:scale-105 transition-all duration-500 z-10"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent" />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="relative">
                        
                        <h2 className="text-base md:text-xl font-semibold text-[#0088cc] tracking-wider uppercase mb-0 relative">
                            About Us
                        </h2>
                        
                        <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-0 relative leading-tight">
                            Welcome To IEEE 
                            <span className="block text-[#0088cc] mb-4">Ahmedabad University!</span>
                        </h3>

                        <div className="space-y-4 text-gray-600">
                            <p className="text-base md:text-xl leading-relaxed">
                                Ahmedabad University is a private, non-profit research university that offers students a liberal education focused on interdisciplinary learning and research thinking. Our liberal arts education molds independent thinkers and compassionate leaders who go on to engage innovatively with the complex challenges of our societies.
                            </p>
                            <p className="text-base md:text-xl leading-relaxed">
                                Ahmedabad University was established in 2009 by the Ahmedabad Education Society to offer a world-class academic experience in one of India's most vibrant and livable cities. With a centrally located campus and internationally renowned faculty, it offers one of the most stimulating academic environments in the country.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;