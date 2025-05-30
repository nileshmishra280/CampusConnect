import { useLocation } from 'react-router-dom';

export default function JobInfo() {
  const { state } = useLocation();
  const job = state?.job;

  if (!job) return <div>No job data available.</div>;

  return (
    <div>
      <h1>{job.jobTitle}</h1>
      <p>{job.jobDescription}</p>
    </div>
  );
}
