document.addEventListener("DOMContentLoaded", function () {
    const text = "Ahmedabad University Student Branch";
    const typingText = document.getElementById("typing-text");
    let index = 0;
    let isAdding = true;

    function typeWriter() {
        if (isAdding) {
            if (index < text.length) {
                typingText.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 100); // Adjust typing speed here (milliseconds)
            } else {
                setTimeout(() => isAdding = false, 1500); // Wait for 2 seconds before starting to erase
                setTimeout(typeWriter, 1500); // Adjust delay to match the wait time
            }
        } else {
            if (index > 0) {
                index--;
                typingText.textContent = text.substring(0, index);
                setTimeout(typeWriter, 100); // Adjust erasing speed here (milliseconds)
            } else {
                isAdding = true;
                setTimeout(typeWriter, 500); // Wait for a while before restarting typing
            }
        }
    }

    typeWriter(); // Start the typing process initially
});
