document.addEventListener("DOMContentLoaded", function () {
    const upcomingCardContainer = document.getElementById("upcoming-card-container");
    const swiperWrapper = document.querySelector(".swiper-wrapper");
    const modal = document.getElementById("eventModal");
    const modalDetail = document.getElementById("modal-detail");
    const span = document.getElementsByClassName("close")[0];
    const upcomingLoader = document.getElementById("upcoming-loader");
    const pastLoader = document.getElementById("past-loader");

    function showLoader(loader) {
        loader.style.display = "block";
    }

    function hideLoader(loader) {
        loader.style.display = "none";
    }

    function closeModal() {
        const modalContent = document.querySelector(".modal-content");
        modalContent.classList.remove("zoomIn");
        modalContent.classList.add("zoomOut");
        modal.classList.add("fadeOut");
        setTimeout(() => {
            modal.style.display = "none";
            modal.classList.remove("fadeOut");
            document.body.style.overflow = "";
        }, 500);
    }

    function showModal(event) {
        // Set the modal image source
        document.getElementById("modal-image").src = event.eventPoster;
        
        // Build the modal details content
        let modalContentHTML = `
            <h2>${event.eventName}</h2>
            <p>${event.eventDescription}</p>
            <p><span style="font-weight: bold;">Date:</span> ${formatDate(event.eventDate)}</p>
            <p><span style="font-weight: bold;">Time:</span> ${event.startTime === event.endTime ? event.startTime : `${event.startTime} - ${event.endTime}`}</p>
            <p><span style="font-weight: bold;">Venue:</span> ${event.venue}</p>
        `;

        // Conditionally include the speaker section if event.speaker is not null
        if (event.speaker) {
            modalContentHTML += `<p><span style="font-weight: bold;">Speaker:</span> ${event.speaker}</p>`;
        }


        if (event.instaPostLink) {
            modalContentHTML += `<a class="link" href="${event.instaPostLink}">Instagram Post</a>`;
        }

        // Update the modal detail content
        modalDetail.innerHTML = modalContentHTML;
        
        // Display the modal
        modal.style.display = "block";
        const modalContent = document.querySelector(".modal-content");
        modalContent.classList.remove("zoomOut", "fadeOut");
        modalContent.classList.add("zoomIn");
        document.body.style.overflow = "hidden";
    }

    function createUpcomingEventCard(event) {
        const card = document.createElement("div");
        const eventDate = new Date(event.eventDate);
        const dateString = formatDate(event.eventDate);
        
        // Build the card's HTML content
        card.classList.add("cardDiv");
        card.innerHTML = `
            <div class="img">
                <img class="img2" src="${event.eventPoster}" alt="" loading="lazy">
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
                    ${event.speaker ? `
                        <div class="card-speaker-div">
                            <div class="upcomingEventCard-content">
                                <img src="Images/speaker.png" width="20px" alt="Speaker" loading="lazy">
                                <p>${event.speaker}</p>
                            </div>
                        </div>
                    ` : ''}
                    <div class="card-time-div">
                        <div class="upcomingEventCard-content">
                            <img src="Images/event-time.png" width="20px" alt="Time" loading="lazy">
                            <p>${event.startTime === event.endTime ? event.startTime : `${event.startTime} - ${event.endTime}`}</p>
                        </div>
                    </div>
                    <div class="card-venue-div">
                        <div class="upcomingEventCard-content">
                            <img src="Images/venue.png" width="20px" alt="Venue" loading="lazy">
                            <p>${event.venue}</p>
                        </div>
                    </div>
                </div>
                <a target="_blank" class="link" href="${event.registrationLink}">Register Now</a>
            </div>
        `;
        
        return card;
    }

    function createPastEventSlide(event) {
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");
        slide.innerHTML = `
            <div class="picture">
                <img src="${event.eventPoster}" alt="" loading="lazy">
            </div>
            <div class="detail">
                <h2 style="margin-bottom: 0.75rem; text-align: center; padding: 0 1rem;">${event.eventName}</h2>
                <button class="know-more-btn" data-event-id="${event.id}">Know more</button>
            </div>
        `;

        slide.querySelector(".know-more-btn").addEventListener("click", () => showModal(event));

        return slide;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;
    }

    function displayNoEventMessage(container) {
        container.innerHTML = ''; // Clear any existing content
        
        const noEventDiv = document.createElement("div");
        noEventDiv.classList.add("no-event-message");
        
        noEventDiv.innerHTML = container.id === "swiper-wrapper"
            ? "<p>No Past event found</p>"
            : `
                <div class="no-event-div">
                    <p class="no-event-div-p">No Upcoming Event</p>
                    <div class="no-event-div-text">
                        <p>Explore Our </p>
                        <a href="./pages/event-page.html" class="no-event-p">Completed Events >></a>
                    </div> 
                </div>
            `;
        
        container.appendChild(noEventDiv);
    }

    function hideArrows(selector) {
        document.querySelectorAll(selector).forEach(arrow => arrow.style.display = "none");
    }

    function showArrows(selector) {
        document.querySelectorAll(selector).forEach(arrow => arrow.style.display = "flex");
    }

    span.onclick = closeModal;

    window.onclick = (event) => {
        if (event.target === modal) {
            closeModal();
        }
    };

    showLoader(upcomingLoader);
    showLoader(pastLoader);

    axios
        .get("https://ieee-vishv.onrender.com/api/events")
        .then((response) => {
            const events = response.data;
            const currentDate = new Date();

            const upcomingEvents = events.filter(event => new Date(event.eventDate) >= currentDate);
            const pastEvents = events.filter(event => new Date(event.eventDate) < currentDate);

            upcomingEvents.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
            pastEvents.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));

            hideLoader(upcomingLoader);
            hideLoader(pastLoader);

            if (upcomingEvents.length === 0) {
                displayNoEventMessage(upcomingCardContainer);
                hideArrows(".arrow");
            } else {
                showArrows(".arrow");
                upcomingEvents.forEach(event => {
                    const upcomingCard = createUpcomingEventCard(event);
                    upcomingCardContainer.appendChild(upcomingCard);
                });
            }

            if (pastEvents.length === 0) {
                displayNoEventMessage(swiperWrapper);
                hideArrows(".swiper-button-next, .swiper-button-prev");
            } else {
                showArrows(".swiper-button-next, .swiper-button-prev");
                pastEvents.forEach(event => {
                    const pastSlide = createPastEventSlide(event);
                    swiperWrapper.appendChild(pastSlide);
                });

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
            }
        })
        .catch((error) => {
            console.error("There was an error in database connection!", error);
            hideLoader(upcomingLoader);
            hideLoader(pastLoader);
            displayNoEventMessage(upcomingCardContainer);
            displayNoEventMessage(swiperWrapper);
            hideArrows(".swiper-button-next, .swiper-button-prev");
            hideArrows(".arrow");
        });

    // Handle arrow clicks for scrolling
    function handleArrowClick(selector, direction) {
        document.querySelectorAll(selector).forEach((arrow) => {
            arrow.addEventListener("click", function () {
                const cardContainer = arrow.parentElement.querySelector(".card-container");
                const cardWidth = cardContainer.querySelector(".cardDiv").offsetWidth;
                cardContainer.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
            });
        });
    }

    handleArrowClick(".arrow.left", -1);
    handleArrowClick(".arrow.right", 1);
});
