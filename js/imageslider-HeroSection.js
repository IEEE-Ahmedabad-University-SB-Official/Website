const carousel = document.querySelector(".carousel");
let carouselItems = document.querySelectorAll(".carousel__item");
const [btnLeftCarousel, btnRightCarousel] = document.querySelectorAll(
  ".carousel-button"
);
const circles = document.querySelectorAll(".circle"); // Get all circles
let carouselCount = carouselItems.length;
let pos = 0;
let translateX = 0;

// Event listener for the left button
btnLeftCarousel.addEventListener("click", (e) => {
  let calculate = pos > 0 ? (pos - 1) % carouselCount : carouselCount;

  // Update translateX and calculate new position
  if (pos > 0) translateX = pos === 1 ? 0 : translateX - 100.5;
  else if (pos <= 0) {
    translateX = 100.5 * (carouselCount - 1);
    calculate = carouselCount - 1;
  }

  console.log(pos);

  // Update position and slide items
  pos = slide({
    show: calculate,
    disable: pos,
    translateX: translateX
  });
});

// Event listener for the right button
btnRightCarousel.addEventListener("click", (e) => {
  let calculate = (pos + 1) % carouselCount;

  // Update translateX and calculate new position
  if (pos >= carouselCount - 1) {
    calculate = 0;
    translateX = 0;
  } else {
    translateX += 100.5;
  }

  // Update position and slide items
  pos = slide({
    show: calculate,
    disable: pos,
    translateX: translateX
  });
});


// Function to start the automatic slideshow
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    btnRightCarousel.click();
  }, 3300); // Interval set to 3300 milliseconds
}

// Function to stop the automatic slideshow
function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

// Function to handle the sliding of carousel items
function slide(options) {
  function active(_pos) {
    carouselItems[_pos].classList.toggle("active");
  }

  function inactive(_pos) {
    carouselItems[_pos].classList.toggle("active");
  }

  // Update active/inactive states
  inactive(options.disable);
  active(options.show);

  // Apply transform to each item based on the new position
  document.querySelectorAll(".carousel__item").forEach((item, index) => {
    if (index === options.show) {
      item.style.transform = `translateX(-${options.translateX}%) scale(1)`;
    } else {
      item.style.transform = `translateX(-${options.translateX}%) scale(0.9)`;
    }
  });

  return options.show;
}

// Touch and Mouse events for dragging
carousel.addEventListener("mousedown", startDrag);
carousel.addEventListener("touchstart", startDrag);

carousel.addEventListener("mousemove", drag);
carousel.addEventListener("touchmove", drag);

carousel.addEventListener("mouseup", endDrag);
carousel.addEventListener("touchend", endDrag);

// Start drag event
function startDrag(e) {
  isDragging = true;
  startX = e.pageX || e.touches[0].pageX; // Capture the start position
  stopAutoSlide(); // Stop automatic slideshow during drag
}

// Drag event
function drag(e) {
  if (!isDragging) return;
  endX = e.pageX || e.touches[0].pageX; // Capture the end position
  const diffX = startX - endX; // Calculate the distance moved
  if (Math.abs(diffX) > 50) { // If movement is significant (threshold: 50px)
    if (diffX > 0) {
      btnRightCarousel.click(); // Move to the next item
    } else {
      btnLeftCarousel.click(); // Move to the previous item
    }
    isDragging = false; // End dragging
  }
}

// End drag event
function endDrag(e) {
  isDragging = false; // End dragging
  startAutoSlide(); // Resume automatic slideshow
}

// Start the automatic slideshow
startAutoSlide();

// Add event listeners to pause and resume the slideshow on hover
carousel.addEventListener("mouseover", stopAutoSlide);
carousel.addEventListener("mouseout", startAutoSlide);



const video = document.querySelector('#myVideo');

if(video) {
  video.playbackRate = 1;
}