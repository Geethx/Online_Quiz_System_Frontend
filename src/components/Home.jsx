import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
          Welcome to Online Quiz System
        </h1>
        <p className="text-lg text-gray-700 text-center mb-8">
          A modern full-stack quiz and assignment management platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Admin - Manage Questions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-blue-700 mb-3">
              Manage Questions
            </h2>
            <p className="text-gray-600 mb-4">
              Create, edit, and organize multiple choice questions with difficulty levels.
            </p>
            <Link
              to="/questions"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Go to Questions
            </Link>
          </div>

          {/* Admin - Manage Assignments */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-green-700 mb-3">
              Manage Assignments
            </h2>
            <p className="text-gray-600 mb-4">
              Create timed assignments, schedule availability, and track attempts.
            </p>
            <Link
              to="/assignments"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Go to Assignments
            </Link>
          </div>

          {/* Student - Take Quiz */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-purple-700 mb-3">
              Take Quiz
            </h2>
            <p className="text-gray-600 mb-4">
              View available assignments and start your timed quiz attempts.
            </p>
            <Link
              to="/available-assignments"
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              View Available Quizzes
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold text-center mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Multiple choice question management</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Timed assignment attempts</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Automatic submission on timer expiry</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Mark questions for review</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Assignment scheduling and availability</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Instant score calculation and results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;