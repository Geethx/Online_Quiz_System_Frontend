import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { attemptService } from '../services/attemptService';
import { assignmentService } from '../services/assignmentService';

function AssignmentResults() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignmentData, resultsData] = await Promise.all([
        assignmentService.getAssignmentById(id),
        attemptService.getAttemptsByAssignment(id)
      ]);
      setAssignment(assignmentData);
      setResults(resultsData);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeSpent = (seconds) => {
    if (!seconds && seconds !== 0) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 text-purple-400" style={{ borderTopColor: 'transparent', borderRadius: '50%', borderStyle: 'solid', borderLeftWidth: '4px', borderRightWidth: '4px', borderBottomWidth: '4px', borderTopWidth: '4px' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-red-900/20 border border-red-500/30 rounded-2xl text-red-400">
        <p className="text-center font-medium">{error}</p>
        <div className="mt-4 text-center">
          <Link to="/admin/assignments" className="text-purple-400 hover:underline">Back to Assignments</Link>
        </div>
      </div>
    );
  }

  const completedAttempts = results.filter(r => r.status === 'SUBMITTED' || r.status === 'AUTO_SUBMITTED');
  const avgScore = completedAttempts.length > 0 
    ? (completedAttempts.reduce((acc, curr) => acc + (curr.score || 0), 0) / completedAttempts.length).toFixed(1)
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to="/admin/assignments" className="text-purple-400 hover:text-purple-300 flex items-center gap-2 mb-2 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Assignments
          </Link>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-300 tracking-tight">
            Results: {assignment?.name}
          </h1>
          <p className="text-gray-400 mt-2">View performance details for all student submissions</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Submissions</p>
            <p className="text-2xl font-black text-white">{completedAttempts.length}</p>
          </div>
          <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Avg. Score</p>
            <p className="text-2xl font-black text-purple-400">{avgScore}%</p>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Student Name</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Score</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Time Spent</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Submitted At</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {results.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium italic">
                    No submissions found for this assignment yet.
                  </td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr key={result.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
                          {result.studentName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-white group-hover:text-purple-300 transition-colors">
                          {result.studentName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-black tracking-tight ${
                        result.status === 'SUBMITTED' ? 'bg-green-500/20 text-green-400' :
                        result.status === 'AUTO_SUBMITTED' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {result.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xl font-black text-white">
                          {result.score !== null ? result.score : '-'}
                          <span className="text-gray-500 text-sm font-normal ml-1">/ {result.totalPoints}</span>
                        </span>
                        {result.score !== null && (
                          <div className="w-24 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" 
                              style={{ width: `${(result.score / result.totalPoints) * 100}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 font-mono text-gray-300">
                      {formatTimeSpent(result.timeSpentSeconds)}
                    </td>
                    <td className="px-6 py-5 text-gray-400 text-sm">
                      {formatDateTime(result.submittedAt)}
                    </td>
                    <td className="px-6 py-5">
                      <Link 
                        to={`/results/${result.id}`}
                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all inline-flex items-center justify-center group/btn"
                        title="View Detailed Results"
                      >
                        <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AssignmentResults;
