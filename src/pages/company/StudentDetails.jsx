import React from 'react';
import { useLocation } from 'react-router-dom';
import { MdEmail } from 'react-icons/md';
import { FaLinkedin } from 'react-icons/fa';

const StudentDetails = () => {
    const location = useLocation();
    const student = location.state?.student || [];
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="flex flex-col items-center text-center">
                    <img
                        src={student.profilePhoto || 'https://via.placeholder.com/150'}
                        alt="Student"
                        className="w-40 h-40 object-cover rounded-full mb-4"
                    />
                    <h2 className="text-xl font-bold">{student.name}</h2>
                    <br />
                    {student.email && (
                        <a
                            href={`mailto:${student.email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:text-red-800 text-xl"
                            title="Send Email"
                        >
                            <MdEmail />
                        </a>
                    )}

                    {/* LinkedIn */}
                    {student.linkedIn && (
                        <a
                            href={student.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xl"
                            title="View LinkedIn Profile"
                        >
                            <FaLinkedin />
                        </a>
                    )}
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li className='text-lg'><strong>Name:</strong> {student.name}</li>
                        <li><strong>Phone No. :</strong> {student.phone}</li>
                        <li><strong>Address: </strong> {student.address}</li>
                        <li><strong>Mail: </strong> {student.email}</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Educational Information</h3>
                    <ul className="space-y-4 text-gray-800">
                        <li>
                            <strong className="text-gray-600">Department: </strong>{student.additionalData.department}
                        </li>

                        <li>
                            <strong className="text-gray-600">CGPA:</strong>
                            <span className="ml-2">{student.additionalData.education.college.cmks}</span>
                            <br />
                            <a
                                href={student.additionalData.education.college.cimage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                            >
                                📄 View College Result
                            </a>
                        </li>

                        <li>
                            <strong className="text-gray-600">12th Marks:</strong>
                            <span className="ml-2">{student.additionalData.education.std12_or_diploma.mks12}%</span>
                            <br />
                            <a
                                href={student.additionalData.education.std12_or_diploma.image12}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                            >
                                📄 View 12th Result
                            </a>
                        </li>

                        <li>
                            <strong className="text-gray-600">10th Marks:</strong>
                            <span className="ml-2">{student.additionalData.education.std10.mks10}%</span>
                            <br />
                            <a
                                href={student.additionalData.education.std10.image10}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                            >
                                📄 View 10th Result
                            </a>
                        </li>

                        <li>
                            <strong className="text-gray-600">Resume:</strong>
                            <a
                                href={student.additionalData.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm ml-2"
                            >
                                📎 View Resume
                            </a>
                        </li>
                    </ul>

                </div>


            </div>
        </div>
    );
};

export default StudentDetails;
