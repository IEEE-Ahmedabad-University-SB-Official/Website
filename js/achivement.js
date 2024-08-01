document.addEventListener("DOMContentLoaded", function () {
    const achievementsContainer = document.querySelector('#data-table tbody');
    const modal = document.getElementById('achivement-modal');
    const form = document.getElementById('achivement-form');
    const imagePreview = document.getElementById('image-preview');
    const imageUpload = document.getElementById('achivementImage');
    const loader = document.getElementById('loader');
    const addAchievementButton = document.getElementById('add-achivement-button');
    const closeModalButton = document.querySelector('#achivement-modal .close');
    let currentImage = null;

    // Fetch and render achievements
    function fetchAchievements() {
        axios.get('https://ieee-vishv-1.onrender.com/api/achievements')
            .then(response => {
                renderAchievements(response.data);
            })
            .catch(error => console.error('Error fetching achievements:', error));
    }

    // Show modal when "Add Achievement" button is clicked
    addAchievementButton.addEventListener('click', function () {
        // Reset form and image preview for a new entry
        form.reset();
        imagePreview.innerHTML = '';
        currentImage = null;
        modal.style.display = 'block';
    });

    // Hide modal when close button is clicked
    closeModalButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Hide modal when clicking outside of modal content
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    function renderAchievements(data) {
        achievementsContainer.innerHTML = '';
        data.forEach(achievement => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${achievement.achievementName}</td>
                <td>${achievement.achievementDescription}</td>
                <td><img src="${achievement.achievementImage}" alt="${achievement.achievementName}" style="max-width: 100px;"></td>
                <td>
                    <button onclick="editAchievement('${achievement._id}')">Edit</button>
                    <button onclick="deleteAchievement('${achievement._id}')">Delete</button>
                </td>
            `;

            achievementsContainer.appendChild(row);
        });
    }

    // Edit achievement
    window.editAchievement = function (id) {
        axios.post(`https://ieee-vishv-1.onrender.com/api/achievements/update/${id}`)
            .then(response => {
                const achievement = response.data.achievement;
                document.getElementById('achivementId').value = achievement._id;
                document.getElementById('achivementName').value = achievement.achievementName;
                document.getElementById('achivementDescription').value = achievement.achievementDescription;
                document.getElementById('oldAchivementImage').value = achievement.achievementImage;

                if (achievement.achievementImage) {
                    currentImage = achievement.achievementImage;
                    const img = document.createElement('img');
                    img.src = achievement.achievementImage;
                    img.style.maxWidth = '100%';
                    img.style.maxHeight = '200px';
                    imagePreview.innerHTML = '';
                    imagePreview.appendChild(img);
                }

                modal.style.display = 'block';
            })
            .catch(error => console.error('Error fetching achievement details:', error));
    };

    // Delete achievement
    window.deleteAchievement = function (id) {
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
                loader.style.display = 'block';
                document.body.classList.add('disable-interaction');

                axios.delete(`https://ieee-vishv-1.onrender.com/api/achievement/${id}`)
                    .then(response => {
                        fetchAchievements();
                        loader.style.display = 'none';
                        document.body.classList.remove('disable-interaction');
                        Swal.fire('Deleted!', 'Your achievement has been deleted.', 'success');
                    })
                    .catch(error => {
                        console.error('Error deleting achievement:', error);
                        loader.style.display = 'none';
                        document.body.classList.remove('disable-interaction');
                    });
            }
        });
    };

    // Handle image upload preview
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

    // Handle form submission for adding/updating achievement
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        const achievementId = formData.get('achivementId');

        if (!imageUpload.files.length && currentImage) {
            formData.append('achivementImage', currentImage);
        }

        loader.style.display = 'block';
        document.body.classList.add('disable-interaction');

        const handleResponse = response => {
            loader.style.display = 'none';
            document.body.classList.remove('disable-interaction');
            Swal.fire({
                title: achievementId ? 'Updated!' : 'Added!',
                text: achievementId ? 'Your achievement has been updated.' : 'Your achievement has been added.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                closeModal();
                fetchAchievements();
            });
        };

        const handleError = error => {
            console.error(achievementId ? 'Error updating achievement:' : 'Error uploading achievement:', error);
            loader.style.display = 'none';
            document.body.classList.remove('disable-interaction');
        };

        if (achievementId) {
            axios.post(`https://ieee-vishv-1.onrender.com/api/achievements/update/${achievementId}`, formData)
                .then(handleResponse)
                .catch(handleError);
        } else {
            axios.post('https://ieee-vishv-1.onrender.com/api/achievements/upload', formData)
                .then(handleResponse)
                .catch(handleError);
        }
    });

    // Close modal function
    window.closeModal = function() {
        modal.style.display = 'none';
        form.reset();
        document.getElementById('achivementId').value = '';
        imagePreview.innerHTML = '';
        currentImage = null;
    }

    fetchAchievements();
});
