import React from "react";
import { EyeIcon } from '@heroicons/react/24/outline';
import { Link } from "react-router-dom";
export default function TableCompact({ applications }) {
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left border border-separate rounded border-slate-200" cellSpacing="0">
                <thead>
                    <tr>
                        <th className="h-10 px-4 text-sm font-medium border-l first:border-l-0 text-slate-700 bg-slate-100">Company</th>
                        <th className="h-10 px-4 text-sm font-medium border-l first:border-l-0 text-slate-700 bg-slate-100">Job Title</th>
                        <th className="h-10 px-4 text-sm font-medium border-l first:border-l-0 text-slate-700 bg-slate-100">Work Location</th>
                        <th className="h-10 px-4 text-sm font-medium border-l first:border-l-0 text-slate-700 bg-slate-100">CTC</th>
                        <th className="h-10 px-4 text-sm font-medium border-l first:border-l-0 text-slate-700 bg-slate-100">Status</th>
                        <th className="h-10 px-4 text-sm font-medium border-l first:border-l-0 text-slate-700 bg-slate-100">View More Details</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center p-4 text-slate-500">
                                No applications found.
                            </td>
                        </tr>
                    ) : (
                        applications.map((app, index) => (
                            <tr key={app._id}>
                                <td className="h-10 px-4 text-sm border-t border-l first:border-l-0 border-slate-200 text-slate-500">
                                    {app.company.companyName || 'N/A'}
                                </td>
                                <td className="h-10 px-4 text-sm border-t border-l first:border-l-0 border-slate-200 text-slate-500">
                                    {app.job?.jobTitle || 'N/A'}
                                </td>
                                <td className="h-10 px-4 text-sm border-t border-l first:border-l-0 border-slate-200 text-slate-500">
                                    {app.job?.workLocation || 'N/A'}
                                </td>
                                <td className="h-10 px-4 text-sm border-t border-l first:border-l-0 border-slate-200 text-slate-500">
                                    {app.job?.CTC || 'N/A'}
                                </td>
                                <td className="h-10 px-4 text-sm border-t border-l first:border-l-0 border-slate-200 text-slate-500">
                                    {app.status || 'Pending'}
                                </td>

                                <td className="h-10 px-4 text-sm border-t border-l first:border-l-0 border-slate-200 text-slate-500">
                                    <Link
                                        to="/jobInfo"
                                        state={{ job: app.job,company:app.company }}
                                    >
                                        <EyeIcon className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer" />
                                    </Link>

                                </td>

                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
