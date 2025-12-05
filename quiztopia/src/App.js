import './App.css';
import AuthScreen from './components/auth';
import QuizTopiaDashboard from './components/dashboard';
import QuizCreationModal from './components/quizCreation';
import QuestionApprovalPage from './components/questionApprovalPage';
import SettingsPage from './components/settings';
import StudentGame from './components/gaming/studentGame';
import GenerateQuestionsPage from './components/generateQuestionsPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ⬅️ NEW IMPORT
import FocusTracker from './focus/FocusTracker';

function App() {
  return (
    <Router>

      {/* 🔥 ALWAYS RUN face tracking in background */}
      <FocusTracker />

      <Routes>
        <Route path="/" element={<AuthScreen />} />
        <Route path="/dashboard" element={<QuizTopiaDashboard />} />
        <Route path="/quizCreation" element={<QuizCreationModal />} />
        <Route path="/generate-questions" element={<GenerateQuestionsPage />} />
        <Route path="/approval" element={<QuestionApprovalPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Student Game Routes */}
        <Route path="/game/:subject" element={<StudentGame />} />
        <Route path="/game" element={<StudentGame />} />
        <Route path="/gaming/:subject" element={<StudentGame />} />
        <Route path="/gaming" element={<StudentGame />} />
      </Routes>
    </Router>
  );
}

export default App;
