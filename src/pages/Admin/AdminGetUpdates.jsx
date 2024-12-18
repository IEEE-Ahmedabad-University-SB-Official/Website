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
        <div>
            <div className="flex items-center justify-center relative mt-4 lg:flex-row flex-col">
                <button 
                    className="bg-black text-white px-5 py-2.5 rounded-md cursor-pointer text-base hover:bg-gray-600 lg:absolute lg:left-0 lg:ml-[10%]"
                    onClick={() => window.location.href = '/admin/dashboard'}
                >
                    Admin Page
                </button>
                <h1 className="flex-grow text-center">Updates Table</h1>
            </div>

            <table className="w-4/5 border-collapse mx-auto my-5" id="member-data-table">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2 text-left bg-black/60 text-white">Id</th>
                        <th className="border border-gray-300 p-2 text-left bg-black/60 text-white">Name</th>
                        <th className="border border-gray-300 p-2 text-left bg-black/60 text-white">Email</th>
                        <th className="border border-gray-300 p-2 text-left bg-black/60 text-white">Date</th>
                        <th className="border border-gray-300 p-2 text-left bg-black/60 text-white">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {updates.map((update, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                            <td className="border border-gray-300 p-2 text-left">{update.rowCount}</td>
                            <td className="border border-gray-300 p-2 text-left">{update.name}</td>
                            <td className="border border-gray-300 p-2 text-left">{update.email}</td>
                            <td className="border border-gray-300 p-2 text-left">{formatDate(update.date)}</td>
                            <td className="border border-gray-300 p-2 text-left">{update.time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button 
                className="block mx-auto my-5 px-5 py-2.5 bg-green-600 text-white text-base rounded-md cursor-pointer hover:bg-green-700"
                onClick={downloadExcel}
            >
                Download Excel
            </button>
        </div>
    );
}

export default AdminGetUpdatesPage;