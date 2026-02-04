import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { attemptService } from '../services/attemptService';
import { assignmentService } from '../services/assignmentService';

function AssignmentAttempt() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);
  const autoSubmitRef = useRef(false);
  const submittingRef = useRef(false); // Add this ref

  // Remove submitting from dependencies
  const handleSubmit = useCallback(async (isAuto = false) => {
    if (submittingRef.current) return; // Use ref instead

    if (!isAuto) {
      const confirmed = window.confirm(
        'Are you sure you want to submit? You cannot change your answers after submission.'
      );
      if (!confirmed) return;
    }

    try {
      submittingRef.current = true; // Update ref
      setSubmitting(true);
      await attemptService.submitAttempt(attemptId);
      navigate(`/results/${attemptId}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit assignment');
      submittingRef.current = false; // Reset ref
      setSubmitting(false);
    }
  }, [attemptId, navigate]); // Remove submitting from here

  const handleAutoSubmit = useCallback(async () => {
    if (autoSubmitRef.current) return;
    autoSubmitRef.current = true;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    alert('Time is up! Your assignment will be submitted automatically.');
    await handleSubmit(true);
  }, [handleSubmit]);

  // Fetch attempt data on mount
  useEffect(() => {
    const fetchAttemptData = async () => {
      try {
        setLoading(true);
        const attemptData = await attemptService.getAttemptById(attemptId);
        
        if (attemptData.status !== 'IN_PROGRESS') {
          navigate(`/results/${attemptId}`);
          return;
        }

        const assignmentData = await assignmentService.getAssignmentById(attemptData.assignmentId);
        
        setAssignment(assignmentData);
        setQuestions(assignmentData.questions);
        setRemainingSeconds(attemptData.remainingTimeSeconds);

        // Initialize answers from attempt data
        const answersMap = {};
        attemptData.answers.forEach((answer) => {
          answersMap[answer.questionId] = {
            selectedAnswer: answer.selectedAnswer,
            markedForReview: answer.markedForReview,
          };
        });
        setAnswers(answersMap);

        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load assignment');
      } finally {
        setLoading(false);
      }
    };

    fetchAttemptData();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [attemptId, navigate]);

  // Timer countdown effect
  useEffect(() => {
    if (remainingSeconds > 0 && !autoSubmitRef.current && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current && (remainingSeconds === 0 || autoSubmitRef.current)) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [remainingSeconds, handleAutoSubmit]);

  const handleAnswerSelect = async (questionId, optionValue) => {
    const newAnswers = {
      ...answers,
      [questionId]: {
        ...answers[questionId],
        selectedAnswer: optionValue,
      },
    };
    setAnswers(newAnswers);

    // Save to backend
    try {
      await attemptService.submitAnswer(attemptId, {
        questionId,
        selectedAnswer: optionValue,
        markedForReview: newAnswers[questionId]?.markedForReview || false,
      });
    } catch (err) {
      console.error('Failed to save answer:', err);
    }
  };

  const handleMarkForReview = async (questionId) => {
    const newAnswers = {
      ...answers,
      [questionId]: {
        ...answers[questionId],
        markedForReview: !answers[questionId]?.markedForReview,
      },
    };
    setAnswers(newAnswers);

    // Save to backend
    try {
      await attemptService.submitAnswer(attemptId, {
        questionId,
        selectedAnswer: newAnswers[questionId]?.selectedAnswer || null,
        markedForReview: newAnswers[questionId]?.markedForReview,
      });
    } catch (err) {
      console.error('Failed to update review status:', err);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (questionId) => {
    const answer = answers[questionId];
    if (answer?.markedForReview) return 'review';
    if (answer?.selectedAnswer) return 'answered';
    return 'unanswered';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered':
        return 'bg-green-500 text-white';
      case 'review':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  const getAnsweredCount = () => {
    return Object.values(answers).filter((a) => a?.selectedAnswer).length;
  };

  const getReviewCount = () => {
    return Object.values(answers).filter((a) => a?.markedForReview).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading assignment...</div>
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

  if (!assignment || !questions.length) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Timer and Header */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{assignment.name}</h1>
                <p className="text-gray-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${
                  remainingSeconds < 300 ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {formatTime(remainingSeconds)}
                </div>
                <div className="text-sm text-gray-600">Time Remaining</div>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  currentQuestion.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                  currentQuestion.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentQuestion.difficulty}
                </span>
                <span className="text-sm text-gray-600">{currentQuestion.points} points</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                {currentQuestion.text}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {[
                { label: 'A', text: currentQuestion.optionA, value: 1 },
                { label: 'B', text: currentQuestion.optionB, value: 2 },
                { label: 'C', text: currentQuestion.optionC, value: 3 },
                { label: 'D', text: currentQuestion.optionD, value: 4 },
              ].map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleAnswerSelect(currentQuestion.id, option.value)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                    currentAnswer?.selectedAnswer === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      checked={currentAnswer?.selectedAnswer === option.value}
                      onChange={() => handleAnswerSelect(currentQuestion.id, option.value)}
                      className="mr-3"
                    />
                    <span className="font-semibold mr-2">{option.label}.</span>
                    <span>{option.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mark for Review */}
            <div className="mt-6">
              <button
                onClick={() => handleMarkForReview(currentQuestion.id)}
                className={`px-4 py-2 rounded transition ${
                  currentAnswer?.markedForReview
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {currentAnswer?.markedForReview ? '★ Marked for Review' : '☆ Mark for Review'}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Assignment'}
                </button>
              </div>

              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - Question Palette */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-4 sticky top-4">
            <h3 className="font-bold text-gray-800 mb-4">Question Palette</h3>

            {/* Summary */}
            <div className="mb-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span>Answered:</span>
                <span className="font-semibold text-green-600">{getAnsweredCount()}</span>
              </div>
              <div className="flex justify-between">
                <span>Not Answered:</span>
                <span className="font-semibold text-gray-600">
                  {questions.length - getAnsweredCount()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Marked:</span>
                <span className="font-semibold text-yellow-600">{getReviewCount()}</span>
              </div>
            </div>

            {/* Question Grid */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, index) => {
                const status = getQuestionStatus(question.id);
                return (
                  <button
                    key={question.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`aspect-square rounded flex items-center justify-center font-semibold text-sm transition ${getStatusColor(
                      status
                    )} ${
                      currentQuestionIndex === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span>Not Answered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentAttempt;