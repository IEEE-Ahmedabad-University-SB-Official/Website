import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

// import images and videos
import auVideo from '../../assets/Images/au_video.mp4';
import seas from '../../assets/Images/seas.png';
import sas from '../../assets/Images/sas.jpeg';
import amsom from '../../assets/Images/amsom.jpeg';
import uc from '../../assets/Images/uc.jpg';

const AuGlimpes = () => {
  return (
    <section className="relative py-20">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-16">
        Glimpse of Ahmedabad University
      </h1>

      {/* Main Container with 90% width */}
      <div className="relative w-[80%] mx-auto">
        {/* Video Container */}
        <div className="relative w-full mx-auto rounded-xl overflow-hidden z-0">
          {/* Video */}
          <video 
            className="w-full h-full object-cover"
            autoPlay 
            loop 
            muted
            src={auVideo} 
            type="video/mp4"
          />

          {/* Video Overlay */}
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Virtual Tour Button */}
          <a 
            href="https://ahduni.edu.in/virtual-tour/" 
            target="_blank"
            rel="noopener noreferrer" 
            className="absolute top-6 right-6 flex items-center gap-2 bg-white/90 hover:bg-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 z-10"
          >
            <span className="font-medium text-gray-800">Virtual Tour</span>
            <FaArrowRight className="text-blue-600" />
          </a>

          
        </div>

        {/* Images Grid Container - Separate from video */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-[80%] z-10">
          <div className="flex justify-between">
            {[
              { src: seas, title: "School of Engineering & Applied Sciences" },
              { src: sas, title: "School of Arts & Sciences" },
              { src: amsom, title: "Amrut Mody School of Management" },
              { src: uc, title: "University Centre" }
            ].map((image, index) => (
              <div 
                key={index} 
                className="relative w-[23%] rounded-2xl shadow-lg overflow-hidden group isolate"
              >
                {/* Image */}
                <img 
                  src={image.src} 
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Hover Overlay with Title - Full height container */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <h3 className="text-white text-center text-xl font-bold px-4">
                    {image.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spacer div to push content below */}
        {/* <div className="h-[275px]"></div> */}
      </div>
    </section>
  );
};

export default AuGlimpes;