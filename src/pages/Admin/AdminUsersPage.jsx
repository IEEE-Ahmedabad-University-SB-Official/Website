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

  useEffect(() => {
    fetchAdmins();
  }, []);
  
  const fetchAdmins = () => {
    setIsLoading(true);
    fetch(`${backendUrl}/api/getAllAdmins`)
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
      headers: { "Content-Type": "application/json" },
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
      fetch(`${backendUrl}/api/deleteAdmin/${adminId}`, { method: "DELETE" })
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
    <div className="max-w-3xl mx-auto p-5 font-sans text-gray-800">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
          onClick={() => (window.location.href = "/admin/dashboard")}
        >
          Admin Dashboard
        </button>
        <h1 className="text-2xl font-bold mb-5">Admin Management</h1>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse my-5">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-blue-500 text-white p-3">Username</th>
              <th className="border border-gray-300 bg-blue-500 text-white p-3">Password</th>
              <th className="border border-gray-300 bg-blue-500 text-white p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td className="border border-gray-300 p-3 text-center">{admin.username}</td>
                <td className="border border-gray-300 p-3 text-center">{admin.password}</td>
                <td className="border border-gray-300 p-3 text-center">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
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
      )}

      <div className="text-center my-5">
        <button 
          className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 text-base"
          onClick={() => setIsModalOpen(true)}
        >
          Add New Admin
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center animate-fadeIn">
          <div className="bg-white p-5 rounded-lg w-96 shadow-lg animate-slideIn">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Add Admin</h2>
              <button 
                className="text-2xl hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <form className="mt-5" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={newAdmin.username}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={newAdmin.password}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button 
                type="submit" 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 w-full"
                disabled={isAdding}
              >
                {isAdding ? "Adding..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
