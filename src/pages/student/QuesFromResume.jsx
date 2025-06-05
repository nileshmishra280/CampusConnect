import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchInterviewQuestions } from '../../api/studentApi';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuesFromResume = () => {
  const { user } = useAuth();
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Clean text for PDF
  const cleanText = (text) => {
    if (!text) return '';
    return text.toString().replace(/[^\x00-\x7F]/g, '').trim();
  };

  // Handle form submission to fetch questions
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setQuestions([]);
    setLoading(true);

    if (!user?.student?.resume) {
      setError('No resume found. Please upload a resume first.');
      toast.error('No resume found. Please upload a resume first.');
      setLoading(false);
      return;
    }

    if (numQuestions < 1 || numQuestions > 10) {
      setError('Please enter a number between 1 and 10.');
      toast.error('Please enter a number between 1 and 10.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetchInterviewQuestions(user.student.resume, numQuestions);
      if (!response.success) {
        const errorMsg = response.error || 'Failed to fetch questions';
        setError(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
        return;
      }
      setQuestions(response.data.questions);
      toast.success('Questions generated successfully!');
    } catch (err) {
      const errorMsg = err.message || 'Network error';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Generate modern PDF with enhanced styling
  const handleDownloadPDF = () => {
    if (questions.length === 0) {
      toast.error('No questions to download. Please generate questions first.');
      return;
    }

    setLoading(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;
      let yPos = margin;

      // Header with Gradient
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, pageWidth, 50, 'F');
      doc.setFillColor(29, 78, 216);
      doc.rect(0, 50, pageWidth, 5, 'F'); // Gradient effect

      // Logo or Icon (Simple geometric shape)
      doc.setFillColor(255, 255, 255);
      doc.circle(pageWidth - margin - 10, 25, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(59, 130, 246);
      doc.text('CC', pageWidth - margin - 10, 27, { align: 'center' });

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.setTextColor(255, 255, 255);
      doc.text('Interview Questions', pageWidth / 2, 25, { align: 'center' });

      // Subtitle
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(12);
      doc.setTextColor(219, 234, 254);
      doc.text('Tailored for Your Resume', pageWidth / 2, 35, { align: 'center' });

      yPos = 65;

      // Questions Section
      questions.forEach((q, index) => {
        const questionText = cleanText(q.question);
        const answerText = cleanText(q.answer);
        
        const questionLines = doc.splitTextToSize(`Q${index + 1}: ${questionText}`, contentWidth - 20);
        const answerLines = doc.splitTextToSize(answerText, contentWidth - 20);
        const totalHeight = questionLines.length * 7 + answerLines.length * 6 + 40;

        // Add new page if needed
        if (yPos + totalHeight > pageHeight - margin - 20) {
          doc.addPage();
          yPos = margin;
        }

        // Question Card with Shadow
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(229, 231, 235);
        doc.roundedRect(margin + 5, yPos - 5, contentWidth - 10, totalHeight - 10, 5, 5, 'FD');

        // Question Number
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(59, 130, 246);
        doc.text(`Question ${index + 1}`, margin + 15, yPos + 5);

        // Question Text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(31, 41, 55);
        doc.text(questionLines, margin + 15, yPos + 15);

        yPos += questionLines.length * 7 + 15;

        // Answer Label
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(107, 114, 128);
        doc.text('Sample Answer:', margin + 15, yPos);

        // Answer Text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(75, 85, 99);
        doc.text(answerLines, margin + 15, yPos + 10);

        yPos += answerLines.length * 6 + 25;
      });

      // Footer with Branding
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(0.3);
        doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
        
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text('Powered by CampusConnect', margin, pageHeight - 10);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }

      // Save PDF
      const timestamp = new Date().toISOString().slice(0, 10);
      doc.save(`Interview_Questions_${timestamp}.pdf`);
      toast.success('PDF downloaded successfully!');
    } catch (err) {
      console.error('PDF Error:', err);
      toast.error('Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Full Width Container */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section - Centered with max width */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8 sm:p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                Interview Questions Generator
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Transform your resume into personalized interview questions with AI-powered precision
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative">
                <label className="block text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
                  Number of Questions
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                    min="1"
                    max="10"
                    className="w-full px-6 py-4 text-lg border border-gray-300/50 dark:border-gray-600/50 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white transition-all duration-300 backdrop-blur-sm shadow-lg"
                    placeholder="Enter 1-10"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                    <span className="text-gray-400 text-sm">1-10</span>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-2xl hover:shadow-blue-500/25"
              >
                {loading && questions.length === 0 ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                    <span>Generating Questions...</span>
                  </div>
                ) : (
                  'Generate Questions'
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-8 p-6 bg-red-50/80 dark:bg-red-900/30 border border-red-200/50 dark:border-red-700/50 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Questions Section - Full Width with Scrollable Container */}
        {questions.length > 0 && (
          <div className="w-full">
            {/* Header Bar - Sticky */}
            <div className="sticky top-0 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg mb-8">
              <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Your Personalized Questions
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {questions.length} questions generated from your resume
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl transition-all duration-300 disabled:opacity-50 transform hover:scale-105 shadow-xl flex items-center space-x-3"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Questions Container */}
            <div className="max-w-7xl mx-auto px-6">
              <div 
                className="max-h-[70vh] overflow-y-auto pr-4 space-y-6 custom-scrollbar"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#cbd5e1 transparent'
                }}
              >
                <style jsx>{`
                  .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                    border-radius: 10px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #60a5fa, #3b82f6);
                    border-radius: 10px;
                    border: 2px solid transparent;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
                  }
                `}</style>

                {questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01]"
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-t-3xl px-8 py-6 border-b border-gray-200/30 dark:border-gray-700/30">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white font-bold text-xl">
                            {idx + 1}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Question {idx + 1}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Tailored from your resume
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-8 space-y-6">
                      {/* Question */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                            Interview Question
                          </h4>
                        </div>
                        <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200/30 dark:border-blue-700/30">
                          <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed font-medium">
                            {q.question}
                          </p>
                        </div>
                      </div>

                      {/* Sample Answer */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                            Sample Answer
                          </h4>
                        </div>
                        <div className="bg-emerald-50/50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-200/30 dark:border-emerald-700/30">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {q.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          className="mt-16"
        />
      </div>
    </div>
  );
};

export default QuesFromResume;