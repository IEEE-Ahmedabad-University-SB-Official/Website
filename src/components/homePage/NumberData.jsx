import React from 'react';
import { useEffect, useState } from 'react';
import { FaChartLine, FaUsers } from 'react-icons/fa';
import { MdEvent } from "react-icons/md";

const NumberData = () => {
    const [animatedNumbers, setAnimatedNumbers] = useState({
        achievements: 0,
        members: 0,
        events: 0
    });

    const finalNumbers = {
        achievements: 12,
        members: 33,
        events: 34
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    animateNumbers();
                }
            },
            { threshold: 0.5 }
        );

        const section = document.getElementById('achievements');
        if (section) observer.observe(section);

        return () => {
            if (section) observer.unobserve(section);
        };
    }, []);

    const animateNumbers = () => {
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            
            setAnimatedNumbers({
                achievements: Math.round((finalNumbers.achievements * currentStep) / steps),
                members: Math.round((finalNumbers.members * currentStep) / steps),
                events: Math.round((finalNumbers.events * currentStep) / steps)
            });

            if (currentStep === steps) {
                clearInterval(timer);
            }
        }, interval);
    };

    const stats = [
        {
            icon: <FaChartLine className="w-8 h-8 md:w-12 md:h-12" />,
            number: animatedNumbers.achievements,
            label: "ACHIEVEMENTS",
            suffix: "+"
        },
        {
            icon: <FaUsers className="w-8 h-8 md:w-12 md:h-12" />,
            number: animatedNumbers.members,
            label: "MEMBERS"
        },
        {
            icon: <MdEvent className="w-8 h-8 md:w-12 md:h-12" />,
            number: animatedNumbers.events,
            label: "EVENTS",
            suffix: "+"
        }
    ];

    return (
        <section 
            id="achievements" 
            className="py-8 md:py-24 bg-white"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {stats.map((stat, index) => (
                        <div 
                            key={index}
                            className="flex flex-col items-center"
                        >
                            {/* Circular Progress */}
                            <div className="relative w-36 h-36 md:w-48 md:h-48 mb-6">
                                {/* Outer Circle */}
                                <div className="absolute inset-0 rounded-full border-[5px] border-gray-100" />
                                
                                {/* Blue Progress Circle */}
                                <div className="absolute inset-0 rounded-full border-[5px] border-[#0088cc] border-l-transparent border-r-transparent transform -rotate-45 md:border-b-[8px] md:border-t-[8px]" />
                                
                                {/* Inner Content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    {/* Icon */}
                                    <div className="text-[#0088cc] mb-2">
                                        {stat.icon}
                                    </div>
                                    
                                    {/* Number */}
                                    <div className="flex items-baseline">
                                        <span className="text-4xl font-bold text-gray-800">
                                            {stat.number}
                                        </span>
                                        {stat.suffix && (
                                            <span className="text-2xl font-semibold text-gray-800">
                                                {stat.suffix}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Label */}
                            <h3 className="text-base md:text-2xl font-medium text-gray-600 tracking-wide">
                                {stat.label}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NumberData;