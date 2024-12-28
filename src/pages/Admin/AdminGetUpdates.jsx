import React, { useEffect, useState } from 'react';

function AdminGetUpdatesPage() {
    const [updates, setUpdates] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        fetchUpdates();
    }, []);

    const fetchUpdates = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/updates`);
            const data = await response.json();
            setUpdates(data);
        } catch (error) {
            console.error('Error fetching updates:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const downloadExcel = () => {
        const rows = document.querySelectorAll('#member-data-table tr');
        let csv = [];
        rows.forEach(row => {
            const cols = row.querySelectorAll('td, th');
            const rowData = Array.from(cols).map(col => {
                let field = col.innerText;
                if (field.includes(',')) {
                    field = `"${field}"`;
                }
                return field;
            });
            csv.push(rowData.join(','));
        });
        const csvContent = csv.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'get-updates-form-details.csv';
        link.click();
    };

    return (
        <div className="font-poppins m-0 p-0 min-h-screen bg-[#121212]">
            <div className="flex items-center justify-center relative py-4">
                <button 
                    className="absolute left-[10%] px-5 py-2.5 bg-black text-white rounded border border-gray-400 hover:bg-gray-700 transition"
                    onClick={() => window.location.href = '/admin/dashboard'}
                >
                    Admin Page
                </button>
                <h1 className="text-center text-white text-2xl">Updates Table</h1>
            </div>

            <div className="max-w-5xl mx-auto p-5">
                <div className="bg-[#1f1f1f] rounded-lg p-6 shadow-lg">
                    <table className="w-full border-collapse" id="member-data-table">
                        <thead>
                            <tr>
                                <th className="border border-gray-600 bg-black/60 text-white p-3">Id</th>
                                <th className="border border-gray-600 bg-black/60 text-white p-3">Name</th>
                                <th className="border border-gray-600 bg-black/60 text-white p-3">Email</th>
                                <th className="border border-gray-600 bg-black/60 text-white p-3">Date</th>
                                <th className="border border-gray-600 bg-black/60 text-white p-3">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {updates.map((update, index) => (
                                <tr key={index} className="text-gray-300">
                                    <td className="border border-gray-600 p-3">{update.rowCount}</td>
                                    <td className="border border-gray-600 p-3">{update.name}</td>
                                    <td className="border border-gray-600 p-3">{update.email}</td>
                                    <td className="border border-gray-600 p-3">{formatDate(update.date)}</td>
                                    <td className="border border-gray-600 p-3">{update.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="text-center mt-6">
                        <button 
                            className="px-5 py-2.5 bg-green-600 text-white rounded text-base hover:bg-green-700 transition"
                            onClick={downloadExcel}
                        >
                            Download Excel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminGetUpdatesPage;