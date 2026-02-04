import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assignmentService } from '../services/assignmentService';

function AssignmentList() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await assignmentService.getAllAssignments();
      setAssignments(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await assignmentService.deleteAssignment(id);
        fetchAssignments();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete assignment');
      }
    }
  };

  const formatDateTime = (dateString) => {
    // Parse the date string and format it for display
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return `${month} ${day}, ${year}, ${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading assignments...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Assignments</h1>
        <Link
          to="/assignments/new"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Create Assignment
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Assignments List */}
      {assignments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No assignments found. Create one to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg shadow p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-gray-800">
                      {assignment.name}
                    </h2>
                    {assignment.isAvailable ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        Available
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                        Not Available
                      </span>
                    )}
                  </div>
                  {assignment.description && (
                    <p className="text-gray-600 mb-3">{assignment.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/assignments/edit/${assignment.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(assignment.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Start Time</div>
                  <div className="font-semibold text-gray-800">
                    {formatDateTime(assignment.startTime)}
                  </div>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-sm text-gray-600">End Time</div>
                  <div className="font-semibold text-gray-800">
                    {formatDateTime(assignment.endTime)}
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="font-semibold text-gray-800">
                    {assignment.duration} minutes
                  </div>
                </div>
                <div className="bg-yellow-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Total Points</div>
                  <div className="font-semibold text-gray-800">
                    {assignment.totalPoints} points
                  </div>
                </div>
              </div>

              {/* Questions Count */}
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Questions:</span> {assignment.questions?.length || 0}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AssignmentList;