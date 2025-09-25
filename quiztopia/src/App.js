import './App.css';
import AuthScreen from './components/auth';
import QuizTopiaDashboard from './components/dashboard';
import QuizCreationModal from './components/quizCreation';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthScreen />} />
        <Route path="/dashboard" element={<QuizTopiaDashboard />} />
        <Route path="/quizCreation" element={<QuizCreationModal />} />
      </Routes>
    </Router>
  );
}

export default App;
