import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaEnvelope, FaPhone, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminCommitteePage = () => {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [members, setMembers] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [formData, setFormData] = useState({
    memberId: '',
    name: '',
    email: '',
    enrollment_number: '',
    contact_number: '',
    join_year: '',
    programme: '',
    department: 'CSE',
    position: 'Head',
    instagramProfile: '',
    linkedinProfile: '',
    leave_date: '',
    profile_image: null
  });
  const [currentProfileImage, setCurrentProfileImage] = useState(null);
  const [loaderVisible, setLoaderVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/members`);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCurrentProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = formData.memberId
      ? `${backendUrl}/api/members/update/${formData.memberId}`
      : `${backendUrl}/api/members/upload`;

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (!formData.profile_image && currentProfileImage) {
      data.append('profile_image', currentProfileImage);
    }

    setLoaderVisible(true);
    try {
      await axios.post(url, data);
      Swal.fire('Success!', 'Member has been saved.', 'success');
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error('Error uploading member:', error);
      Swal.fire('Error!', 'There was an error saving the member.', 'error');
    } finally {
      setLoaderVisible(false);
    }
  };

  const handleEdit = (id) => {
    const member = members.find((m) => m._id === id);
    if (member) {
      setFormData({
        memberId: member._id || '',
        name: member.name || '',
        email: member.email || '',
        enrollment_number: member.enrollment_number || '',
        contact_number: member.contact_number || '',
        join_year: member.join_year || '',
        programme: member.programme || '',
        department: member.department || 'CSE',
        position: member.position || 'Head',
        instagramProfile: member.instagramProfile || '',
        linkedinProfile: member.linkedinProfile || '',
        leave_date: member.leave_date || '',
        profile_image: null
      });
      setCurrentProfileImage(member.profile_image || '');
      setModalVisible(true);
    }
  };

  const handleDelete = async (id) => {
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
      setLoaderVisible(true);
      try {
        await axios.delete(`${backendUrl}/api/member/${id}`);
        Swal.fire('Deleted!', 'Your member has been deleted.', 'success');
        fetchData();
      } catch (error) {
        console.error('Error deleting member:', error);
      } finally {
        setLoaderVisible(false);
      }
    }
  };

  const handlePositionOptions = (department) => {
    if (department === 'OBs') {
      return ['Chairperson', 'Co - Chairperson', 'Secretary', 'Joint - Secretary', 'Treasurer', 'Faculty'];
    }
    return ['Head', 'Member'];
  };

  const clearForm = () => {
    setFormData({
      memberId: '',
      name: '',
      email: '',
      enrollment_number: '',
      contact_number: '',
      join_year: '',
      programme: '',
      department: 'CSE',
      position: 'Head',
      instagramProfile: '',
      linkedinProfile: '',
      leave_date: '',
      profile_image: null
    });
    setCurrentProfileImage('');
  };

  return (
    <div className="font-poppins m-0 p-0 min-h-screen bg-[#121212]">
      <div className="flex items-center justify-center relative py-4">
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="absolute left-[10%] px-5 py-2.5 bg-black text-white rounded border border-gray-400 hover:bg-gray-700 transition"
        >
          Admin page
        </button>
        <h1 className="text-center text-white text-2xl">Member-admin Page</h1>
      </div>

      {loaderVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[1000000]">
          <div className="bg-white w-1/2 mx-auto p-6 rounded-lg max-w-2xl md:w-[90%]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add/Edit Member</h2>
              <button 
                onClick={() => setModalVisible(false)}
                className="text-gray-400 text-2xl font-bold hover:text-black"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 ]">
              <input type="hidden" name="memberId" value={formData.memberId} />
              
              {[
                { label: 'Name', name: 'name', type: 'text' },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Enrollment Number', name: 'enrollment_number', type: 'text' },
                { label: 'Contact Number', name: 'contact_number', type: 'text' },
                { label: 'Join Year', name: 'join_year', type: 'text' },
                { label: 'Programme', name: 'programme', type: 'text' }
              ].map((field) => (
                <div key={field.name} className="col-span-1">
                  <label className="block font-bold mb-1">
                    {field.label}<span className="text-red-500">*</span>:
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              ))}

              <div className="col-span-1">
                <label className="block font-bold mb-1">
                  Department<span className="text-red-500">*</span>:
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={(e) => {
                    handleInputChange(e);
                    setFormData(prev => ({
                      ...prev,
                      position: handlePositionOptions(e.target.value)[0]
                    }));
                  }}
                  className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                  required
                >
                  {['CSE', 'Logistics', 'Socialmedia', 'RAS', 'Technical', 'Content', 'Graphics', 'OBs']
                    .map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))
                  }
                </select>
              </div>

              <div className="col-span-1">
                <label className="block font-bold mb-1">
                  Position<span className="text-red-500">*</span>:
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                  required
                >
                  {handlePositionOptions(formData.department).map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <label className="block font-bold mb-1">Instagram Profile:</label>
                <input
                  type="text"
                  name="instagramProfile"
                  value={formData.instagramProfile}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="col-span-1">
                <label className="block font-bold mb-1">LinkedIn Profile:</label>
                <input
                  type="text"
                  name="linkedinProfile"
                  value={formData.linkedinProfile}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-bold mb-1">Leave Date:</label>
                <input
                  type="date"
                  name="leave_date"
                  value={formData.leave_date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="col-span-2 border-2 border-dashed border-gray-300 p-4 rounded">
                <label className="block font-bold mb-2">Profile Image:</label>
                <input
                  type="file"
                  name="profile_image"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full"
                />
                {currentProfileImage && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={currentProfileImage}
                      alt="Profile Preview"
                      className="max-w-[200px] max-h-[200px] object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="col-span-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
              >
                {formData.memberId ? 'Update' : 'Add'} Member
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="w-[90%] mx-auto flex justify-center">
        <div className="flex flex-row justify-center gap-1.5">
          <p className="text-gray-400 text-2xl">Number of members:</p>
          <p className="text-white text-2xl">{members.length}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center items-center p-5">
        {members.map((member) => (
          <div key={member._id} className="bg-[#1f1f1f] rounded-lg p-4 m-2.5 flex flex-col shadow-lg min-w-[280px] gap-2.5">
            <div className="flex justify-between">
              <img
                src={member.profile_image}
                alt="Profile"
                className="w-[75px] h-[100px] rounded object-cover"
              />
              <div className="flex gap-2">
                <FaEdit
                  onClick={() => handleEdit(member._id)}
                  className="text-white text-xl cursor-pointer hover:text-blue-500"
                />
                <FaTrash
                  onClick={() => handleDelete(member._id)}
                  className="text-red-500 text-xl cursor-pointer hover:text-red-600"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-white text-lg font-semibold">{member.name}</h3>
              <p className="text-gray-400">{member.enrollment_number}</p>

              <div className="flex justify-between mt-2">
                <div>
                  <p className="text-gray-400 text-sm">Department</p>
                  <p className="text-white">{member.department}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Position</p>
                  <p className="text-white">{member.position}</p>
                </div>
              </div>

              <div className="mt-2 space-y-1">
                <p className="flex items-center text-gray-400">
                  <FaEnvelope className="mr-2" />
                  {member.email}
                </p>
                <p className="flex items-center text-gray-400">
                  <FaPhone className="mr-2" />
                  {member.contact_number}
                </p>
              </div>

              <div className="flex gap-4 mt-2">
                {member.instagramProfile && (
                  <a
                    href={member.instagramProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-xl"
                  >
                    <FaInstagram />
                  </a>
                )}
                {member.linkedinProfile && (
                  <a
                    href={member.linkedinProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-xl"
                  >
                    <FaLinkedin />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full flex justify-center items-center bg-[#121212] py-4">
        <button
          onClick={() => {
            clearForm();
            setModalVisible(true);
          }}
          className="px-5 py-2.5 bg-green-600 text-white rounded text-base hover:bg-green-700 transition"
        >
          Add Member
        </button>
      </div>
    </div>
  );
};

export default AdminCommitteePage;