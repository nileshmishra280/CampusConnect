import React, { useEffect, useState } from 'react'
import { fetchAllStudents } from '../../api/adminApi'
import { useNavigate } from 'react-router-dom';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate=useNavigate();
    useEffect(() => {
        const getAllStudents = async () => {
            const res = await fetchAllStudents();
            setStudents(res);
            console.log(res);
        }
        getAllStudents();
    }, [])
    const filteredStudents = students.filter(student =>
        student.prn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.passOutYear?.toString().includes(searchTerm)
    );

    const handleViewMore = (student) => {
        console.log(student);
        navigate('/company/applicantDetails', { state: { student } })
    }
    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-all duration-500">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-3">
                        Student Records
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                        Browse student details and filter by PRN, Department or Year
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Search Bar */}
                <div className="flex justify-center mb-6">
                    <input
                        type="text"
                        placeholder="Search PRN / Department / Year"
                        className="w-full max-w-md px-5 py-3 rounded-full border border-indigo-400 shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 text-gray-700 dark:text-white dark:bg-gray-800 dark:border-gray-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto bg-white/90 dark:bg-gray-900/90 shadow-2xl backdrop-blur-lg rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
                    <table className="w-full text-left table-auto">
                        <thead>
                            <tr className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 dark:from-indigo-700/20 dark:to-blue-700/20 border-b border-indigo-200 dark:border-indigo-700">
                                {['Profile', 'PRN', 'Year of Passout', 'Department', 'Actions'].map((header, idx) => (
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
                                            src={student.profilePhoto || '/default-avatar.png'}
                                            alt={student.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 group-hover:scale-110 transition-transform duration-300 shadow"
                                        />
                                    </td>
                                    <td className="p-5 font-mono font-semibold text-indigo-700 dark:text-indigo-300">
                                        {student.prn}
                                    </td>
                                    <td className="p-5 text-gray-700 dark:text-gray-300">
                                        {student.passOutYear}
                                    </td>
                                    <td className="p-5 text-gray-700 dark:text-gray-300">
                                        {student.additionalData.department ? student.additionalData.department : null}
                                    </td>
                                    <td className="p-5 text-gray-700 dark:text-gray-300">
                                        <button
                                                    onClick={() => handleViewMore(student)}
                                                    className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105"
                                                >
                                                    <span className="relative flex items-center">
                                                        <svg className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        View Details
                                                    </span>
                                                    <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                                </button>
                                    </td>
                                    
                                </tr>
                            ))}
                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-gray-500 dark:text-gray-400 italic">
                                        No matching students found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Students
