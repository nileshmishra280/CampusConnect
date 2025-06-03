import React,{useEffect, useState} from 'react'

import PostJob from './PostJob'
import { useAuth } from '../../context/AuthContext';
import UploadCompanyDetails from './UploadCompanyDetails';
const CompanyDashboard = () => {
  const { user } = useAuth();
  const [hasUploadedDetails, setHasUploadedDetails] = useState(false);

  useEffect(() => {
    if (user.company.hasAdded) {
      setHasUploadedDetails(true);
    }
  }, [user]);

  if (hasUploadedDetails === null) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }
  return (
    <div className="relative">
      <div className={hasUploadedDetails ? '' : 'blur-sm pointer-events-none select-none'}>
        <PostJob />
      </div>


      {
        !hasUploadedDetails && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
              <UploadCompanyDetails onSuccess={() => setHasUploadedDetails(true)} />
            </div>
          </div>
        )
      }
    </div>
  )
}


export default CompanyDashboard