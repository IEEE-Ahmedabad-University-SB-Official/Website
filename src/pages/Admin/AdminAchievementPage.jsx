import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AdminAchievementPage = () => {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    achievementId: '',
    achievementName: '',
    achievementDescription: '',
    achievementImage: null,
    oldAchievementImage: ''
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchAchievements();
  }, [navigate]);

  const fetchAchievements = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/achievements`);
      setAchievements(response.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({ ...prev, achievementImage: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const submitFormData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) submitFormData.append(key, formData[key]);
    });

    try {
      if (formData.achievementId) {
        await axios.post(`${backendUrl}/api/achievements/update/${formData.achievementId}`, submitFormData);
      } else {
        await axios.post(`${backendUrl}/api/achievements/upload`, submitFormData);
      }
      
      Swal.fire({
        title: formData.achievementId ? 'Updated!' : 'Added!',
        text: `Achievement has been ${formData.achievementId ? 'updated' : 'added'}.`,
        icon: 'success'
      });
      
      closeModal();
      fetchAchievements();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const editAchievement = async (id) => {
    try {
      const response = await axios.post(`${backendUrl}/api/achievements/update/${id}`);
      const achievement = response.data.achievement;
      
      setFormData({
        achievementId: achievement._id,
        achievementName: achievement.achievementName,
        achievementDescription: achievement.achievementDescription,
        oldAchievementImage: achievement.achievementImage,
        achievementImage: null
      });
      
      setImagePreview(achievement.achievementImage);
      setCurrentImage(achievement.achievementImage);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching achievement details:', error);
    }
  };

  const deleteAchievement = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await axios.delete(`${backendUrl}/api/achievement/${id}`);
        fetchAchievements();
        Swal.fire('Deleted!', 'Achievement has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting achievement:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      achievementId: '',
      achievementName: '',
      achievementDescription: '',
      achievementImage: null,
      oldAchievementImage: ''
    });
    setImagePreview(null);
    setCurrentImage(null);
  };

  return (
    <div className="container mx-auto px-4">
      {/* Header */}
      <div className="flex items-center justify-center relative py-4">
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="absolute left-0 px-4 py-2 bg-black text-white rounded hover:bg-opacity-60 transition"
        >
          Admin page
        </button>
        <h1 className="text-2xl font-bold">Achievement Admin Page</h1>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Achievement</h2>
              <button onClick={closeModal} className="text-2xl">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="achievementId" value={formData.achievementId} />
              
              <div>
                <label className="block font-bold mb-1">Achievement Name:</label>
                <input
                  type="text"
                  value={formData.achievementName}
                  onChange={(e) => setFormData(prev => ({ ...prev, achievementName: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Achievement Description:</label>
                <textarea
                  value={formData.achievementDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, achievementDescription: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="border-2 border-dashed p-4 text-center">
                <label className="block font-bold mb-1">Achievement Image:</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="mb-2"
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto" />
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                {formData.achievementId ? 'Update' : 'Add'} Achievement
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <table className="w-4/5 mx-auto border-collapse">
        <thead>
          <tr>
            <th className="border p-2 bg-black bg-opacity-60 text-white">Achievement Name</th>
            <th className="border p-2 bg-black bg-opacity-60 text-white">Description</th>
            <th className="border p-2 bg-black bg-opacity-60 text-white">Image</th>
            <th className="border p-2 bg-black bg-opacity-60 text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {achievements.map((achievement) => (
            <tr key={achievement._id} className="even:bg-gray-100">
              <td className="border p-2">{achievement.achievementName}</td>
              <td className="border p-2">{achievement.achievementDescription}</td>
              <td className="border p-2">
                <img src={achievement.achievementImage} alt={achievement.achievementName} className="max-w-[100px]" />
              </td>
              <td className="border p-2">
                <button
                  onClick={() => editAchievement(achievement._id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteAchievement(achievement._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => setShowModal(true)}
        className="block mx-auto mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add Achievement
      </button>

      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default AdminAchievementPage;