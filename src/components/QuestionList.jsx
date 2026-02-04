import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { questionService } from '../services/questionService';

function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchQuestions();
  }, [filter]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      let data;
      if (filter === 'ALL') {
        data = await questionService.getAllQuestions();
      } else {
        data = await questionService.getQuestionsByDifficulty(filter);
      }
      setQuestions(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await questionService.deleteQuestion(id);
        fetchQuestions();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete question');
      }
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-green-100 text-green-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'HARD':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOptionLabel = (index) => {
    return ['A', 'B', 'C', 'D'][index - 1];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Question Bank</h1>
        <Link
          to="/questions/new"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Question
        </Link>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded ${
              filter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('EASY')}
            className={`px-4 py-2 rounded ${
              filter === 'EASY' ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
          >
            Easy
          </button>
          <button
            onClick={() => setFilter('MEDIUM')}
            className={`px-4 py-2 rounded ${
              filter === 'MEDIUM' ? 'bg-yellow-600 text-white' : 'bg-gray-200'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setFilter('HARD')}
            className={`px-4 py-2 rounded ${
              filter === 'HARD' ? 'bg-red-600 text-white' : 'bg-gray-200'
            }`}
          >
            Hard
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No questions found. Create one to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(
                        question.difficulty
                      )}`}
                    >
                      {question.difficulty}
                    </span>
                    <span className="text-sm text-gray-600">
                      {question.points} points
                    </span>
                  </div>
                  <p className="text-lg font-medium text-gray-800">
                    {question.text}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/questions/edit/${question.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {[
                  { label: 'A', text: question.optionA, value: 1 },
                  { label: 'B', text: question.optionB, value: 2 },
                  { label: 'C', text: question.optionC, value: 3 },
                  { label: 'D', text: question.optionD, value: 4 },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`p-3 rounded border-2 ${
                      question.correctOption === option.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <span className="font-semibold mr-2">{option.label}.</span>
                    {option.text}
                    {question.correctOption === option.value && (
                      <span className="ml-2 text-green-600 font-semibold">✓ Correct</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuestionList;