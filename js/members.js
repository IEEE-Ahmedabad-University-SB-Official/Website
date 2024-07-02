document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById('member-modal');
  const btn = document.getElementById('add-member-button');
  const span = document.querySelector('.close');
  const form = document.getElementById('member-form');
  const imagePreview = document.getElementById('image-preview');
  const imageUpload = document.getElementById('profile_image');
  const dataTable = document.querySelector('#member-data-table tbody');
  let currentProfileImage = null;
  const departmentDropdown = document.getElementById('department');
  const positionDropdown = document.getElementById('position');

  btn.addEventListener('click', function () {
    modal.style.display = 'block';
  });

  span.addEventListener('click', closeModal);

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  function closeModal() {
    modal.style.display = 'none';
    form.reset();
    document.getElementById('memberId').value = '';
    imagePreview.innerHTML = '';
    currentProfileImage = null;
  }

  function fetchData() {
    axios.get('http://localhost:3000/members')
      .then(response => {
        renderData(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  // Function to update position options based on selected department
  function updatePositionOptions(department) {
    positionDropdown.innerHTML = ''; // Clear previous options

    if (department === 'OBs') {
      // If department is OBs, show specific positions
      const positions = ['Chairperson', 'Co - Chairperson', 'Secretary', 'Joint - Secretary', 'Treasurer', 'Faculty'];
      positions.forEach(position => {
        const option = document.createElement('option');
        option.value = position;
        option.textContent = position;
        positionDropdown.appendChild(option);
      });
    } else {
      // Otherwise, show general positions
      const positions = ['Head', 'Member'];
      positions.forEach(position => {
        const option = document.createElement('option');
        option.value = position;
        option.textContent = position;
        positionDropdown.appendChild(option);
      });
    }
  }

  // Event listener for department change
  departmentDropdown.addEventListener('change', function () {
    const selectedDepartment = this.value;
    updatePositionOptions(selectedDepartment);
  });


  function renderData(data) {
    dataTable.innerHTML = '';
    data.forEach(row => {
      // Format the leave_date if it exists
      const formattedLeaveDate = row.leave_date ? formatDate(row.leave_date) : '';

      const tr = document.createElement('tr');

      // Create the base content of the row
      tr.innerHTML = `
          <td>${row.name}</td>
          <td>${row.email}</td>
          <td>${row.enrollment_number}</td>
          <td>${row.contact_number}</td>
          <td>${row.join_year}</td>
          <td>${row.programme}</td>
          <td>${row.department}</td>
          <td>${row.position}</td>
        `;

      // Add Instagram profile icon if it exists
      const instagramTd = document.createElement('td');
      if (row.instagramProfile) {
        instagramTd.innerHTML = `<a class="linkIcon" href="${row.instagramProfile}" target="_blank" class="icon" id="instagram">
            <i class="fa-brands fa-instagram"></i></a>`;
      }
      tr.appendChild(instagramTd);

      // Add LinkedIn profile icon if it exists
      const linkedinTd = document.createElement('td');
      if (row.linkedinProfile) {
        linkedinTd.innerHTML = `<a class="linkIcon" href="${row.linkedinProfile}" target="_blank" class="icon" id="linkedin">
            <i class="fa-brands fa-linkedin"></i></a>`;
      }
      tr.appendChild(linkedinTd);

      // Add remaining columns: leave date, profile image, and action buttons
      tr.innerHTML += `
          <td class="leave-date">${formattedLeaveDate}</td> <!-- Display formatted leave_date -->
          <td><img src="./uploads/members/${row.profile_image}" alt="profile image" style="width: 100px; height: auto;"></td>
          <td>
            <button onclick="editMember(${row.id})">Edit</button>
            <button onclick="deleteMember(${row.id})">Delete</button>
          </td>
        `;

      // Append the row to the table
      dataTable.appendChild(tr);
    });
  }



  // Function to format date in "DD-MM-YYYY" format
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }



  window.editMember = function (id) {
    axios.get(`http://localhost:3000/member/${id}`)
      .then(response => {
        const member = response.data;
        let dateString = '';

        if (member.leave_date) {
          const leaveDate = new Date(member.leave_date);
          leaveDate.setDate(leaveDate.getDate() + 1); // Add 1 day to the leave date
          dateString = leaveDate.toISOString().split('T')[0];
        }

        document.getElementById('memberId').value = member.id;
        document.getElementById('name').value = member.name;
        document.getElementById('enrollment_number').value = member.enrollment_number;
        document.getElementById('email').value = member.email;
        document.getElementById('contact_number').value = member.contact_number;
        document.getElementById('join_year').value = member.join_year;
        document.getElementById('programme').value = member.programme;
        document.getElementById('department').value = member.department;
        // Update position options based on selected department
        updatePositionOptions(member.department);
        document.getElementById('position').value = member.position;
        document.getElementById('instagramProfile').value = member.instagramProfile;
        document.getElementById('linkedinProfile').value = member.linkedinProfile;
        document.getElementById('oldProfileImage').value = member.profile_image;
        document.getElementById('leave_date').value = dateString || ''; // Set leave date value or empty string if it doesn't exist

        if (member.profile_image) {
          currentProfileImage = member.profile_image;
          const img = document.createElement('img');
          img.src = `./uploads/members/${member.profile_image}`;
          img.style.maxWidth = '100%';
          img.style.maxHeight = '200px';
          imagePreview.innerHTML = '';
          imagePreview.appendChild(img);
        }

        modal.style.display = 'block';
      })
      .catch(error => console.error('Error fetching member details:', error));
  };



  window.deleteMember = function (id) {
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
        axios.delete(`http://localhost:3000/member/${id}`)
          .then(response => {
            fetchData();
            Swal.fire(
              'Deleted!',
              'Your member has been deleted.',
              'success'
            );
          })
          .catch(error => console.error('Error deleting member:', error));
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
    event.preventDefault();
    const formData = new FormData(this);
    const memberId = formData.get('memberId');
    const url = memberId ? `http://localhost:3000/update-member/${memberId}` : 'http://localhost:3000/upload-member';

    if (!imageUpload.files.length && currentProfileImage) {
      formData.append('profile_image', currentProfileImage);
    }

    axios.post(url, formData)
      .then(response => {
        const message = memberId ? 'updated' : 'added';
        Swal.fire({
          title: capitalizeFirstLetter(message) + '!',
          text: `Your member has been ${message}.`,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          closeModal();
          fetchData();
        });
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.message === 'Email already exists') {
          Swal.fire({
            title: 'Error!',
            text: 'This email is already used. Please try again with a different email.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else {
          console.error('Error uploading member:', error);
        }
      });
  });

  fetchData();
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.querySelector("#member-data-table tbody");
  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");
  const itemsPerPage = 10;
  let currentPage = 1;
  let members = [];

  // Function to fetch members data (example using Axios)
  async function fetchMembers() {
    try {
      const response = await axios.get('/api/members'); // Adjust the URL to your actual API endpoint
      members = response.data;
      displayPage(currentPage);
      updatePaginationControls();
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  }

  // Function to display a specific page of members
  function displayPage(page) {
    tableBody.innerHTML = ""; // Clear the table body
    const start = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    const pageMembers = members.slice(start, end);

    pageMembers.forEach((member, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${start + index + 1}</td>
        <td>${member.name}</td>
        <td>${member.email}</td>
        <td>${member.enrollment_number}</td>
        <td>${member.contact_number}</td>
        <td>${member.join_year}</td>
        <td>${member.programme}</td>
        <td>${member.department}</td>
        <td>${member.position}</td>
        <td><a href="${row.instagramProfile}" target="_blank" class="icon" id="instagram">
        <i class="fa-brands fa-instagram"></i></a></td>
        <td><a href="${row.linkedinProfile}" target="_blank" class="icon" id="linkedin">
        <i class="fa-brands fa-linkedin"></i></a></td>

        <td class="leave_date">${member.leave_date}</td>
        <td><img src="${member.profile_image}" alt="${member.name}" width="50"></td>
        <td>
          <button class="edit-btn" data-id="${member.id}">Edit</button>
          <button class="delete-btn" data-id="${member.id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  // Function to update the state of pagination controls
  function updatePaginationControls() {
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === Math.ceil(members.length / itemsPerPage);
  }

  // Event listeners for pagination buttons
  prevPageBtn.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      displayPage(currentPage);
      updatePaginationControls();
    }
  });

  nextPageBtn.addEventListener("click", function () {
    if (currentPage < Math.ceil(members.length / itemsPerPage)) {
      currentPage++;
      displayPage(currentPage);
      updatePaginationControls();
    }
  });

  // Fetch and display members data on page load
  fetchMembers();
});

