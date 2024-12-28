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
    <div className="font-poppins m-0 p-0 min-h-screen bg-[#121212]">
      <div className="flex items-center justify-center relative py-4">
        <button 
          className="absolute left-[10%] px-5 py-2.5 bg-black text-white rounded border border-gray-400 hover:bg-gray-700 transition"
          onClick={() => navigate('/admin/dashboard')}
        >
          Admin Page
        </button>
        <h1 className="text-center text-white text-2xl">Achievement Admin Page</h1>
      </div>

      <div className="max-w-7xl mx-auto p-5">
        <div className="flex flex-wrap justify-center gap-6">
          {achievements.map((achievement) => (
            <div key={achievement._id} className="bg-[#1f1f1f] rounded-lg p-6 shadow-lg w-[300px]">
              <div className="flex justify-between items-start mb-4">
                <img
                  src={achievement.achievementImage}
                  alt={achievement.achievementName}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => editAchievement(achievement._id)}
                    className="text-white hover:text-blue-500 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteAchievement(achievement._id)}
                    className="text-red-500 hover:text-red-600 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="text-white">
                <h3 className="text-lg font-semibold mb-2">{achievement.achievementName}</h3>
                <p className="text-gray-400 text-sm">{achievement.achievementDescription}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => {
              setFormData({
                achievementId: '',
                achievementName: '',
                achievementDescription: '',
                achievementImage: null,
                oldAchievementImage: ''
              });
              setImagePreview(null);
              setShowModal(true);
            }}
            className="px-5 py-2.5 bg-green-600 text-white rounded text-base hover:bg-green-700 transition"
          >
            Add Achievement
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {formData.achievementId ? 'Edit Achievement' : 'Add Achievement'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 text-2xl font-bold hover:text-black"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-bold mb-1">
                    Achievement Name<span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="text"
                    value={formData.achievementName}
                    onChange={(e) => setFormData(prev => ({ ...prev, achievementName: e.target.value }))}
                    className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">
                    Achievement Description<span className="text-red-500">*</span>:
                  </label>
                  <textarea
                    value={formData.achievementDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, achievementDescription: e.target.value }))}
                    className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                    rows="4"
                    required
                  />
                </div>

                <div className="border-2 border-dashed border-gray-300 p-4 rounded">
                  <label className="block font-bold mb-2">
                    Achievement Image<span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="w-full"
                  />
                  {imagePreview && (
                    <div className="mt-4 flex justify-center">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-[200px] max-h-[200px] object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : (formData.achievementId ? 'Update' : 'Add')}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAchievementPage;