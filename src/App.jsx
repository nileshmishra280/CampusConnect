import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Navigation from './components/Navigation';
import { useAuth } from './context/AuthContext';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import CompanyDashboard from './pages/company/CompanyDashboard';
import JobInfo from './pages/JobInfo';
import Loader from './components/Loader';
import ReviewApplications from './pages/company/ReviewApplications';
import QuickApply from './pages/student/QuickApply';
import Applicants from './pages/company/Applicants';
import StudentDetails from './pages/company/StudentDetails';
import SelectJob from './pages/company/SelectJob';
import SelectApplicants from './pages/company/SelectApplicants';
import Applications from './pages/student/Applications';
import JobDetails from './pages/student/JobDetails';
import JobDetailsForApplication from './pages/student/JobDetailsForApplication';
import QuesFromResume from './pages/student/QuesFromResume';
import AvailableJobs from './pages/student/AvailableJobs';
import AppliedJobs from './pages/student/AppliedJobs';
import ApplicationDetails from './pages/student/ApplicationDetails';
import SelectedStudents from './pages/company/SelectedStudents';
import AllocatedJobs from './pages/company/AllocatedJobs';
import RejectedStudents from './pages/company/RejectedStudents';
import CompanyProfile from './pages/company/CompanyProfile';
import PostJob from './pages/company/PostJob';
import Interview from './pages/company/Interview';
import JobsForScheduling from './pages/company/JobsForScheduling';
import ScheduleInterviews from './pages/company/ScheduleInterview';
import SelectApplicantsForInterview from './pages/company/SelectApplicantsForInterview';
import JobForUpcomingInterview from './pages/company/interview/JobForUpcomingInterview';
import ScheduledInformation from './pages/company/interview/ScheduledInformation';
import JobsForPastInterviews from './pages/company/interview/JobForPastInterviews';
import UpcomingJobInterview from './pages/student/Interview/UpcomingJobInterview';
import PastJobInterview from './pages/student/Interview/PastJobInterview';
import PastScheduledInformation from './pages/company/interview/PastScheduledInformation';
import Students from './pages/admin/Students';
import Companies from './pages/admin/Companies';

const App = () => {
  return <AppRoutes />;
};

const AppRoutes = () => {
  const { user, userType, loading, error } = useAuth();

  if (loading) {
    return <Loader />;
  }

  console.log('User:', user);
  console.log('User Type:', userType);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />


        <Route element={<Navigation role={userType} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/company/dashboard" element={<CompanyDashboard />} />

          <Route path="/company/applications/review" element={<ReviewApplications />} />
          <Route path="/company/applications/select" element={<SelectJob />} />
          <Route path="/company/applications/selected" element={<AllocatedJobs />} />
          
          <Route path="/company/applications/shortlisted" element={<AllocatedJobs />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/student/applications" element={<Applications />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/quickapply" element={<QuickApply />} />
          <Route path="/student/resumeQuestions" element={<QuesFromResume />} />
          <Route path="/student/apply-jobs/browse" element={<AvailableJobs />} />
          <Route path="/student/apply-jobs/applied" element={<AppliedJobs />} />
          <Route path="/student/applicationDetails" element={<ApplicationDetails />} />
          <Route path="/student/interview/upcoming" element={<UpcomingJobInterview />} />
          <Route path="/student/interview/past" element={<PastJobInterview />} />

          <Route path="/jobInfo" element={<JobInfo />} />
          <Route path="/company/profile" element={<CompanyProfile />} />
          <Route path='/company/applicants' element={<Applicants />} />
          <Route path='/company/applicantDetails' element={<StudentDetails />} />
          <Route path='/company/selectApplicants' element={<SelectApplicants />} />
          <Route path='/company/selectApplicantsForInterview' element={<SelectApplicantsForInterview />} />
          <Route path="/company/scheduleInterview" element={<ScheduleInterviews />} />

          <Route path='/company/selectedStudents' element={<SelectedStudents />} />
          <Route path='/company/rejectedStudents' element={<RejectedStudents />} />
          <Route path='/company/jobs/create' element={<PostJob />} />
          <Route path='/company/jobs/active' element={<ReviewApplications />} />
          <Route path='/company/interviews' element={<Interview />} />
          <Route path='/company/interviews/schedule' element={<JobsForScheduling />} />
          <Route path='/company/interviews/upcoming' element={<JobForUpcomingInterview />} />
          <Route path='/company/interviews/past' element={<JobsForPastInterviews />} />
          <Route path='/company/interviews/scheduledInformation' element={<ScheduledInformation />} />
          <Route path='/company/interviews/pastScheduledInformation' element={<PastScheduledInformation />} />
          
          <Route path='/student/applications/jobDetails' element={<JobDetails />} />
          <Route path='/student/vewDetailsForApplication' element={<JobDetailsForApplication />} />
        


          <Route path='/admin/users/students' element={<Students />} />
          <Route path='/admin/users/companies' element={<Companies />} />
        
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
