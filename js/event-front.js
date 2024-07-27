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

    span.onclick = function () {
        closeModal();
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            closeModal();
        }
    };

    showLoader(upcomingLoader);
    showLoader(pastLoader);

    axios
        .get("https://ieee-vishv-1.onrender.com/api/events/events")
        .then((response) => {
            let events = response.data;
            const currentDate = new Date();

            const upcomingEvents = events.filter(event => new Date(event.eventDate) >= currentDate);
            const pastEvents = events.filter(event => new Date(event.eventDate) < currentDate);

            upcomingEvents.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
            pastEvents.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));

            hideLoader(upcomingLoader);
            hideLoader(pastLoader);

            if (upcomingEvents.length === 0) {
                displayNoEventMessage(upcomingCardContainer);
                hideUpcomingArrows();
            } else {
                showUpcomingArrows();
                upcomingEvents.forEach((event) => {
                    const upcomingCard = createUpcomingEventCard(event);
                    upcomingCardContainer.appendChild(upcomingCard);
                });
            }

            if (pastEvents.length === 0) {
                displayNoEventMessage(swiperWrapper);
                hidePastArrows();
            } else {
                showPastArrows();
                pastEvents.forEach((event) => {
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
            hidePastArrows();
            hideUpcomingArrows();
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
        
            // Create the card structure
            card.classList.add("cardDiv");
            
            // Start building the card's HTML content
            let cardHTML = `
                <div class="img">
                    <img class="img2" src="${event.eventPoster}" alt="">
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
            `;
        
            // Conditionally include the speaker section if event.speaker is not null
            if (event.speaker) {
                cardHTML += `
                    <div class="card-speaker-div">
                        <div class="upcomingEventCard-content">
                            <img src="Images/speaker.png" width="20px" alt="Speaker">
                            <p class="upcomingEventCard-content-data">${event.speaker}</p>
                        </div>
                    </div>
                `;
            }
        
            // Include the time and venue sections (they are always displayed)
            cardHTML += `
                    <div class="card-time-div">
                        <div class="upcomingEventCard-content">
                            <img src="Images/event-time.png" width="20px" alt="Time">
                            <p class="upcomingEventCard-content-data">${event.eventTime}</p>
                        </div>
                    </div>
                    <div class="card-venue-div">
                        <div class="upcomingEventCard-content">
                            <img src="Images/venue.png" width="20px" alt="Venue">
                            <p class="upcomingEventCard-content-data">${event.venue}</p>
                        </div>
                    </div>
                </div>
                <a class="link" href="${event.registrationLink}">Register Now</a>
            `;
        
            // Set the inner HTML of the card element
            card.innerHTML = cardHTML;
        
            return card;
        }
        

    function createPastEventSlide(event) {
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");
        slide.innerHTML = `
            <div class="picture">
                <img src="${event.eventPoster}" alt="">
            </div>
            <div class="detail">
                <h2 style="margin-bottom: 0.75rem; text-align: center; padding: 0 1rem;">${event.eventName}</h2>
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

    function displayNoEventMessage(container) {
        container.innerHTML = ''; // Clear any existing content
        
        const noEventDiv = document.createElement("div");
        noEventDiv.classList.add("no-event-message");
        
        if(container.id === "swiper-wrapper") {
            noEventDiv.innerHTML = "<p>No Past event found</p>";
        } else if(container.id === "upcoming-card-container") {
            noEventDiv.innerHTML = "<p>No Upcoming event found</p>";
        }
        
        container.appendChild(noEventDiv);
    }
    

    function hideUpcomingArrows() {
        const arrows = document.querySelectorAll(".arrow");
        arrows.forEach((arrow) => {
            arrow.style.display = "none";
        });
    }

    function showUpcomingArrows() {
        const arrows = document.querySelectorAll(".arrow");
        arrows.forEach((arrow) => {
            arrow.style.display = "flex";
        });
    }
    function hidePastArrows() {
        const arrows = document.querySelectorAll(".swiper-button-next, .swiper-button-prev");
        arrows.forEach((arrow) => {
            arrow.style.display = "none";
        });
    }

    function showPastArrows() {
        const arrows = document.querySelectorAll(".swiper-button-next, .swiper-button-prev");
        arrows.forEach((arrow) => {
            arrow.style.display = "block";
        });
    }

    function showModal(event) {
        // Set the modal image source
        document.getElementById("modal-image").src = `${event.eventPoster}`;
        
        // Build the modal details content
        let modalContentHTML = `
            <h2>${event.eventName}</h2>
            <p>${event.eventDescription}</p>
            <p>Date: ${formatDate(event.eventDate)}</p>
            <p>Time: ${event.eventTime}</p>
            <p>Venue: ${event.venue}
        `;
    
        // Conditionally include the speaker section if event.speaker is not null
        if (event.speaker) {
            modalContentHTML += `<p>Speaker: ${event.speaker}</p>`;
        }

        if(event.instaPostLink){
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

    leftArrows.forEach((leftArrow) => {
        leftArrow.addEventListener("click", function () {
            const cardContainer = leftArrow.parentElement.querySelector(".card-container");
            const cardWidth = cardContainer.querySelector(".cardDiv").offsetWidth; // Calculate card width dynamically
            cardContainer.scrollBy({ left: -cardWidth, behavior: "smooth" });
        });
    });

    rightArrows.forEach((rightArrow) => {
        rightArrow.addEventListener("click", function () {
            const cardContainer = rightArrow.parentElement.querySelector(".card-container");
            const cardWidth = cardContainer.querySelector(".cardDiv").offsetWidth; // Calculate card width dynamically
            cardContainer.scrollBy({ left: cardWidth, behavior: "smooth" });
        });
    });
});
