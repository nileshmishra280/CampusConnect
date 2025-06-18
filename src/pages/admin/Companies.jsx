import React, { useEffect, useState } from 'react'
import { fetchAllCompanies } from '../../api/adminApi'
import { useNavigate } from 'react-router-dom';

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate=useNavigate();
    useEffect(() => {
        const getAllCompanies = async () => {
            const res = await fetchAllCompanies();
            setCompanies(res);
            console.log(res);
        }
        getAllCompanies();
    }, [])
    const filteredCompanies = companies.filter(company =>
        company._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-all duration-500">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-3">
                        Company Records
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                        Browse company details and filter by Name or Id
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Search Bar */}
                <div className="flex justify-center mb-6">
                    <input
                        type="text"
                        placeholder="Search Id / Name"
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
                                {['Profile','Name', 'ID'].map((header, idx) => (
                                    <th key={idx} className="p-5 text-sm font-bold uppercase text-gray-700 dark:text-gray-300 tracking-wide">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCompanies.map((company, idx) => (
                                <tr
                                    key={idx}
                                    className="group hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 dark:hover:from-indigo-900/20 dark:hover:to-blue-900/20 transition-all duration-300 border-b border-gray-100 dark:border-gray-700"
                                >
                                    <td className="p-5">
                                        <img
                                            src={company.companyProfile || '/default-avatar.png'}
                                            alt={company.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400 group-hover:scale-110 transition-transform duration-300 shadow"
                                        />
                                    </td>
                                    <td className="p-5 font-mono font-semibold text-700 dark:text-indigo-300">
                                        {company.companyName}
                                    </td>
                                    <td className="p-5 font-mono font-semibold text-indigo-700 dark:text-indigo-300">
                                        {company.companyId}
                                    </td>
                                </tr>
                            ))}
                            {filteredCompanies.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-gray-500 dark:text-gray-400 italic">
                                        No matching companies found.
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

export default Companies
