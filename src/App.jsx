import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import QuestionList from './components/QuestionList';
import QuestionForm from './components/QuestionForm';
import AssignmentList from './components/AssignmentList';
import AssignmentForm from './components/AssignmentForm';
import AvailableAssignments from './components/AvailableAssignments';
import AssignmentAttempt from './components/AssignmentAttempt';
import AttemptResults from './components/AttemptResults';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation Bar */}
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-2xl font-bold">
                Online Quiz System
              </Link>
              <div className="flex gap-6">
                <Link to="/" className="hover:text-blue-200 transition">
                  Home
                </Link>
                <Link to="/questions" className="hover:text-blue-200 transition">
                  Questions
                </Link>
                <Link to="/assignments" className="hover:text-blue-200 transition">
                  Assignments
                </Link>
                <Link to="/available-assignments" className="hover:text-blue-200 transition">
                  Take Quiz
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/questions" element={<QuestionList />} />
            <Route path="/questions/new" element={<QuestionForm />} />
            <Route path="/questions/edit/:id" element={<QuestionForm />} />
            <Route path="/assignments" element={<AssignmentList />} />
            <Route path="/assignments/new" element={<AssignmentForm />} />
            <Route path="/assignments/edit/:id" element={<AssignmentForm />} />
            <Route path="/available-assignments" element={<AvailableAssignments />} />
            <Route path="/attempt/:attemptId" element={<AssignmentAttempt />} />
            <Route path="/results/:attemptId" element={<AttemptResults />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;