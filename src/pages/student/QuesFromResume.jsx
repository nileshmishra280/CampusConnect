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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 transform transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Interview Questions Generator
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Craft personalized interview questions from your resume with ease
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
              Number of Questions (1-10)
            </label>
            <input
              type="number"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              min="1"
              max="10"
              className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              placeholder="Enter number of questions"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading && questions.length === 0 ? 'Generating Questions...' : 'Generate Questions'}
          </button>
        </form>

        {/* Loading Spinner */}
        {loading && (
          <div className="mt-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300 text-lg">
              {questions.length === 0 ? 'Generating questions...' : 'Creating PDF...'}
            </span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-8 p-5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl animate-pulse">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Questions Display */}
        {questions.length > 0 && (
          <div className="mt-12 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Personalized Interview Questions
              </h3>
              <button
                onClick={handleDownloadPDF}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 transform hover:scale-105"
              >
                {loading ? 'Generating PDF...' : 'Download as PDF'}
              </button>
            </div>

            <div className="grid gap-6">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-700 rounded-xl p-8 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Question {idx + 1}
                        </h4>
                        <p className="mt-2 text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                          {q.question}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          Sample Answer
                        </h4>
                        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                          {q.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
        />
      </div>
    </div>
  );
};

export default QuesFromResume;