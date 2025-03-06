import React, { useState, useEffect } from 'react';

const AdminContactUsPage = () => {
    const [contactDetails, setContactDetails] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const apikey = import.meta.env.VITE_API_KEY;

    // Function to format date in "DD-MM-YYYY" format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Fetch and display contact us details data
    const displayContactDetails = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/contact-us`, {
                headers: {
                    'x-api-key': apikey
                }
            });
            const data = await response.json();
            setContactDetails(data);
        } catch (error) {
            console.error('Error fetching contact details:', error);
            alert('An error occurred while fetching contact details. Please try again later.');
        }
    };

    // Function to download table data as Excel file
    const downloadExcel = () => {
        const rows = document.querySelectorAll('#member-data-table tr');
        let csv = [];
        rows.forEach((row) => {
            const rowData = [];
            const cols = row.querySelectorAll('td, th');
            cols.forEach((col) => {
                let field = col.innerText;
                if (field.includes(',')) {
                    field = `"${field}"`;
                }
                rowData.push(field);
            });
            csv.push(rowData.join(','));
        });
        const csvContent = csv.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'contact-us-form-details.csv';
        link.click();
    };

    // UseEffect to load contact details when component mounts
    useEffect(() => {
        displayContactDetails();
    }, []);

    return (
        <div className="font-poppins m-0 p-0 min-h-screen bg-[#121212]">
            <div className="flex items-center justify-center relative py-4">
                <button 
                    className="absolute left-[10%] px-5 py-2.5 bg-black text-white rounded border border-gray-400 hover:bg-gray-700 transition"
                    onClick={() => window.location.href = '/admin/dashboard'}
                >
                    Admin Page
                </button>
                <h1 className="text-center text-white text-2xl">Contact Form Details</h1>
            </div>

            <div className="max-w-5xl mx-auto p-5">
                <div className="bg-[#1f1f1f] rounded-lg p-6 shadow-lg">
                    <table className="w-full border-collapse" id="member-data-table">
                        <thead>
                            <tr>
                                <th className="border border-gray-600 bg-black/60 text-white p-3">No.</th>
                                <th className="border border-gray-600 bg-black/60 text-white p-3">Name</th>
                                <th className="border border-gray-600 bg-black/60 text-white p-3">Email</th>
                                <th className="border border-gray-600 bg-black/60 text-white p-3">Message</th>
                                <th className="border border-gray-600 bg-black/60 text-white p-3">Date</th>
                                <th className="border border-gray-600 bg-black/60 text-white p-3">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contactDetails.map(contact => (
                                <tr key={contact.rowCount} className="text-gray-300">
                                    <td className="border border-gray-600 p-3">{contact.rowCount}</td>
                                    <td className="border border-gray-600 p-3">{contact.name}</td>
                                    <td className="border border-gray-600 p-3">{contact.email}</td>
                                    <td className="border border-gray-600 p-3">{contact.message}</td>
                                    <td className="border border-gray-600 p-3">{formatDate(contact.sentDate)}</td>
                                    <td className="border border-gray-600 p-3">{contact.sentTime}</td>
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
};

export default AdminContactUsPage;
