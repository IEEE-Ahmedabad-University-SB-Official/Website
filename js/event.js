document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById('event-modal');
  const btn = document.getElementById('add-event-button');
  const span = document.getElementsByClassName('close')[0];
  const form = document.getElementById('event-form');
  const imagePreview = document.getElementById('image-preview');
  const imageUpload = document.getElementById('eventPoster');
  const dataTable = document.getElementById('data-table').querySelector('tbody');
  let currentPoster = null;

  btn.addEventListener('click', function () {
    modal.style.display = 'block';
  });

  span.addEventListener('click', function () {
    closeModal();
  });

  window.addEventListener('click', function (event) {
    if (event.target == modal) {
      closeModal();
    }
  });

  function closeModal() {
    modal.style.display = 'none';
    form.reset();
    document.getElementById('eventId').value = '';
    imagePreview.innerHTML = '';
    currentPoster = null;
  }

  function fetchData() {
    axios.get('http://localhost:3000/events')
      .then(response => {
        renderData(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  function renderData(data) {
    dataTable.innerHTML = '';
    data.forEach(row => {
      const tr = document.createElement('tr');
      const eventDate = new Date(row.eventDate);
      const dateString = eventDate.getDate().toString().padStart(2, '0') + '-' + (eventDate.getMonth() + 1).toString().padStart(2, '0') + '-' + eventDate.getFullYear();

      tr.innerHTML = `
        <td>${row.eventName}</td>
        <td style="max-width: 280px;">${row.eventDescription}</td>
        <td>${dateString}</td>
        <td>${row.speaker}</td>
        <td>${row.eventTime}</td>
        <td>${row.venue}</td>
        <td><a href="${row.registrationLink}" target="_blank">Register Here</a></td>
        <td><a href="${row.instaPostLink}" target="_blank">Instagram Post</a></td>
        <td><img src="./uploads/events/${row.eventPoster}" alt="event poster" style="width: 100px; height: auto;"></td>
        <td>
          <button onclick="editEvent(${row.id})">Edit</button>
          <button onclick="deleteEvent(${row.id})">Delete</button>
        </td>
      `;
      dataTable.appendChild(tr);
    });
  }

  window.editEvent = function (id) {
    axios.get(`http://localhost:3000/event/${id}`)
      .then(response => {
        const event = response.data;
        let dateString = '';

        if (event.eventDate) {
          const eventDate = new Date(event.eventDate);
          eventDate.setDate(eventDate.getDate() + 1); // Add 1 day to the leave date
          dateString = eventDate.toISOString().split('T')[0];
        }

        // const eventDate = new Date(event.eventDate);
        // const dateString = eventDate.toISOString().split('T')[0];
        document.getElementById('eventId').value = event.id;
        document.getElementById('eventName').value = event.eventName;
        document.getElementById('eventDescription').value = event.eventDescription;
        document.getElementById('speaker').value = event.speaker;
        document.getElementById('eventDate').value = dateString;
        document.getElementById('eventTime').value = event.eventTime;
        document.getElementById('venue').value = event.venue;
        document.getElementById('registrationLink').value = event.registrationLink;
        document.getElementById('instaPostLink').value = event.instaPostLink;
        document.getElementById('oldEventPoster').value = event.eventPoster;

        if (event.eventPoster) {
          currentPoster = event.eventPoster;
          const img = document.createElement('img');
          img.src = `./uploads/events/${event.eventPoster}`;
          img.style.maxWidth = '100%';
          img.style.maxHeight = '200px';
          imagePreview.innerHTML = '';
          imagePreview.appendChild(img);
        }

        modal.style.display = 'block';
      })
      .catch(error => console.error('Error fetching event details:', error));
  };

  window.deleteEvent = function (id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3000/event/${id}`)
          .then(response => {
            fetchData();
            Swal.fire(
              'Deleted!',
              'Your event has been deleted.',
              'success'
            );
          })
          .catch(error => console.error('Error deleting event:', error));
      }
    });
  };

  imageUpload.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = document.createElement('img');
        img.src = event.target.result;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '200px';
        imagePreview.innerHTML = '';
        imagePreview.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const formData = new FormData(this);
    const eventId = formData.get('eventId');

    if (!imageUpload.files.length && currentPoster) {
        formData.append('eventPoster', currentPoster);
    }

    if (eventId) {
        axios.post(`http://localhost:3000/update/${eventId}`, formData)
            .then(response => {
                Swal.fire({
                    title: 'Updated!',
                    text: 'Your event has been updated.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    closeModal(); // Close modal after SweetAlert is closed
                    fetchData(); // Reload the event data
                });
            })
            .catch(error => console.error('Error updating event:', error));
    } else {
        axios.post('http://localhost:3000/upload', formData)
            .then(response => {
                Swal.fire({
                    title: 'Added!',
                    text: 'Your event has been added.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    closeModal(); // Close modal after SweetAlert is closed
                    fetchData(); // Reload the event data
                });
            })
            .catch(error => console.error('Error uploading event:', error));
    }
});




  fetchData();
});




