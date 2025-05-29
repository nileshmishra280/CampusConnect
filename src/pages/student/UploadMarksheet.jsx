import React, { useState } from 'react';
//import { postData } from '../utils/axios'; // Adjust path as needed

const UploadMarksheet = () => {
  const [images, setImages] = useState({
    std10: null,
    std12OrDiploma: null,
    college: null,
  });
  const [marks, setMarks] = useState({
    tenth: '',
    twelfth: '',
    cgpa: '',
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Handle file selection
  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files.length !== 1) {
      setError(`Please select exactly one file for ${name}.`);
      return;
    }

    setImages((prev) => ({ ...prev, [name]: files[0] }));
    setError(null);
  };

  // Handle form submission to fetch marks
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);
    setLoading(true);

    if (!images.std10 || !images.std12OrDiploma || !images.college) {
      setLoading(false);
      setError('Please upload all three marksheets.');
      return;
    }

    const formData = new FormData();
    formData.append('images', images.std10);
    formData.append('images', images.std12OrDiploma);
    formData.append('images', images.college);

    try {
      const res = await fetch('http://localhost:5000/student/uploadDetails', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Upload failed');
        setLoading(false);
        return;
      }

      // Parse the new response format
      setMarks({
        tenth: data.std10_percentage ? data.std10_percentage.replace('%', '') : '',
        twelfth: data.std12_percentage ? data.std12_percentage.replace('%', '') : data.diploma_cgpa || '',
        cgpa: data.college_cgpa || '',
      });
      setShowConfirmation(true);
      setResponse(data);
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle manual input changes
  const handleManualChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*\.?\d*$/.test(value)) {
      setMarks((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Confirm auto-filled marks and submit
  const handleConfirmMarks = async () => {
    setShowConfirmation(false);
    setLoading(true);

    const formData = new FormData();
    formData.append('images', images.std10);
    formData.append('images', images.std12OrDiploma);
    formData.append('images', images.college);
    formData.append('std10_percentage', parseFloat(marks.tenth) || 0);
    formData.append('std12_percentage', marks.twelfth ? parseFloat(marks.twelfth) || 0 : null);
    formData.append('diploma_cgpa', marks.twelfth ? null : parseFloat(marks.twelfth) || 0);
    formData.append('college_cgpa', marks.cgpa || '');

    try {
      const res = await fetch('http://localhost:5000/student/uploadDetails', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Upload failed');
        setLoading(false);
        return;
      }

      setResponse(data);
      setImages({ std10: null, std12OrDiploma: null, college: null });
      setMarks({ tenth: '', twelfth: '', cgpa: '' });
      setManualEntry(false);
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }

    // const formData = new FormData();
    // formData.append('std10', images.std10);
    // formData.append('std12OrDiploma', images.std12OrDiploma);
    // formData.append('college', images.college);
    // formData.append('marks', JSON.stringify(marks));
    // const success = await postData({
    //   url: 'http://localhost:3000/api/users/marksheet',
    //   formData,
    //   setError,
    //   setResponse,
    // });

    // if (success) {
    //   setImages({ std10: null, std12OrDiploma: null, college: null });
    //   setMarks({ tenth: '', twelfth: '', college: '' });
    //   setManualEntry(false);
    // }
    // setLoading(false);
  };

  // Enable manual entry mode
  const handleManualSubmit = async () => {
    setManualEntry(true);
    setShowConfirmation(false);
  };

  // Submit manual marks
  const handleManualSave = async () => {
    setLoading(true);
    if (!marks.tenth || !marks.twelfth || !marks.cgpa) {
      setError('Please enter all marks/CGPA.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('images', images.std10);
    formData.append('images', images.std12OrDiploma);
    formData.append('images', images.college);
    formData.append('std10_percentage', parseFloat(marks.tenth) || 0);
    formData.append('std12_percentage', marks.twelfth ? parseFloat(marks.twelfth) || 0 : null);
    formData.append('diploma_cgpa', marks.twelfth ? null : parseFloat(marks.twelfth) || 0);
    formData.append('college_cgpa', marks.cgpa || '');
    formData.append('isManual', 'true');

    try {
      const res = await fetch('http://localhost:5000/student/uploadDetails', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Upload failed');
        setLoading(false);
        return;
      }

      setResponse(data);
      setImages({ std10: null, std12OrDiploma: null, college: null });
      setMarks({ tenth: '', twelfth: '', cgpa: '' });
      setManualEntry(false);
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }

    // const formData = new FormData();
    // formData.append('std10', images.std10);
    // formData.append('std12OrDiploma', images.std12OrDiploma);
    // formData.append('college', images.college);
    // formData.append('marks', JSON.stringify(marks));
    // formData.append('isManual', 'true');

    // const success = await postData({
    //   url: 'http://localhost:3000/api/users/marksheet',
    //   formData,
    //   setError,
    //   setResponse,
    // });

    // if (success) {
    //   setImages({ std10: null, std12OrDiploma: null, college: null });
    //   setMarks({ tenth: '', twelfth: '', college: '' });
    //   setManualEntry(false);
    // }
    // setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md sm:max-w-lg lg:max-w-xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 sm:p-8 transition-all duration-300">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-6 sm:mb-8">
          Upload Academic Marksheets
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {['std10', 'std12OrDiploma', 'college'].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {field === 'std10'
                  ? 'Class 10th Marksheet'
                  : field === 'std12OrDiploma'
                  ? 'Class 12th or Diploma Marksheet'
                  : 'College Marksheet'}
              </label>
              <input
                type="file"
                id={field}
                name={field}
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300 dark:hover:file:bg-blue-800 transition-all"
              />
              {images[field] && (
                <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                  {images[field].name}
                </p>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>

        {/* Loader */}
        {loading && (
          <div className="mt-6 flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600 border-solid"></div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Fetching percentages...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg animate-fadeIn">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl animate-fadeIn">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Verify Fetched Marks
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Class 10th Percentage
                  </label>
                  <input
                    type="text"
                    name="tenth"
                    value={marks.tenth}
                    onChange={handleManualChange}
                    readOnly={!manualEntry}
                    className={`w-full p-2 mt-1 rounded-lg border bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      manualEntry ? 'border-gray-300 dark:border-gray-600' : 'border-transparent'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Class 12th/Diploma Percentage
                  </label>
                  <input
                    type="text"
                    name="twelfth"
                    value={marks.twelfth}
                    onChange={handleManualChange}
                    readOnly={!manualEntry}
                    className={`w-full p-2 mt-1 rounded-lg border bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      manualEntry ? 'border-gray-300 dark:border-gray-600' : 'border-transparent'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    College CGPA
                  </label>
                  <input
                    type="text"
                    name="cgpa"
                    value={marks.cgpa}
                    onChange={handleManualChange}
                    readOnly={!manualEntry}
                    className={`w-full p-2 mt-1 rounded-lg border bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      manualEntry ? 'border-gray-300 dark:border-gray-600' : 'border-transparent'
                    }`}
                  />
                </div>
                {!manualEntry && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Are you satisfied with these marks?
                  </p>
                )}
                {manualEntry && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    Manual entries require admin verification.
                  </p>
                )}
              </div>
              <div className="mt-6 flex gap-4 justify-end">
                {!manualEntry ? (
                  <>
                    <button
                      onClick={handleManualSubmit}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-all"
                    >
                      Enter Manually
                    </button>
                    <button
                      onClick={handleConfirmMarks}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                    >
                      Confirm & Save
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleManualSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Save Manual Marks
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {response && !showConfirmation && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg animate-fadeIn">
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
              {response.requiresVerification ? 'Upload Pending Verification' : 'Upload Successful'}
            </h3>
            <p className="text-sm text-gray-800 dark:text-gray-200">
              {response.requiresVerification
                ? 'Your manually entered marks are awaiting admin verification.'
                : 'Marksheets and marks uploaded successfully.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadMarksheet;