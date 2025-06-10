import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarouselTestimonial from './CarouselTestimonial';
import CarouselLogo from './CarouselLogo';
import { useAuth } from '../context/AuthContext';

// Features for the recruitment system
const features = [
  { name: 'One-Click Applications', icon: 'ri-mouse-line', color: 'text-blue-500', description: 'Students can apply to eligible companies with a single click, streamlining the application process.' },
  { name: 'Automated CGPA Validation', icon: 'ri-search-line', color: 'text-amber-500', description: 'Admins can verify student academic data automatically using CGPA extraction from mark sheets.' },
  { name: 'Smart Resume Analysis', icon: 'ri-file-text-line', color: 'text-green-500', description: 'Generate tailored interview questions based on student resume content.' },
  { name: 'Company Filters', icon: 'ri-filter-line', color: 'text-purple-500', description: 'Companies can filter candidates by CGPA, department, backlogs, and more.' },
  { name: 'Real-Time Notifications', icon: 'ri-notification-line', color: 'text-red-500', description: 'Students receive instant email alerts for eligible job opportunities.' },
  { name: 'Secure Role-Based Access', icon: 'ri-lock-line', color: 'text-indigo-500', description: 'Dedicated dashboards for students, companies, and admins with secure logins.' }
];

const LandingPage = () => {
  const { user, userType } = useAuth();
  const [theme, setTheme] = useState('dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    if (user) {
      if (userType === 'student') navigate('/student/dashboard');
      else if (userType === 'company') navigate('/company/dashboard');
      else if (userType === 'admin') navigate('/admin/dashboard');
    }
  }, [user, userType, navigate]);

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  // Menu toggle
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Check system theme preference on mount
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <>

      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* Navigation Bar */}
        <header className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <nav className="container mx-auto flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-2">
              <i className="ri-briefcase-fill text-2xl text-purple-500"></i>
              <span className="text-xl font-bold">CampusConnect</span>
            </div>

            <div className="hidden items-center space-x-8 md:flex">
              <a href="#features" className="transition-colors hover:text-purple-500">Features</a>
              <a href="#testimonials" className="transition-colors hover:text-purple-500">Testimonials</a>
              <a href="#roles" className="transition-colors hover:text-purple-500">Roles</a>
              <a href="#faq" className="transition-colors hover:text-purple-500">FAQ</a>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="rounded-full p-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <i className="ri-sun-line text-xl"></i>
                ) : (
                  <i className="ri-moon-line text-xl"></i>
                )}
              </button>

              <a
                href="/register"
                className="hidden rounded-lg bg-purple-600 px-6 py-2 text-white transition-colors hover:bg-purple-700 md:block"
              >
                SIGN UP
              </a>

              <button
                onClick={toggleMenu}
                className="rounded-full p-2 transition-colors hover:bg-gray-200 md:hidden dark:hover:bg-gray-700"
                aria-label="Toggle menu"
              >
                <i className="ri-menu-line text-xl"></i>
              </button>
            </div>
          </nav>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className={`md:hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="container mx-auto flex flex-col space-y-4 px-4 py-4">
                <a
                  href="#features"
                  className="py-2 transition-colors hover:text-purple-500"
                  onClick={() => setMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#testimonials"
                  className="py-2 transition-colors hover:text-purple-500"
                  onClick={() => setMenuOpen(false)}
                >
                  Testimonials
                </a>
                <a
                  href="#roles"
                  className="py-2 transition-colors hover:text-purple-500"
                  onClick={() => setMenuOpen(false)}
                >
                  Roles
                </a>
                <a
                  href="#faq"
                  className="py-2 transition-colors hover:text-purple-500"
                  onClick={() => setMenuOpen(false)}
                >
                  FAQ
                </a>
                <a
                  href="#get-started"
                  className="rounded-lg bg-purple-600 px-6 py-2 text-center text-white transition-colors hover:bg-purple-700"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started
                </a>
              </div>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="px-4 py-1">
          <div className="container mx-auto flex flex-col items-center md:flex-row">
            {/* Text Section */}
            <div className="mb-10 md:mb-0 md:w-1/2">
              <h1 className="mb-6 text-4xl font-bold md:text-5xl">
                Streamline Your Career with <span className="text-purple-500">CampusConnect</span>
              </h1>
              <p className="mb-8 text-lg opacity-90">
                A centralized platform for students, companies, and admins to simplify campus recruitment with automated verification and one-click applications.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <a
                  href="/login"
                  className="rounded-lg bg-purple-600 px-8 py-3 text-center text-white transition-colors hover:bg-purple-700"
                >
                  Get Started Now
                </a>
                <a
                  href="#how-it-works"
                  className="rounded-lg border border-purple-600 px-8 py-3 text-center text-purple-600 transition-colors hover:bg-purple-100 dark:hover:bg-purple-900"
                >
                  How It Works
                </a>
              </div>
            </div>

            {/* Image Section */}
            <div className="md:w-1/2 w-full">
              <div
                className={`relative overflow-hidden rounded-2xl shadow-2xl h-[400px] md:h-[500px] ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}
              >
                <img
                  src="../landing-bg.jpg"
                  alt="Recruitment Platform Interface"
                  className="w-full h-full object-cover"
                  onError={() => console.log('Image failed to load')}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-6">
                  <p className="text-lg font-semibold text-white">
                    Ready to kickstart your career?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Stats Section */}
        <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
              <div className="bg-opacity-50 dark:bg-opacity-20 rounded-xl bg-purple-50 p-6 shadow-lg backdrop-blur-sm dark:bg-purple-900">
                <i className="ri-briefcase-line mb-4 text-4xl text-purple-500"></i>
                <h3 className="mb-2 text-3xl font-bold">100+</h3>
                <p className="opacity-80">Companies Onboarded</p>
              </div>
              <div className="bg-opacity-50 dark:bg-opacity-20 rounded-xl bg-blue-50 p-6 shadow-lg backdrop-blur-sm dark:bg-blue-900">
                <i className="ri-user-line mb-4 text-4xl text-blue-500"></i>
                <h3 className="mb-2 text-3xl font-bold">10,000+</h3>
                <p className="opacity-80">Students Registered</p>
              </div>
              <div className="bg-opacity-50 dark:bg-opacity-20 rounded-xl bg-green-50 p-6 shadow-lg backdrop-blur-sm dark:bg-green-900">
                <i className="ri-file-check-line mb-4 text-4xl text-green-500"></i>
                <h3 className="mb-2 text-3xl font-bold">95%</h3>
                <p className="opacity-80">Faster Verification</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-4 py-20">
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Why Choose <span className="text-purple-500">CampusConnect</span> ?
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                >
                  <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${theme === 'dark' ? `bg-opacity-20 ${feature.color.replace('text-', 'bg-')}` : `bg-opacity-10 ${feature.color.replace('text-', 'bg-')}`}`}>
                    <i className={`${feature.icon} text-5xl ${feature.color}`}></i>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{feature.name}</h3>
                  <p className="opacity-80">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className={`px-4 py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="container mx-auto">
            <h2 className="mb-16 text-center text-3xl font-bold">How CampusConnect Works</h2>

            <div className="flex flex-col items-center justify-center space-y-12 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex max-w-sm flex-col items-center px-4 text-center">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-xl font-bold text-white">
                  1
                </div>
                <i className="ri-user-add-line mb-4 text-6xl text-purple-500"></i>
                <h3 className="mb-2 text-xl font-bold">Sign Up</h3>
                <p className="opacity-80">
                  Create an account with email verification for students, companies, or admins.
                </p>
              </div>

              <div className="hidden md:block">
                <i className="ri-arrow-right-line text-6xl text-purple-400"></i>
              </div>

              <div className="flex max-w-sm flex-col items-center px-4 text-center">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-xl font-bold text-white">
                  2
                </div>
                <i className="ri-briefcase-line mb-4 text-6xl text-purple-500"></i>
                <h3 className="mb-2 text-xl font-bold">Post or Apply</h3>
                <p className="opacity-80">
                  Companies post job details; students apply to eligible roles with one click.
                </p>
              </div>

              <div className="hidden md:block">
                <i className="ri-arrow-right-line text-6xl text-purple-400"></i>
              </div>

              <div className="flex max-w-sm flex-col items-center px-4 text-center">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-xl font-bold text-white">
                  3
                </div>
                <i className="ri-checkbox-circle-line mb-4 text-6xl text-purple-500"></i>
                <h3 className="mb-2 text-xl font-bold">Verify & Shortlist</h3>
                <p className="opacity-80">
                  Admins verify profiles automatically; companies shortlist candidates with filters.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="px-4 py-5">
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-3xl font-bold">
              What Our Users Say About <span className="text-purple-500">CampusConnect</span>
            </h2>
            <div className="max-w-7xl mx-auto"> {/* Changed from max-w-5xl to max-w-7xl */}
              <CarouselTestimonial />
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section id="roles" className="px-4 py-20">
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-3xl font-bold">Who Can Use CampusConnect?</h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} group cursor-pointer shadow-lg transition-all`}>
                <div className="mb-4 flex items-center">
                  <div className="text-blue-500 bg-opacity-20 mr-4 flex h-12 w-12 items-center justify-center rounded-full">
                    <i className="ri-user-line text-5xl text-blue-500"></i>
                  </div>
                  <h3 className="text-xl font-bold">Students</h3>
                </div>
                <p className="mb-4 opacity-80">
                  Upload resumes, receive job notifications, and apply to eligible roles instantly.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-70">One-Click Apply</span>
                  <span className="flex items-center text-purple-500 transition-transform group-hover:translate-x-1">
                    Register Now <i className="ri-arrow-right-line ml-1"></i>
                  </span>
                </div>
              </div>

              <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} group cursor-pointer shadow-lg transition-all`}>
                <div className="mb-4 flex items-center">
                  <div className="text-purple-500 bg-opacity-20 mr-4 flex h-12 w-12 items-center justify-center rounded-full">
                    <i className="ri-briefcase-line text-5xl text-purple-500"></i>
                  </div>
                  <h3 className="text-xl font-bold">Companies</h3>
                </div>
                <p className="mb-4 opacity-80">
                  Post jobs, filter candidates, and manage hiring with an intuitive dashboard.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-70">Advanced Filters</span>
                  <span className="flex items-center text-purple-500 transition-transform group-hover:translate-x-1">
                    Post Jobs <i className="ri-arrow-right-line ml-1"></i>
                  </span>
                </div>
              </div>

              <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} group cursor-pointer shadow-lg transition-all`}>
                <div className="mb-4 flex items-center">
                  <div className="text-green-500 bg-opacity-20 mr-4 flex h-12 w-12 items-center justify-center rounded-full">
                    <i className="ri-shield-user-line text-5xl text-green-500"></i>
                  </div>
                  <h3 className="text-xl font-bold">Admins</h3>
                </div>
                <p className="mb-4 opacity-80">
                  Automate student profile verification and manage recruitment processes efficiently.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-70">Auto-Verification</span>
                  <span className="flex items-center text-purple-500 transition-transform group-hover:translate-x-1">
                    Manage Now <i className="ri-arrow-right-line ml-1"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted Companies Section */}
        <section className={`px-4 py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-3xl font-bold">Trusted By Leading Companies</h2>
            <div className="max-w-7xl mx-auto"> {/* Changed from max-w-5xl to max-w-7xl */}
              <CarouselLogo />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className={`px-4 py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="container mx-auto max-w-3xl">
            <h2 className="mb-12 text-center text-3xl font-bold">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-md`}>
                <h3 className="mb-2 text-xl font-bold">Is CampusConnect free for students?</h3>
                <p className="opacity-90">
                  Yes, students can sign up and use the platform for free to apply to eligible companies and manage their profiles.
                </p>
              </div>

              <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-md`}>
                <h3 className="mb-2 text-xl font-bold">How do companies post jobs?</h3>
                <p className="opacity-90">
                  Companies can create an account, log in securely, and post job details with eligibility criteria through an intuitive dashboard.
                </p>
              </div>

              <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-md`}>
                <h3 className="mb-2 text-xl font-bold">How is student data verified?</h3>
                <p className="opacity-90">
                  Admins use automated CGPA extraction from uploaded mark sheets to verify student academic data, ensuring accuracy and efficiency.
                </p>
              </div>

              <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-md`}>
                <h3 className="mb-2 text-xl font-bold">Can companies filter candidates?</h3>
                <p className="opacity-90">
                  Yes, companies can apply filters like CGPA, department, and backlogs to shortlist candidates that meet their criteria.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`px-4 py-12 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-800'} text-white`}>
          <div className="container mx-auto">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div>
                <div className="mb-6 flex items-center space-x-2">
                  <i className="ri-briefcase-fill text-2xl text-purple-500"></i>
                  <span className="text-xl font-bold">CampusConnect</span>
                </div>
                <p className="mb-6 opacity-80">
                  The ultimate platform for streamlining campus recruitment for students, companies, and admins.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="transition-colors hover:text-purple-400">
                    <i className="ri-facebook-fill text-xl"></i>
                  </a>
                  <a href="#" className="transition-colors hover:text-purple-400">
                    <i className="ri-twitter-fill text-xl"></i>
                  </a>
                  <a href="#" className="transition-colors hover:text-purple-400">
                    <i className="ri-instagram-line text-xl"></i>
                  </a>
                  <a href="#" className="transition-colors hover:text-purple-400">
                    <i className="ri-youtube-fill text-xl"></i>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-bold">Quick Links</h4>
                <ul className="space-y-2 opacity-80">
                  <li><a href="#" className="transition-colors hover:text-purple-400">Home</a></li>
                  <li><a href="#features" className="transition-colors hover:text-purple-400">Features</a></li>
                  <li><a href="#testimonials" className="transition-colors hover:text-purple-400">Testimonials</a></li>
                  <li><a href="#roles" className="transition-colors hover:text-purple-400">Roles</a></li>
                  <li><a href="#faq" className="transition-colors hover:text-purple-400">FAQ</a></li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-bold">Support</h4>
                <ul className="space-y-2 opacity-80">
                  <li><a href="#" className="transition-colors hover:text-purple-400">Help Center</a></li>
                  <li><a href="#" className="transition-colors hover:text-purple-400">Privacy Policy</a></li>
                  <li><a href="#" className="transition-colors hover:text-purple-400">Terms of Service</a></li>
                  <li><a href="#" className="transition-colors hover:text-purple-400">Contact Us</a></li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-bold">Newsletter</h4>
                <p className="mb-4 opacity-80">Subscribe for updates on new job postings and features.</p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full rounded-l-lg bg-gray-700 px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    className="rounded-r-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
                  >
                    <i className="ri-send-plane-fill"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-12 border-t border-gray-700 pt-8 text-center opacity-70">
              <p>© {new Date().getFullYear()} CampusConnect. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;



// import React, { useState } from "react";

// function UploadDetails() {
//   const [images, setImages] = useState({
//     std10: null,
//     std12OrDiploma: null,
//     college: null,
//   });
//   const [response, setResponse] = useState(null);
//   const [error, setError] = useState(null);

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (files.length === 1) {
//       setImages((prev) => ({ ...prev, [name]: files[0] }));
//       setError(null);
//     } else {
//       setError(`Please select exactly 1 file for ${name}`);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setResponse(null);

//     if (!images.std10 || !images.std12OrDiploma || !images.college) {
//       setError("Please upload all three images.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("images", images.std10);
//     formData.append("images", images.std12OrDiploma);
//     formData.append("images", images.college);

//     try {
//       const res = await fetch("http://localhost:5000/student/uploadDetails", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         setError(errData.error || "Upload failed");
//         return;
//       }

//       const data = await res.json();
//       setResponse(data);
//     } catch (err) {
//       setError("Network error: " + err.message);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md mt-10">
//       <h2 className="text-2xl font-semibold mb-6 text-center">Upload Academic Documents</h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block mb-2 font-medium text-gray-700" htmlFor="std10">
//             Class 10th Marksheet
//           </label>
//           <input
//             type="file"
//             id="std10"
//             name="std10"
//             accept="image/*"
//             onChange={handleFileChange}
//             className="block w-full text-sm text-gray-500
//             file:mr-4 file:py-2 file:px-4
//             file:rounded file:border-0
//             file:text-sm file:font-semibold
//             file:bg-blue-50 file:text-blue-700
//             hover:file:bg-blue-100
//             "
//           />
//           {images.std10 && (
//             <p className="mt-1 text-sm text-green-600">{images.std10.name}</p>
//           )}
//         </div>

//         <div>
//           <label className="block mb-2 font-medium text-gray-700" htmlFor="std12OrDiploma">
//             Class 12th or Diploma Marksheet
//           </label>
//           <input
//             type="file"
//             id="std12OrDiploma"
//             name="std12OrDiploma"
//             accept="image/*"
//             onChange={handleFileChange}
//             className="block w-full text-sm text-gray-500
//             file:mr-4 file:py-2 file:px-4
//             file:rounded file:border-0
//             file:text-sm file:font-semibold
//             file:bg-blue-50 file:text-blue-700
//             hover:file:bg-blue-100
//             "
//           />
//           {images.std12OrDiploma && (
//             <p className="mt-1 text-sm text-green-600">{images.std12OrDiploma.name}</p>
//           )}
//         </div>

//         <div>
//           <label className="block mb-2 font-medium text-gray-700" htmlFor="college">
//             College Marksheet
//           </label>
//           <input
//             type="file"
//             id="college"
//             name="college"
//             accept="image/*"
//             onChange={handleFileChange}
//             className="block w-full text-sm text-gray-500
//             file:mr-4 file:py-2 file:px-4
//             file:rounded file:border-0
//             file:text-sm file:font-semibold
//             file:bg-blue-50 file:text-blue-700
//             hover:file:bg-blue-100
//             "
//           />
//           {images.college && (
//             <p className="mt-1 text-sm text-green-600">{images.college.name}</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
//         >
//           Upload
//         </button>
//       </form>

//       {error && (
//         <div className="mt-4 text-red-600 font-medium">{error}</div>
//       )}

//       {response && (
//         <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
//           <h3 className="font-semibold text-green-700 mb-2">Upload Successful</h3>
//           <pre className="text-sm text-gray-800 whitespace-pre-wrap">
//             {JSON.stringify(response, null, 2)}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// }

// export default UploadDetails;
