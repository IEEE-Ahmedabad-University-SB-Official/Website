import React, { useState, useEffect } from 'react';

const AdminContactUsPage = () => {
    const [contactDetails, setContactDetails] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
            const response = await fetch(`${backendUrl}/api/contact-us`);
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
        <div>
            {/* Header Container */}
            <div className="flex items-center justify-center relative mt-4 md:flex-row flex-col">
                <button 
                    className="bg-black hover:bg-gray-700 text-white py-2 px-5 rounded text-base cursor-pointer md:absolute md:left-[10%] transition-colors"
                    onClick={() => window.location.href = '/admin/dashboard'}
                >
                    Admin page
                </button>
                <h1 className="flex-grow text-center">Contact Us Details</h1>
            </div>

            {/* Table */}
            <table className="w-4/5 border-collapse mx-auto my-5" id="member-data-table">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2 text-left bg-black/55 text-white">No.</th>
                        <th className="border border-gray-300 p-2 text-left bg-black/55 text-white">Name</th>
                        <th className="border border-gray-300 p-2 text-left bg-black/55 text-white">Email</th>
                        <th className="border border-gray-300 p-2 text-left bg-black/55 text-white">Message</th>
                        <th className="border border-gray-300 p-2 text-left bg-black/55 text-white">Date</th>
                        <th className="border border-gray-300 p-2 text-left bg-black/55 text-white">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {contactDetails.map(contact => (
                        <tr key={contact.rowCount} className="even:bg-gray-100">
                            <td className="border border-gray-300 p-2 text-left">{contact.rowCount}</td>
                            <td className="border border-gray-300 p-2 text-left">{contact.name}</td>
                            <td className="border border-gray-300 p-2 text-left">{contact.email}</td>
                            <td className="border border-gray-300 p-2 text-left">{contact.message}</td>
                            <td className="border border-gray-300 p-2 text-left">{formatDate(contact.sentDate)}</td>
                            <td className="border border-gray-300 p-2 text-left">{contact.sentTime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Download Button */}
            <button 
                className="block mx-auto my-5 py-2 px-5 bg-green-600 hover:bg-green-700 text-white rounded text-base cursor-pointer transition-colors"
                onClick={downloadExcel}
            >
                Download Excel
            </button>
        </div>
    );
};

export default AdminContactUsPage;
