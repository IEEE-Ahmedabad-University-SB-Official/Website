import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const AdminUsersPage = () => {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // General loading for fetching admins
  const [isAdding, setIsAdding] = useState(false); // Adding admin loader
  const [deletingId, setDeletingId] = useState(null); // ID of admin being deleted
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const apikey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    fetchAdmins();
  }, []);
  
  const fetchAdmins = () => {
    setIsLoading(true);
    fetch(`${backendUrl}/api/getAllAdmins`, {
        headers: {
            'x-api-key': apikey
        }
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAdmins(data);
        } else {
          toast.error("Error fetching admins: Data is not an array.");
        }
      })
      .catch(() => toast.error("Failed to fetch admins. Please try again later."))
      .finally(() => setIsLoading(false));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = newAdmin;
    setIsAdding(true); // Start adding loader

    fetch(`${backendUrl}/api/addAdmin`, {
      method: "POST",
      headers: { "Content-Type": "application/json", 'x-api-key': apikey },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        setAdmins((prevAdmins) => [...prevAdmins, data]);
        setIsModalOpen(false);
        setNewAdmin({ username: "", password: "" });
        toast.success("Admin added successfully!");
      })
      .catch(() => toast.error("Failed to add admin. Please try again later."))
      .finally(() => setIsAdding(false)); // Stop adding loader
  };

  const handleDeleteAdmin = (adminId) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      setDeletingId(adminId); // Start deleting loader for this admin
      fetch(`${backendUrl}/api/deleteAdmin/${adminId}`, 
        { method: "DELETE",
          headers: {
            'x-api-key': apikey
          }
        })
        .then((response) => {
          if (response.ok) {
            setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== adminId));
            toast.success("Admin deleted successfully!");
          } else {
            toast.error("Cannot delete the last admin.");
          }
        })
        .catch(() => toast.error("Failed to delete admin. Please try again later."))
        .finally(() => setDeletingId(null)); // Stop deleting loader
    }
  };

  return (
    <div className="font-poppins m-0 p-0 min-h-screen bg-[#121212]">
      <div className="flex items-center justify-center relative py-4">
        <button 
          className="absolute left-[10%] px-5 py-2.5 bg-black text-white rounded border border-gray-400 hover:bg-gray-700 transition"
          onClick={() => window.location.href = "/admin/dashboard"}
        >
          Admin Dashboard
        </button>
        <h1 className="text-center text-white text-2xl">Admin Management</h1>
      </div>

      <div className="max-w-3xl mx-auto p-5">
        <Toaster position="top-right" />

        {isLoading ? (
          <div className="flex justify-center">
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-[#1f1f1f] rounded-lg p-6 shadow-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-600 bg-black/60 text-white p-3">Username</th>
                  <th className="border border-gray-600 bg-black/60 text-white p-3">Password</th>
                  <th className="border border-gray-600 bg-black/60 text-white p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin._id} className="text-gray-300">
                    <td className="border border-gray-600 p-3 text-center">{admin.username}</td>
                    <td className="border border-gray-600 p-3 text-center">{admin.password}</td>
                    <td className="border border-gray-600 p-3 text-center">
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 transition"
                        onClick={() => handleDeleteAdmin(admin._id)}
                        disabled={deletingId === admin._id}
                      >
                        {deletingId === admin._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-center mt-6">
              <button 
                className="px-5 py-2.5 bg-green-600 text-white rounded text-base hover:bg-green-700 transition"
                onClick={() => setIsModalOpen(true)}
              >
                Add New Admin
              </button>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add Admin</h2>
                <button 
                  className="text-gray-400 text-2xl font-bold hover:text-black"
                  onClick={() => setIsModalOpen(false)}
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block font-bold mb-1">Username<span className="text-red-500">*</span>:</label>
                  <input
                    type="text"
                    name="username"
                    value={newAdmin.username}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-bold mb-1">Password<span className="text-red-500">*</span>:</label>
                  <input
                    type="password"
                    name="password"
                    value={newAdmin.password}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition disabled:opacity-50"
                  disabled={isAdding}
                >
                  {isAdding ? "Adding..." : "Save"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
