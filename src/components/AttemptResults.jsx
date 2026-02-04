import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { attemptService } from '../services/attemptService';
import { assignmentService } from '../services/assignmentService';

function AttemptResults() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResultsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);

  const fetchResultsData = async () => {
    try {
      setLoading(true);
      const attemptData = await attemptService.getAttemptById(attemptId);
      
      if (attemptData.status === 'IN_PROGRESS') {
        navigate(`/attempt/${attemptId}`);
        return;
      }

      const assignmentData = await assignmentService.getAssignmentById(attemptData.assignmentId);
      const answersData = await attemptService.getAnswersByAttempt(attemptId);

      setAttempt(attemptData);
      setAssignment(assignmentData);
      setQuestions(assignmentData.questions);
      setAnswers(answersData);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const getAnswerForQuestion = (questionId) => {
    return answers.find((a) => a.questionId === questionId);
  };

  const getCorrectAnswers = () => {
    return answers.filter((a) => a.isCorrect).length;
  };

  const getIncorrectAnswers = () => {
    return answers.filter((a) => a.selectedAnswer && !a.isCorrect).length;
  };

  const getUnanswered = () => {
    return answers.filter((a) => !a.selectedAnswer).length;
  };

  const getPercentage = () => {
    if (!attempt?.totalPoints) return 0;
    return ((attempt.score / attempt.totalPoints) * 100).toFixed(2);
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'B', color: 'text-blue-600' };
    if (percentage >= 70) return { grade: 'C', color: 'text-yellow-600' };
    if (percentage >= 60) return { grade: 'D', color: 'text-orange-600' };
    return { grade: 'F', color: 'text-red-600' };
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

  const getOptionLabel = (value) => {
    return ['A', 'B', 'C', 'D'][value - 1];
  };

  const getOptionText = (question, value) => {
    switch (value) {
      case 1: return question.optionA;
      case 2: return question.optionB;
      case 3: return question.optionC;
      case 4: return question.optionD;
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!attempt || !assignment) {
    return null;
  }

  const percentage = getPercentage();
  const gradeInfo = getGrade(percentage);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Assignment Results</h1>
          <h2 className="text-2xl text-gray-600">{assignment.name}</h2>
        </div>

        {/* Score Display */}
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {attempt.score} / {attempt.totalPoints}
            </div>
            <div className="text-2xl text-gray-600 mb-2">{percentage}%</div>
            <div className={`text-4xl font-bold ${gradeInfo.color}`}>
              Grade: {gradeInfo.grade}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{getCorrectAnswers()}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-600">{getIncorrectAnswers()}</div>
            <div className="text-sm text-gray-600">Incorrect</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-gray-600">{getUnanswered()}</div>
            <div className="text-sm text-gray-600">Unanswered</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{questions.length}</div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>
        </div>

        {/* Attempt Info */}
        <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Started:</span> {formatDateTime(attempt.startedAt)}
          </div>
          <div>
            <span className="font-semibold">Submitted:</span> {formatDateTime(attempt.submittedAt)}
          </div>
          <div>
            <span className="font-semibold">Status:</span>{' '}
            <span className={`px-2 py-1 rounded ${
              attempt.status === 'SUBMITTED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {attempt.status === 'AUTO_SUBMITTED' ? 'Auto Submitted (Time Expired)' : 'Submitted'}
            </span>
          </div>
          <div>
            <span className="font-semibold">Duration:</span> {assignment.duration} minutes
          </div>
        </div>
      </div>

      {/* Detailed Answers */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Review</h2>

        <div className="space-y-6">
          {questions.map((question, index) => {
            const answer = getAnswerForQuestion(question.id);
            const isCorrect = answer?.isCorrect;
            const wasAnswered = answer?.selectedAnswer !== null && answer?.selectedAnswer !== undefined;

            return (
              <div
                key={question.id}
                className={`border-2 rounded-lg p-6 ${
                  isCorrect ? 'border-green-500 bg-green-50' :
                  wasAnswered ? 'border-red-500 bg-red-50' :
                  'border-gray-300 bg-gray-50'
                }`}
              >
                {/* Question Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-lg">Question {index + 1}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        question.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                        question.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {question.difficulty}
                      </span>
                      <span className="text-sm text-gray-600">{question.points} points</span>
                    </div>
                    <p className="text-gray-800 font-medium">{question.text}</p>
                  </div>
                  <div className="ml-4">
                    {isCorrect ? (
                      <div className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold">
                        ✓ Correct
                      </div>
                    ) : wasAnswered ? (
                      <div className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold">
                        ✗ Incorrect
                      </div>
                    ) : (
                      <div className="bg-gray-600 text-white px-4 py-2 rounded-full font-semibold">
                        Not Answered
                      </div>
                    )}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2 mt-4">
                  {[1, 2, 3, 4].map((optionValue) => {
                    const isUserAnswer = answer?.selectedAnswer === optionValue;
                    const isCorrectAnswer = question.correctOption === optionValue;

                    return (
                      <div
                        key={optionValue}
                        className={`p-3 rounded border-2 ${
                          isCorrectAnswer ? 'border-green-500 bg-green-100' :
                          isUserAnswer ? 'border-red-500 bg-red-100' :
                          'border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="font-semibold mr-2">
                              {getOptionLabel(optionValue)}.
                            </span>
                            <span>{getOptionText(question, optionValue)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {isUserAnswer && (
                              <span className="text-sm font-semibold text-blue-600">
                                Your Answer
                              </span>
                            )}
                            {isCorrectAnswer && (
                              <span className="text-sm font-semibold text-green-600">
                                ✓ Correct Answer
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Points Earned */}
                <div className="mt-4 text-sm text-gray-700">
                  <span className="font-semibold">Points Earned:</span>{' '}
                  {isCorrect ? question.points : 0} / {question.points}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => navigate('/available-assignments')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          View Available Assignments
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default AttemptResults;