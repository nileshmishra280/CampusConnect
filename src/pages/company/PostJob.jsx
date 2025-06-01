import React, { useState, useEffect } from "react";
import { toast , ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postJob } from "../../api/companyApi";
import { useAuth } from "../../context/AuthContext";

const PostJob = () => {
  const { user } = useAuth();

  const [jobData, setJobData] = useState({
    jobTitle: "",
    jobDescription: "",
    skills: "",
    education: { college: "", std12_or_diploma: "", std10: "" },
    workLocation: "",
    workDays: "",
    workTime: "",
    workMode: "",
    workModel: "",
    CTC: "",
    department: "",
    bond: "",
    lastDateForApplication: "",
    companyId: user?.company?.companyId || "", // Set companyId from user context
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Update companyId if user.company.companyId changes
  useEffect(() => {
    if (user?.company?.companyId) {
      setJobData((prev) => ({ ...prev, companyId: user.company.companyId }));
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    if (!jobData.jobTitle.trim()) newErrors.jobTitle = "Job title is required";
    if (!jobData.jobDescription.trim())
      newErrors.jobDescription = "Job description is required";
    if (!jobData.skills.trim()) newErrors.skills = "At least one skill is required";
    if (!jobData.workLocation.trim())
      newErrors.workLocation = "Work location is required";
    if (!jobData.workDays.trim()) newErrors.workDays = "Work days are required";
    if (!jobData.workTime.trim()) newErrors.workTime = "Work time is required";
    if (!jobData.workMode.trim()) newErrors.workMode = "Work mode is required";
    if (!jobData.workModel.trim()) newErrors.workModel = "Work model is required";
    if (!jobData.CTC.trim()) newErrors.CTC = "CTC is required";
    if (!jobData.department.trim())
      newErrors.department = "Department is required";
    if (!jobData.bond.trim()) newErrors.bond = "Bond information is required";
    if (!jobData.lastDateForApplication)
      newErrors.lastDateForApplication = "Last date for application is required";
    if (!jobData.companyId)
      newErrors.companyId = "Company ID is required (ensure you are logged in as a company user)";

    // Validate education fields if provided
    if (
      jobData.education.college &&
      (isNaN(jobData.education.college) || jobData.education.college < 0 || jobData.education.college > 100)
    )
      newErrors.college = "College percentage must be between 0 and 100";
    if (
      jobData.education.std12_or_diploma &&
      (isNaN(jobData.education.std12_or_diploma) ||
        jobData.education.std12_or_diploma < 0 ||
        jobData.education.std12_or_diploma > 100)
    )
      newErrors.std12_or_diploma = "12th/Diploma percentage must be between 0 and 100";
    if (
      jobData.education.std10 &&
      (isNaN(jobData.education.std10) || jobData.education.std10 < 0 || jobData.education.std10 > 100)
    )
      newErrors.std10 = "10th percentage must be between 0 and 100";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e, field, subField) => {
    if (subField) {
      setJobData({
        ...jobData,
        [field]: { ...jobData[field], [subField]: e.target.value },
      });
    } else {
      setJobData({ ...jobData, [field]: e.target.value });
    }
    // Clear error for the field when user starts typing
    setErrors((prev) => ({ ...prev, [field]: null, [subField]: null }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
        
      const response = await postJob(jobData);
    
      if (response.success) {
        toast.success(response.message, {
          position: "top-right",
          autoClose: 3000,
        });
        setJobData({
          jobTitle: "",
          jobDescription: "",
          skills: "",
          education: { college: "", std12_or_diploma: "", std10: "" },
          workLocation: "",
          workDays: "",
          workTime: "",
          workMode: "",
          workModel: "",
          CTC: "",
          department: "",
          bond: "",
          lastDateForApplication: "",
          companyId: user?.company?.companyId || "", // Reset with companyId
        });
        setErrors({});
      } else {
        toast.error(response.message || "Error posting job. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(error.message || "Network error. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-4">
        <ToastContainer />
      <section className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* Job Title */}
        <details className="p-4 group" open>
          <summary className="relative flex cursor-pointer items-center gap-4 pr-8 font-medium text-gray-700 dark:text-gray-200 transition-colors duration-300 focus-visible:outline-none group-hover:text-gray-900 dark:group-hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 shrink-0 stroke-emerald-500 dark:stroke-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="text-lg">Job Title</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-0 w-4 h-4 transition duration-300 top-1 shrink-0 stroke-gray-700 dark:stroke-gray-200 group-open:rotate-45"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </summary>
          <div className="mt-4 text-gray-500 dark:text-gray-400">
            <input
              type="text"
              value={jobData.jobTitle}
              onChange={(e) => handleInputChange(e, "jobTitle")}
              placeholder="Enter job title"
              className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.jobTitle ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.jobTitle && <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>}
            <textarea
              value={jobData.jobDescription}
              onChange={(e) => handleInputChange(e, "jobDescription")}
              placeholder="Enter job description"
              className={`w-full p-2 mt-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.jobDescription ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
              rows="4"
            />
            {errors.jobDescription && (
              <p className="text-red-500 text-sm mt-1">{errors.jobDescription}</p>
            )}
          </div>
        </details>

        {/* Skills */}
        <details className="p-4 group">
          <summary className="relative flex cursor-pointer items-center gap-4 pr-8 font-medium text-gray-700 dark:text-gray-200 transition-colors duration-300 focus-visible:outline-none group-hover:text-gray-900 dark:group-hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 shrink-0 stroke-emerald-500 dark:stroke-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
              />
            </svg>
            Skills Required
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-0 w-4 h-4 transition duration-300 top-1 shrink-0 stroke-gray-700 dark:stroke-gray-200 group-open:rotate-45"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </summary>
          <div className="mt-4 text-gray-500 dark:text-gray-400">
            <textarea
              value={jobData.skills}
              onChange={(e) => handleInputChange(e, "skills")}
              placeholder="Enter skills (one per line)"
              className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.skills ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
              rows="4"
            />
            {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
            <div className="mt-2 flex flex-wrap gap-2">
              {jobData.skills.split("\n").map((skill, index) => (
                skill.trim() && (
                  <span
                    key={index}
                    className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded-full text-sm"
                  >
                    {skill.trim()}
                  </span>
                )
              ))}
            </div>
          </div>
        </details>

        {/* Education */}
        <details className="p-4 group">
          <summary className="relative flex cursor-pointer items-center gap-4 pr-8 font-medium text-gray-700 dark:text-gray-200 transition-colors duration-300 focus-visible:outline-none group-hover:text-gray-900 dark:group-hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 shrink-0 stroke-emerald-500 dark:stroke-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
            </svg>
            Education Requirements
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-0 w-4 h-4 transition duration-300 top-1 shrink-0 stroke-gray-700 dark:stroke-gray-200 group-open:rotate-45"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </summary>
          <div className="mt-4 text-gray-500 dark:text-gray-400">
            <input
              type="number"
              value={jobData.education.college}
              onChange={(e) => handleInputChange(e, "education", "college")}
              placeholder="College percentage (optional)"
              className={`w-full p-2 mb-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.college ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.college && <p className="text-red-500 text-sm mt-1">{errors.college}</p>}
            <input
              type="number"
              value={jobData.education.std12_or_diploma}
              onChange={(e) => handleInputChange(e, "education", "std12_or_diploma")}
              placeholder="12th/Diploma percentage (optional)"
              className={`w-full p-2 mb-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.std12_or_diploma ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.std12_or_diploma && (
              <p className="text-red-500 text-sm mt-1">{errors.std12_or_diploma}</p>
            )}
            <input
              type="number"
              value={jobData.education.std10}
              onChange={(e) => handleInputChange(e, "education", "std10")}
              placeholder="10th percentage (optional)"
              className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.std10 ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.std10 && <p className="text-red-500 text-sm mt-1">{errors.std10}</p>}
          </div>
        </details>

        {/* Work Details */}
        <details className="p-4 group">
          <summary className="relative flex cursor-pointer items-center gap-4 pr-8 font-medium text-gray-700 dark:text-gray-200 transition-colors duration-300 focus-visible:outline-none group-hover:text-gray-900 dark:group-hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 shrink-0 stroke-emerald-500 dark:stroke-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Work Details
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-0 w-4 h-4 transition duration-300 top-1 shrink-0 stroke-gray-700 dark:stroke-gray-200 group-open:rotate-45"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </summary>
          <div className="mt-4 text-gray-500 dark:text-gray-400 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={jobData.workLocation}
                onChange={(e) => handleInputChange(e, "workLocation")}
                placeholder="Work Location"
                className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.workLocation ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.workLocation && (
                <p className="text-red-500 text-sm mt-1">{errors.workLocation}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                value={jobData.workDays}
                onChange={(e) => handleInputChange(e, "workDays")}
                placeholder="Work Days (e.g., Mon-Fri)"
                className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.workDays ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.workDays && <p className="text-red-500 text-sm mt-1">{errors.workDays}</p>}
            </div>
            <div>
              <input
                type="text"
                value={jobData.workTime}
                onChange={(e) => handleInputChange(e, "workTime")}
                placeholder="Work Time (e.g., 9 AM - 5 PM)"
                className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.workTime ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.workTime && <p className="text-red-500 text-sm mt-1">{errors.workTime}</p>}
            </div>
            <div>
              <input
                type="text"
                value={jobData.workMode}
                onChange={(e) => handleInputChange(e, "workMode")}
                placeholder="Work Mode (e.g., Full-time)"
                className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.workMode ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.workMode && <p className="text-red-500 text-sm mt-1">{errors.workMode}</p>}
            </div>
            <div>
              <input
                type="text"
                value={jobData.workModel}
                onChange={(e) => handleInputChange(e, "workModel")}
                placeholder="Work Model (e.g., WFO, WFH, Hybrid)"
                className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.workModel ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.workModel && (
                <p className="text-red-500 text-sm mt-1">{errors.workModel}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                value={jobData.CTC}
                onChange={(e) => handleInputChange(e, "CTC")}
                placeholder="CTC (e.g., 5 LPA)"
                className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.CTC ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.CTC && <p className="text-red-500 text-sm mt-1">{errors.CTC}</p>}
            </div>
            <div>
              <input
                type="text"
                value={jobData.department}
                onChange={(e) => handleInputChange(e, "department")}
                placeholder="Department (e.g., Engineering)"
                className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.department ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.department && (
                <p className="text-red-500 text-sm mt-1">{errors.department}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                value={jobData.bond}
                onChange={(e) => handleInputChange(e, "bond")}
                placeholder="Bond (e.g., 2 years or None)"
                className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.bond ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.bond && <p className="text-red-500 text-sm mt-1">{errors.bond}</p>}
            </div>
            <div>
               <h5 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Last Date to Apply</h5>
              <input
                type="date"
                value={jobData.lastDateForApplication}
                onChange={(e) => handleInputChange(e, "lastDateForApplication")}
                placeholder="Last Date to Apply"
                className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.lastDateForApplication
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.lastDateForApplication && (
                <p className="text-red-500 text-sm mt-1">{errors.lastDateForApplication}</p>
              )}
            </div>
          </div>
        </details>
      </section>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-lg font-medium text-white bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? "Submitting..." : "Post Job"}
        </button>
      </div>
    </div>
  );
};

export default PostJob;