import React, { useEffect, useState } from 'react';
import { fetchPendingVerifications } from '../../api/adminApi';
import { useNavigate } from 'react-router-dom';

const PendingVerifications = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate=useNavigate();
    useEffect(() => {
        const fetchPendingVerificationData = async () => {
            const data = await fetchPendingVerifications();
            setStudents(data.mergedData || []);

        };
        fetchPendingVerificationData();
    }, []);

    const handleVerify = (student) => {
        console.log('Verifying student:', student);
        navigate('/admin/verfiyStudentDetails',{state:{student}})
    };

    const filteredStudents = students.filter(student =>
        student.prn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.data.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-all duration-500">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-3">
                        Pending Verifications
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                        Browse student applications pending verification
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Search Bar */}
                <div className="flex justify-center mb-6">
                    <input
                        type="text"
                        placeholder="Search PRN / Department"
                        className="w-full max-w-md px-5 py-3 rounded-full border border-indigo-400 shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 text-gray-700 dark:text-white dark:bg-gray-800 dark:border-gray-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Table */}
                {
                    filteredStudents.length !== 0 && (
                        <div className="overflow-x-auto bg-white/90 dark:bg-gray-900/90 shadow-2xl backdrop-blur-lg rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
                            <table className="w-full text-left table-auto">
                                <thead>
                                    <tr className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 dark:from-indigo-700/20 dark:to-blue-700/20 border-b border-indigo-200 dark:border-indigo-700">
                                        {['Profile', 'PRN', 'Department', 'Action'].map((header, idx) => (
                                            <th key={idx} className="p-5 text-sm font-bold uppercase text-gray-700 dark:text-gray-300 tracking-wide">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((student, idx) => (
                                        <tr
                                            key={idx}
                                            className="group hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 dark:hover:from-indigo-900/20 dark:hover:to-blue-900/20 transition-all duration-300 border-b border-gray-100 dark:border-gray-700"
                                        >
                                            <td className="p-5">
                                                <img
                                                    src={student?.profilePhoto || '/default-avatar.png'}
                                                    alt="Profile"
                                                    className="w-12 h-12 rounded-full object-cover border-2 group-hover:scale-110 transition-transform duration-300 shadow"
                                                />
                                            </td>
                                            <td className="p-5 font-mono font-semibold text-indigo-700 dark:text-indigo-300">
                                                {student.prn}
                                            </td>
                                            <td className="p-5 font-mono font-semibold text-gray-700 dark:text-gray-300">
                                                {student.department || student?.data?.department || 'N/A'}
                                            </td>
                                            <td className="p-5">
                                                <button
                                                    onClick={() => handleVerify(student)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all"
                                                >
                                                    Verify Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    )
                }
                {filteredStudents.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 dark:text-gray-400">
                        <h3 className="text-2xl font-semibold mb-2">No Pending Verifications</h3>
                        <p className="text-sm">All student applications have already been verified.</p>
                    </div>
                )}


            </div>
        </div>
    );
};

export default PendingVerifications;
