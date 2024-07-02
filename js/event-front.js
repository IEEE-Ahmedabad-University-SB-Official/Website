document.addEventListener("DOMContentLoaded", function () {
    const upcomingCardContainer = document.getElementById("upcoming-card-container");
    const swiperWrapper = document.querySelector(".swiper-wrapper");
    const modal = document.getElementById("eventModal");
    const modalDetail = document.getElementById("modal-detail");
    const span = document.getElementsByClassName("close")[0];

    span.onclick = function () {
        closeModal();
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            closeModal();
        }
    };

    // Fetch events from the server
    axios
        .get("http://localhost:3000/events")
        .then((response) => {
            let events = response.data;
            const currentDate = new Date();

            // Separate upcoming and past events
            const upcomingEvents = events.filter(event => new Date(event.eventDate) >= currentDate);
            const pastEvents = events.filter(event => new Date(event.eventDate) < currentDate);

            // Sort upcoming events by date (earliest first)
            upcomingEvents.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

            // Sort past events by date (latest first)
            pastEvents.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));

            // Append sorted upcoming events
            upcomingEvents.forEach((event) => {
                const upcomingCard = createUpcomingEventCard(event);
                upcomingCardContainer.appendChild(upcomingCard);
            });

            // Append sorted past events
            pastEvents.forEach((event) => {
                const pastSlide = createPastEventSlide(event);
                swiperWrapper.appendChild(pastSlide);
            });

            // Initialize Swiper after slides are added
            new Swiper(".mySwiper", {
                effect: "cards",
                grabCursor: true,
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
                simulateTouch: false,
                slidesPerView: 1,
                centeredSlides: true,
                slideToClickedSlide: true,
            });
        })
        .catch((error) => {
            console.error("There was an error!", error);
        });

    function createUpcomingEventCard(event) {
        const card = document.createElement("div");
        const eventDate = new Date(event.eventDate);
        const dateString =
            eventDate.getDate().toString().padStart(2, "0") +
            "-" +
            (eventDate.getMonth() + 1).toString().padStart(2, "0") +
            "-" +
            eventDate.getFullYear();

        card.classList.add("card");
        card.innerHTML = `
            <div class="img">
                <img class="img2" src="uploads/events/${event.eventPoster}" alt="">
            </div>
            <div class="content">
                <div class="card-date-div">
                    <div class="upcomingEventCard-content">
                        <p class="upcomingEventCard-content-heading"></p>
                        <p class="upcomingEventCard-content-data">${dateString}</p>
                    </div>
                </div>
                <h2>${event.eventName}</h2>
                <div class="para">
                    <p>${event.eventDescription}</p>
                </div>
                
                <div class="check">
                    <div class="card-speaker-div">
                        <div class="upcomingEventCard-content">
                            <img src="Images/speaker.png" width="24px">
                            <p class="upcomingEventCard-content-data">${event.speaker}</p>
                        </div>
                    </div>

                    <div class="card-time-div">
                        <div class="upcomingEventCard-content">
                            <img src="Images/event-time.png" width="24px">
                            <p class="upcomingEventCard-content-data"> ${event.eventTime}</p>
                        </div>
                    </div>
                    <div class="card-veneu-div">
                        <div class="upcomingEventCard-content">
                            <img src="Images/venue.png" width="24px">
                            <p class="upcomingEventCard-content-data" >${event.venue}</p>
                        </div>
                    </div>
                </div>
                <a class="link" href="${event.registrationLink}">Register Now</a>
            </div>
        `;
        return card;
    }

    function createPastEventSlide(event) {
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");
        slide.innerHTML = `
            <div class="picture">
                <img src="uploads/events/${event.eventPoster}" alt="">
            </div>
            <div class="detail">
                <h2 style="margin-bottom: 0.75rem; text-align: center;">${event.eventName}</h2>
                <button class="know-more-btn" data-event-id="${event.id}">Know more</button>
            </div>
        `;

        slide
            .querySelector(".know-more-btn")
            .addEventListener("click", function () {
                showModal(event);
            });

        return slide;
    }

    function showModal(event) {
        document.getElementById("modal-image").src = `uploads/events/${event.eventPoster}`;
        modalDetail.innerHTML = `
            <h2>${event.eventName}</h2>
            <p>${event.eventDescription}</p>
            <p>Speaker: ${event.speaker}</p>
            <p>Date: ${formatDate(event.eventDate)}</p>
            <p>Time: ${event.eventTime}</p>
            <p>Venue: ${event.venue}</p>
            <a class="link" href="${event.instaPostLink}">Instagram Post</a>
        `;
        modal.style.display = "block";
        const modalContent = document.querySelector(".modal-content");
        modalContent.classList.remove("zoomOut", "fadeOut"); // Remove previous animation classes
        modalContent.classList.add("zoomIn");
        document.body.style.overflow = "hidden"; // Disable scrolling
    }

    function closeModal() {
        const modalContent = document.querySelector(".modal-content");
        modalContent.classList.remove("zoomIn"); // Remove the zoom-in animation class
        modalContent.classList.add("zoomOut"); // Add the zoom-out animation class
        modal.classList.add("fadeOut"); // Add fade-out animation to modal
        setTimeout(() => {
            modal.style.display = "none";
            modal.classList.remove("fadeOut"); // Remove fade-out animation class
            document.body.style.overflow = ""; // Re-enable scrolling
        }, 500); // Match this delay to the animation duration
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return (
            date.getDate().toString().padStart(2, "0") +
            "-" +
            (date.getMonth() + 1).toString().padStart(2, "0") +
            "-" +
            date.getFullYear()
        );
    }

    const leftArrows = document.querySelectorAll(".arrow.left");
    const rightArrows = document.querySelectorAll(".arrow.right");
    const cardWidth = 770; // Set this to the width of your cards

    // Event listeners for left and right arrows
    leftArrows.forEach((leftArrow) => {
        leftArrow.addEventListener("click", function () {
            const cardContainer = leftArrow.parentElement.querySelector(".card-container");
            cardContainer.scrollBy({ left: -cardWidth, behavior: "smooth" });
        });
    });

    rightArrows.forEach((rightArrow) => {
        rightArrow.addEventListener("click", function () {
            const cardContainer = rightArrow.parentElement.querySelector(".card-container");
            cardContainer.scrollBy({ left: cardWidth, behavior: "smooth" });
        });
    });
});
