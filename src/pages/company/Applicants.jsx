import React from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Applicants = () => {
    const location = useLocation();
    const students = location.state?.res || [];
    const navigate=useNavigate();
    const handleViewMore=(student)=>{
        navigate('/company/applicantDetails',{state:{student}})
    }

    return (
        <div>
            <section class="bg-white py-12">
                <div class="max-w-6xl mx-auto px-4">
                    <div class="text-center mb-12">
                        <h2 class="text-3xl font-bold text-gray-800">Applied students:</h2>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {students.map((student, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow hover:shadow-lg transition">
                                <div className="flex items-center space-x-4">
                                    <img className="w-16 h-16 rounded-full object-cover" src={student.profilePhoto} alt={student.name} />
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                                        <p className="text-sm text-gray-500">PRN: {student.prn}</p>
                                    </div>
                                </div>
                                <button onClick={()=>handleViewMore(student)} className="mt-4 w-full px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">
                                    View More
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    )
}

export default Applicants
