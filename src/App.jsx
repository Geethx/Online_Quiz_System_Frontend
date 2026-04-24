import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import QuestionList from './components/QuestionList';
import QuestionForm from './components/QuestionForm';
import AssignmentList from './components/AssignmentList';
import AssignmentForm from './components/AssignmentForm';
import AvailableAssignments from './components/AvailableAssignments';
import AssignmentAttempt from './components/AssignmentAttempt';
import AttemptResults from './components/AttemptResults';
import AssignmentResults from './components/AssignmentResults';

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav style={{
      background: 'linear-gradient(135deg, rgba(15, 12, 41, 0.95) 0%, rgba(48, 43, 99, 0.95) 100%)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    }}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">QuizSystem</span>
          </Link>

          <div className="flex items-center gap-1">
            {isAdmin() ? (
              // Admin Navigation
              <>
                <Link to="/admin/questions"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200">
                  Questions
                </Link>
                <Link to="/admin/assignments"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200">
                  Assignments
                </Link>
              </>
            ) : (
              // Student Navigation
              <>
                <Link to="/available-assignments"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200">
                  Available Quizzes
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* User Info Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                style={{
                  background: isAdmin()
                    ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}>
                {user.fullName?.charAt(0)?.toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white leading-none">{user.fullName}</p>
                <p className="text-xs mt-0.5 leading-none"
                  style={{
                    color: isAdmin() ? '#f093fb' : '#667eea',
                  }}>
                  {user.role}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                color: '#ef4444',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.15)';
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>
        <svg className="animate-spin h-10 w-10 text-purple-400" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>
      <Navbar />
      <div className={user ? "container mx-auto px-4 py-8" : ""}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin/assignments' : '/available-assignments'} replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin/assignments' : '/available-assignments'} replace /> : <Register />} />

          {/* Admin Routes */}
          <Route path="/admin/questions" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <QuestionList />
            </ProtectedRoute>
          } />
          <Route path="/admin/questions/new" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <QuestionForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/questions/edit/:id" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <QuestionForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/assignments" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AssignmentList />
            </ProtectedRoute>
          } />
          <Route path="/admin/assignments/new" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AssignmentForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/assignments/edit/:id" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AssignmentForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/assignments/:id/results" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AssignmentResults />
            </ProtectedRoute>
          } />

          {/* Student Routes */}
          <Route path="/available-assignments" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
              <AvailableAssignments />
            </ProtectedRoute>
          } />
          <Route path="/attempt/:attemptId" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
              <AssignmentAttempt />
            </ProtectedRoute>
          } />
          <Route path="/results/:attemptId" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
              <AttemptResults />
            </ProtectedRoute>
          } />

          {/* Legacy routes redirect */}
          <Route path="/questions" element={<Navigate to="/admin/questions" replace />} />
          <Route path="/questions/new" element={<Navigate to="/admin/questions/new" replace />} />
          <Route path="/questions/edit/:id" element={<Navigate to="/admin/questions/edit/:id" replace />} />
          <Route path="/assignments" element={<Navigate to="/admin/assignments" replace />} />
          <Route path="/assignments/new" element={<Navigate to="/admin/assignments/new" replace />} />
          <Route path="/assignments/edit/:id" element={<Navigate to="/admin/assignments/edit/:id" replace />} />

          {/* Default redirect */}
          <Route path="/" element={
            user
              ? <Navigate to={user.role === 'ADMIN' ? '/admin/assignments' : '/available-assignments'} replace />
              : <Navigate to="/login" replace />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;