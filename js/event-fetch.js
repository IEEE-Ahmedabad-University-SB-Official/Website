async function fetchEvents() {
    try {
        const response = await fetch('https://ieee-vishv.onrender.com/api/events');
        const events = await response.json();
        const timelineList = document.querySelector('.timeline');

        // Sort events by date in ascending order
        events.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));

        // Add the events to the timeline
        events.forEach(event => {
            const eventDate = new Date(event.eventDate);
            const dateString = eventDate.getDate().toString().padStart(2, '0') + '-' + (eventDate.getMonth() + 1).toString().padStart(2, '0') + '-' + eventDate.getFullYear();

            const eventCard = document.createElement('li');
            eventCard.classList.add('timeline-event');

            let cardContent = `
            <div class="event-card">
                <img src="${event.eventPoster}" alt="${event.eventName} Poster">
                <div class="event-card-details">
                    <h3>${event.eventName}</h3>
                    <p>${event.eventDescription.length > 100 ? event.eventDescription.substring(0, 100) + '...' : event.eventDescription}</p>
                    ${event.startTime === event.endTime ? 
                        `<p><span style="font-weight:600">Time: </span>${event.startTime}</p>` :
                        `<p><span style="font-weight:600">Time: </span>${event.startTime} - ${event.endTime}</p>`
                    }
                    <p><span style="font-weight:600">Speaker: </span>${event.speaker}</p>
                    <p><span style="font-weight:600">Venue: </span>${event.venue}</p>
                    <button class="know-more" onclick="openModal(
                        '${event.eventName}', 
                        '${encodeURIComponent(event.eventDescription.replace(/\n/g, '\\n').replace(/"/g, '\\"'))}', 
                        '${event.eventPoster}', 
                        '${event.speaker}', 
                        '${dateString}', 
                        '${event.startTime}', 
                        '${event.endTime}', 
                        '${event.venue}', 
                        '${event.instaPostLink}'
                    )">Know More</button>
                </div>
            </div>
            <div class="event-date">${dateString}</div>
            `;

            eventCard.innerHTML = cardContent;
            timelineList.appendChild(eventCard);
        });
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

function closeModal() {
    const modal = document.getElementById('eventModal');
    const modalContent = document.querySelector(".modal-content");
    modalContent.classList.remove("zoomIn");
    modalContent.classList.add("zoomOut");
    modal.classList.add("fadeOut");
    
    // Re-enable pointer events for the card container
    document.querySelector('.timeline-container').style.pointerEvents = 'auto';
    
    setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove("fadeOut");
        document.body.style.overflow = "";
        modalContent.classList.remove("zoomOut");
    }, 500);
}

function openModal(eventName, eventDescription, eventPoster, speaker, eventDate, startTime, endTime, venue, instaPostLink) {
    document.getElementById('modalEventName').innerText = eventName;
    document.getElementById('modalEventImage').src = eventPoster;
    document.getElementById('modalEventDescription').innerText = decodeURIComponent(eventDescription).replace(/\\n/g, '\n');
    document.getElementById('modalSpeaker').innerText = speaker;
    document.getElementById('modalEventDate').innerText = eventDate;
    document.getElementById('modalEventTime').innerText = startTime === endTime ? startTime : startTime + ' - ' + endTime;
    document.getElementById('modalVenue').innerText = venue;
    document.getElementById('modalInstaPost').href = instaPostLink;

    const modal = document.getElementById('eventModal');
    modal.style.display = 'flex';

    const modalContent1 = document.querySelector(".modal-content");
    modalContent1.classList.remove("zoomOut", "fadeOut");
    modalContent1.classList.add("zoomIn");
    document.body.style.overflow = "hidden";

    // Disable pointer events for the card container
    document.querySelector('.timeline-container').style.pointerEvents = 'none';
}



document.getElementById('modalClose').onclick = function () {
    closeModal();
    // document.getElementById('eventModal').style.display = 'none'; 
}

window.onclick = function (event) {
    if (event.target == document.getElementById('eventModal')) {
        closeModal();
        // document.getElementById('eventModal').style.display = 'none'; 
    }
}

fetchEvents();
