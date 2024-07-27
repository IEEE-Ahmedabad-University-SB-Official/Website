// Get the DOM elements for the image carousel
const wrapper = document.querySelector(".mobile-wrapper"),
      carousel = document.querySelector(".carousel"),
      figures = document.querySelectorAll("figure"),
      buttons = document.querySelectorAll(".button");

let imageIndex = 1,
    intervalId,
    startX, // Start position for touch events
    endX;   // End position for touch events

// Define function to start automatic image slider
const autoSlide = () => {
    // Start the slideshow by calling slideImage() every 2.5 seconds
    intervalId = setInterval(() => slideImage(++imageIndex), 2500);
};

// Call autoSlide function on page load
autoSlide();

// A function that updates the carousel display to show the specified image
const slideImage = () => {
    // Calculate the updated image index
    imageIndex = imageIndex === figures.length ? 0 : imageIndex < 0 ? figures.length - 1 : imageIndex;
    // Update the carousel display to show the specified image
    carousel.style.transform = `translateX(-${imageIndex * 100}%)`;
};

// A function that updates the carousel display to show the next or previous image
const updateClick = (e) => {
    // Stop the automatic slideshow
    clearInterval(intervalId);
    // Calculate the updated image index based on the button clicked
    imageIndex += e.target.id === "next" ? 1 : -1;
    slideImage(imageIndex);
    // Restart the automatic slideshow
    autoSlide();
};

// Add event listeners to the navigation buttons
buttons.forEach((button) => button.addEventListener("click", updateClick));

// Add mouseover event listener to wrapper element to stop auto sliding
wrapper.addEventListener("mouseover", () => clearInterval(intervalId));
// Add mouseleave event listener to wrapper element to start auto sliding again
wrapper.addEventListener("mouseleave", autoSlide);

// Add touch event listeners to handle swipe gestures
wrapper.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});

wrapper.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    const swipeThreshold = 50; // Minimum distance to consider as a swipe
    const swipeDistance = endX - startX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        // If swipe distance is positive, swipe left; if negative, swipe right
        imageIndex += swipeDistance > 0 ? -1 : 1;
        slideImage();
    }
});
