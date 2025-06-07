import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Typography } from "@material-tailwind/react";
import { selectApplicants } from '../../api/companyApi';

const SelectApplicants = () => {
    const location = useLocation();
    const students = location.state?.res || [];
    const jobId = location.state?.jobId;

    const navigate = useNavigate();
    const [selectedPRNs, setSelectedPRNs] = useState([]);

    const handleCheckboxChange = (prn) => {
        setSelectedPRNs((prev) =>
            prev.includes(prn) ? prev.filter((id) => id !== prn) : [...prev, prn]
        );
    };

    const handleViewMore = (student) => {
        navigate('/company/applicantDetails', { state: { student } })
    }

    const handleSubmit = async () => {
        try {
            const response = await selectApplicants(jobId,selectedPRNs);

            
            console.log('Server response:', response);
        } catch (error) {
            console.error('Error submitting:', error);
        }
    };


    return (
        <div className="p-6">
            <Card className="h-full w-full overflow-scroll">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                <Typography variant="small" color="blue-gray" className="font-bold">
                                    Profile Photo
                                </Typography>
                            </th>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                <Typography variant="small" color="blue-gray" className="font-bold">
                                    Name
                                </Typography>
                            </th>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                <Typography variant="small" color="blue-gray" className="font-bold">
                                    PRN
                                </Typography>
                            </th>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                <Typography variant="small" color="blue-gray" className="font-bold">
                                    Actions
                                </Typography>
                            </th>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                <Typography variant="small" color="blue-gray" className="font-bold">
                                    Select
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={index} className="even:bg-blue-gray-50/50">
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        <img src={student.profilePhoto} alt="" className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm" />
                                    </Typography>
                                </td>
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {student.name}
                                    </Typography>
                                </td>
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {student.prn}
                                    </Typography>
                                </td>
                                <td className="p-4">
                                    <Typography
                                        as="a"
                                        onClick={() => { handleViewMore(student) }}
                                        variant="small"
                                        color="blue"
                                        className="font-medium hover:underline"
                                    >
                                        View More
                                    </Typography>
                                </td>
                                <td className="p-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedPRNs.includes(student.prn)}
                                        onChange={() => handleCheckboxChange(student.prn)}
                                        className="w-4 h-4 text-emerald-600 rounded"
                                    />
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <div className="flex justify-center mt-6">
                <button
                    onClick={handleSubmit}
                    disabled={selectedPRNs.length === 0}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    Submit Selected Applicants
                </button>
            </div>


        </div>
    );
};

export default SelectApplicants;
