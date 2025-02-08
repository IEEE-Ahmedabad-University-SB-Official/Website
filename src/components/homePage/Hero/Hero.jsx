import React, { useEffect } from 'react';
import styles from './Hero.module.css';  // Update the import to use CSS modules

const Hero = () => {
    useEffect(() => {
        // Typing effect - Fixed to prevent double text
        const text = "Ahmedabad University Student Branch";
        const typingText = document.getElementById("typing-text");
        if (!typingText) return; // Guard clause
        
        let index = 0;
        let isAdding = true;
        typingText.textContent = ''; // Clear initial text

        function typeWriter() {
            // Only proceed if element exists
            if (!typingText) return;
            
            if (isAdding) {
                if (index < text.length) {
                    typingText.textContent = text.substring(0, index + 1);
                    index++;
                    setTimeout(typeWriter, 100);
                } else {
                    setTimeout(() => {
                        isAdding = false;
                        typeWriter();
                    }, 1500);
                }
            } else {
                if (index > 0) {
                    typingText.textContent = text.substring(0, index);
                    index--;
                    setTimeout(typeWriter, 100);
                } else {
                    isAdding = true;
                    setTimeout(typeWriter, 500);
                }
            }
        }

        // Canvas Matrix effect
        const setupCanvas = () => {
            const canvas = document.getElementById('myCanvas');
            const ctx = canvas.getContext('2d');

            const resizeCanvas = () => {
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
            };

            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            const letters = 'ABCDEFGHIJKLMNOPQRSTUVXYZ'.repeat(6).split('');
            const fontSize = 10;
            const columns = canvas.width / fontSize;
            const drops = Array(Math.floor(columns)).fill(1);

            function draw() {
                ctx.fillStyle = 'rgba(0, 0, 0, .1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                drops.forEach((drop, i) => {
                    const text = letters[Math.floor(Math.random() * letters.length)];
                    const color = Math.random() < 0.9 ? '#0080FF' : '#FFFFFF';
                    ctx.fillStyle = color;
                    ctx.fillText(text, i * fontSize, drop * fontSize);
                    drops[i]++;
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
                        drops[i] = 0;
                    }
                });
            }

            const interval = setInterval(draw, 33);
            return () => clearInterval(interval);
        };

        typeWriter();
        const cleanupCanvas = setupCanvas();

        return () => {
            cleanupCanvas();
            window.removeEventListener('resize', setupCanvas);
        };
    }, []);

    return (
        <section className={styles.heroSection} id="Home">
            <div className={styles.HerogridContainer}>
                <div className={styles.Section} id="heroSection">
                    <div className={styles.videoHeroSection}>
                        <canvas id="myCanvas" className={styles.myCanvas}></canvas>
                        <img className={styles.imageBackGround} src="./Images/pattern.png" alt="background pattern" />
                    </div>

                    <div className={styles.Verticalline}>
                        <div className={styles.vl}></div>
                    </div>
                    <div className={styles.circles}>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <div key={num} className={styles.circle} id={`circle${num}`}></div>
                        ))}
                    </div>
                    <div className={styles.heroContent}>
                        <div className={styles.Heading}>
                            <div className={styles['ieee-ausb-div']}>
                                <div id="headingTextIEEE" className={styles['letter-heading']}>
                                    {['I', 'E', 'E', 'E'].map((letter, index) => (
                                        <span key={index} className={styles.letter} style={{ animationDelay: `${index * 0.1}s` }}>
                                            {letter}
                                        </span>
                                    ))}
                                </div>
                                <span className={styles.spacer}></span>
                                <div id="headingTextAUSB" className={styles['letter-heading']}>
                                    {['A', 'U', 'S', 'B'].map((letter, index) => (
                                        <span key={index} className={styles.letter} style={{ animationDelay: `${(index + 5) * 0.1}s` }}>
                                            {letter}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <p id="subheadingText" className={styles.subheadingText}>
                                Institute of Electrical and Electronics Engineers
                            </p>
                            <div className={styles['typing-container']}>
                                <span id="typing-text"></span>
                                <span id="cursor" className={styles.cursor}>|</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;