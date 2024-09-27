document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById('member-modal');
  const btn = document.getElementById('add-member-button');
  const span = document.querySelector('.close');
  const form = document.getElementById('member-form');
  const imagePreview = document.getElementById('image-preview');
  const imageUpload = document.getElementById('profile_image');
  const dataTable = document.querySelector('#member-data-container');
  let currentProfileImage = null;
  const departmentDropdown = document.getElementById('department');
  const positionDropdown = document.getElementById('position');
  const loader = document.getElementById('loader');


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
    axios.get('https://ieee-vishv.onrender.com/api/members')
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


  function updateMemberCount() {
    const memberContainer = document.getElementById('member-data-container');
    const memberCount = memberContainer.childElementCount; // Get the number of child elements
    document.getElementById('member-count').textContent = memberCount-1; // Display the count
}


  function renderData(data) {
    const cardsContainer = document.getElementById('member-data-container');
    cardsContainer.innerHTML = '';
    data.forEach(row => {
        const card = document.createElement('div');
        card.className = 'card';

        // Create the left side content
        const leftDiv = document.createElement('div');
        leftDiv.className = 'card-left';
        leftDiv.innerHTML = `
            <img src="${row.profile_image}" alt="Profile Image" class="profile-image">
            <div class="icons">
            
            <i class="fas fa-edit edit-icon" style="color: white; font-size: 1.25rem;" onclick="editMember('${row._id}')"></i>
            <i class="fas fa-trash delete-icon" style="font-size: 1.25rem;" onclick="deleteMember('${row._id}')"></i>
            </div>
        `;

        // Create the right side content with edit and delete icons
        const rightDiv = document.createElement('div');
        rightDiv.className = 'card-right';
        rightDiv.innerHTML = `
            <h3>${row.name}</h3>
            <p>${row.enrollment_number}</p>
        `;

        card.appendChild(leftDiv);
        card.appendChild(rightDiv);

        // Create the second section with email, phone, department, and position
        const positionDiv = document.createElement('div');
        positionDiv.className = 'card-position-details';
        positionDiv.innerHTML = `
            <div class="div1">
            <p class="head">Department </p>
            <p>${row.department}</p>
            </div>
            <div class="div2">
            <p class="head">Position </p>
            <p>${row.position}</p>
            </div>
        `;
        
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'card-details';
        detailsDiv.innerHTML = `
        <p><i class="fas fa-envelope" style="color: #888; margin-right: 6px; "></i> ${row.email}</p>
        <p><i class="fas fa-phone" style="color: #888; margin-right: 6px;"></i> ${row.contact_number}</p>
    `;
    

        // Add Instagram and LinkedIn icons if they exist
        const socialDiv = document.createElement('div');
        socialDiv.className = 'social-icons';
        if (row.instagramProfile) {
            socialDiv.innerHTML += `<a href="${row.instagramProfile}" target="_blank" aria-label="Instagram Profile"><i class="fab fa-instagram"></i></a>`;
        }
        if (row.linkedinProfile) {
            socialDiv.innerHTML += `<a href="${row.linkedinProfile}" target="_blank" aria-label="LinkedIn Profile"><i class="fab fa-linkedin"></i></a>`;
        }

        card.appendChild(positionDiv);
        detailsDiv.appendChild(socialDiv);
        card.appendChild(detailsDiv);
        cardsContainer.appendChild(card);

        
      });
      updateMemberCount(); // Update the count after rendering
    }




  // Function to format date in "DD-MM-YYYY" format
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  window.editMember = function(id) {
    axios.post(`https://ieee-vishv.onrender.com/api/members/update/${id}`)
      .then(response => {
        const member = response.data.member;
  
        // Ensure 'member' is correctly accessed from response.data
        if (member) {
          // Update form fields with member details
          document.getElementById('memberId').value = member._id; // Check if it's _id or id based on your API response
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
  
          // Set leave date if available
          let dateString = '';
          if (member.leave_date) {
            const leaveDate = new Date(member.leave_date);
            leaveDate.setDate(leaveDate.getDate() + 1); // Add 1 day to the leave date
            dateString = leaveDate.toISOString().split('T')[0];
          }
          document.getElementById('leave_date').value = dateString;
  
          // Display current profile image
          if (member.profile_image) {
            currentProfileImage = member.profile_image;
            const img = document.createElement('img');
            img.src = `${member.profile_image}`;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '200px';
            imagePreview.innerHTML = '';
            imagePreview.appendChild(img);
          }
  
          // Display the modal for editing
          modal.style.display = 'block';
        } else {
          console.error('No member data found in response.');
        }
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

        // Show loader and disable interactions
        
        loader.style.display = 'block';
        document.body.classList.add('disable-interaction');

        axios.delete(`https://ieee-vishv.onrender.com/api/member/${id}`)
          .then(response => {
            fetchData();
            Swal.fire(
              'Deleted!',
              'Your member has been deleted.',
              'success'
            );
          })
          .catch(error => console.error('Error deleting member:', error));

          // Hide loader and enable interactions
          loader.style.display = 'none';
          document.body.classList.remove('disable-interaction');
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
    const url = memberId ? `https://ieee-vishv.onrender.com/api/members/update/${memberId}` : 'https://ieee-vishv.onrender.com/api/members/upload';

    if (!imageUpload.files.length && currentProfileImage) {
      formData.append('profile_image', currentProfileImage);
    }
    
    // Show loader and disable interactions
    loader.style.display = 'block';
    document.body.classList.add('disable-interaction');

    axios.post(url, formData)
      .then(response => {
        const message = memberId ? 'updated' : 'added';

        // Hide loader and enable interactions
        loader.style.display = 'none';
        document.body.classList.remove('disable-interaction');

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

          // Hide loader and enable interactions
          loader.style.display = 'none';
          document.body.classList.remove('disable-interaction');
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
      const response = await axios.get('https://ieee-vishv.onrender.com/api/members'); // Adjust the URL to your actual API endpoint
      members = response.data;
      // displayPage(currentPage);
      // updatePaginationControls();
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  }

  
  // Fetch and display members data on page load
  fetchMembers();
});

