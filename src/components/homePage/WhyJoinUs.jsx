import React from 'react';
import { FaLightbulb, FaNetworkWired, FaUsers, FaBookReader, FaBriefcase, FaHandsHelping, FaSmile } from 'react-icons/fa';

const WhyJoinUs = () => {
    const benefits = [
        {
            icon: <FaLightbulb />,
            title: "Skill Development",
            description: "Gain hands-on experience in the latest technologies through workshops, training programs, and projects."
        },
        {
            icon: <FaNetworkWired />,
            title: "Networking Opportunities",
            description: "Connect with industry leaders, experienced professionals, and fellow students who share your interests and aspirations."
        },
        {
            icon: <FaUsers />,
            title: "Leadership Experience",
            description: "Take on leadership roles in organizing events, managing projects, and leading teams, all of which boost your resume and professional profile."
        },
        {
            icon: <FaBookReader />,
            title: "Exclusive Resources",
            description: "Access a wide range of IEEE resources, including technical papers, industry publications, and online courses."
        },
        {
            icon: <FaBriefcase />,
            title: "Career Advancement",
            description: "Enhance your career prospects with certifications and recognition from prestigious organizations like Amazon, Microsoft, and Nvidia."
        },
        {
            icon: <FaHandsHelping />,
            title: "Community Impact",
            description: "Contribute to meaningful projects that address real-world challenges and make a positive impact on society."
        },
        {
            icon: <FaSmile />,
            title: "Fun & Engagement",
            description: "Participate in fun events, competitions, and social activities that make learning enjoyable and memorable."
        }
    ];

    return (
        <section className="py-8 pb-8 md:py-14 bg-gray-50">
            <div className="max-w-[95%] mx-auto px-4 pl-8 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-8 md:mb-16">
                <h1
                    className="text-3xl md:text-5xl text-center font-extrabold text-gray-900 leading-[0.8] tracking-tight uppercase past-event-head mb-8 md:mb-16"
                    style={{
                    textShadow: `
                        5px 5px rgba(128, 128, 128, 0.4),
                        10px 10px rgba(128, 128, 128, 0.2)
                    `
                    }}
                >
                    Why join us?
                </h1>
                </div>

                {/* Benefits Grid */}
                <div className="flex flex-wrap justify-center gap-12">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="relative w-[380px]"
                        >
                            {/* Icon Circle */}
                            <div className="absolute -left-6 -top-6 w-[4.5rem] h-[4.5rem] z-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-[#0088cc] bg-opacity-10 flex items-center justify-center">
                                    <div className="text-[#0088cc] text-3xl">
                                        {benefit.icon}
                                    </div>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="relative pl-6 pt-6 h-[175px] pb-6 pr-6 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                                {/* Content */}
                                <h3 className="text-xl text-center font-semibold text-gray-900 mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 text-center leading-relaxed text-sm">
                                    {benefit.description}
                                </p>

                                {/* Curved Line Connector */}
                                <div className="absolute -left-4 top-4 w-4 h-8 overflow-hidden">
                                    <div className="w-8 h-8 border-2 border-dashed border-gray-300 rounded-full border-l-0 border-b-0"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyJoinUs;