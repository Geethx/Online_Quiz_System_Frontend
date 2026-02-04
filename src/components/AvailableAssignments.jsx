import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assignmentService } from '../services/assignmentService';
import { attemptService } from '../services/attemptService';

function AvailableAssignments() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAvailableAssignments();
  }, []);

  const fetchAvailableAssignments = async () => {
    try {
      setLoading(true);
      const data = await assignmentService.getAvailableAssignments();
      setAssignments(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch available assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleStartAttempt = async (assignmentId) => {
    if (window.confirm('Are you ready to start this assignment? The timer will begin immediately.')) {
      try {
        const attempt = await attemptService.startAttempt(assignmentId);
        navigate(`/attempt/${attempt.id}`);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to start assignment');
      }
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading available assignments...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Assignments</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {assignments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 text-lg">No assignments are currently available.</p>
          <p className="text-gray-500 mt-2">Check back later or contact your instructor.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {assignment.name}
                  </h2>
                  {assignment.description && (
                    <p className="text-gray-600 mb-4">{assignment.description}</p>
                  )}
                </div>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  Available Now
                </span>
              </div>

              {/* Assignment Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-xs text-gray-600 mb-1">Duration</div>
                  <div className="font-bold text-blue-700">{assignment.duration} min</div>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-xs text-gray-600 mb-1">Questions</div>
                  <div className="font-bold text-purple-700">{assignment.questions?.length || 0}</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded">
                  <div className="text-xs text-gray-600 mb-1">Total Points</div>
                  <div className="font-bold text-yellow-700">{assignment.totalPoints}</div>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <div className="text-xs text-gray-600 mb-1">Ends At</div>
                  <div className="font-bold text-red-700 text-xs">
                    {formatDateTime(assignment.endTime)}
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={() => handleStartAttempt(assignment.id)}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold text-lg"
              >
                Start Assignment
              </button>

              {/* Instructions */}
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Important:</strong> Once you start, the timer will begin immediately. 
                  Make sure you have a stable internet connection. The assignment will auto-submit when time expires.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AvailableAssignments;