import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assignmentService } from '../services/assignmentService';
import { questionService } from '../services/questionService';

function AssignmentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    duration: 30,
    questionIds: [],
  });

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuestions();
    if (isEditMode) {
      fetchAssignment();
    }
  }, [id]);

  const fetchQuestions = async () => {
    try {
      const data = await questionService.getAllQuestions();
      setQuestions(data);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    }
  };

  const fetchAssignment = async () => {
    try {
      const data = await assignmentService.getAssignmentById(id);
      
      // Format dates for datetime-local input
      const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      setFormData({
        name: data.name,
        description: data.description || '',
        startTime: formatDateForInput(data.startTime),
        endTime: formatDateForInput(data.endTime),
        duration: data.duration,
        questionIds: data.questions.map(q => q.id),
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch assignment');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value,
    }));
  };

  const handleQuestionToggle = (questionId) => {
    setFormData((prev) => ({
      ...prev,
      questionIds: prev.questionIds.includes(questionId)
        ? prev.questionIds.filter((id) => id !== questionId)
        : [...prev.questionIds, questionId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.questionIds.length === 0) {
      setError('Please select at least one question');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      };

      if (isEditMode) {
        await assignmentService.updateAssignment(id, payload);
      } else {
        await assignmentService.createAssignment(payload);
      }
      navigate('/assignments');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save assignment');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPoints = () => {
    return questions
      .filter((q) => formData.questionIds.includes(q.id))
      .reduce((sum, q) => sum + q.points, 0);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isEditMode ? 'Edit Assignment' : 'Create New Assignment'}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Assignment Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assignment Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Java Programming Quiz 1"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the assignment..."
            />
          </div>

          {/* Time Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Time *
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Time *
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Question Selection */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-semibold text-gray-700">
                Select Questions * ({formData.questionIds.length} selected)
              </label>
              <span className="text-sm font-semibold text-blue-600">
                Total Points: {calculateTotalPoints()}
              </span>
            </div>

            <div className="border border-gray-300 rounded-lg max-h-96 overflow-y-auto">
              {questions.length === 0 ? (
                <div className="p-4 text-center text-gray-600">
                  No questions available. Please create questions first.
                </div>
              ) : (
                <div className="divide-y">
                  {questions.map((question) => (
                    <div
                      key={question.id}
                      className="p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleQuestionToggle(question.id)}
                    >
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          checked={formData.questionIds.includes(question.id)}
                          onChange={() => handleQuestionToggle(question.id)}
                          className="mt-1 mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              question.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                              question.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {question.difficulty}
                            </span>
                            <span className="text-xs text-gray-600">
                              {question.points} points
                            </span>
                          </div>
                          <p className="text-sm text-gray-800">{question.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Assignment' : 'Create Assignment'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/assignments')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssignmentForm;