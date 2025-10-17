import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, TrendingUp, Clock, BookOpen, User, Settings, Bell } from 'lucide-react';
import QuizCreationModal from './quizCreation';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

// Initialize the Supabase client
const supabase = createClient(
  'https://kypfswyeviskcfkksekp.supabase.co', 
  'sb_publishable_HdnnG-pBApERIT9D0kctBA_oI1sSbPJ'
);

const QuizTopiaDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState('emma');
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const navigate = useNavigate();

  // Sample data
  const students = [
    { id: 'emma', name: 'Emma Johnson', age: 8 },
    { id: 'alex', name: 'Alex Johnson', age: 10 }
  ];

  const weeklyScores = [
    { day: 'Mon', score: 75 },
    { day: 'Tue', score: 82 },
    { day: 'Wed', score: 78 },
    { day: 'Thu', score: 85 },
    { day: 'Fri', score: 90 }
  ];

  const recentQuizzes = [
    { subject: 'Math', score: 90, time: '15 minutes ago' },
    { subject: 'Science', score: 75, time: '1 hour ago' },
    { subject: 'Reading', score: 95, time: 'Yesterday' }
  ];

  const currentStudent = students.find(s => s.id === selectedStudent);

  // Supabase submit function
  const submitQuizToSupabase = async ({ newLesson, questions }) => {
    try {
      console.log('Submitting quiz:', { newLesson, questions });
      const { data: { session }, error: authError } = await supabase.auth.signInAnonymously();
      const userId = session?.user?.id || '550e8400-e29b-41d4-a716-446655440000';

      // 1. Create lesson
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .insert({
          title: newLesson.title,
          subject: newLesson.subject,
          grade_level: parseInt(newLesson.gradeLevel),
          description: newLesson.description,
          duration_minutes: 15,
          created_by: userId,
          is_active: true
        })
        .select()
        .single();
      if (lessonError) throw lessonError;

      // 2. Create questions
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        let videoUrl = null;

        if (question.videoFile) {
          const fileExt = question.videoFile.name.split('.').pop();
          const fileName = `${lessonData.id}/${Date.now()}.${fileExt}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('lesson-videos')
            .upload(fileName, question.videoFile);
          if (uploadError) console.error('Video upload error:', uploadError);
          else videoUrl = supabase.storage.from('lesson-videos').getPublicUrl(uploadData.path).data.publicUrl;
        }

        const difficultyMap = { easy: 1, medium: 3, hard: 5 };
        const { data: questionData, error: questionError } = await supabase
          .from('questions')
          .insert({
            lesson_id: lessonData.id,
            question_text: question.questionText,
            question_type: question.questionType,
            correct_answer: question.correctAnswer,
            explanation: question.explanation || null,
            video_url: videoUrl,
            difficulty_level: difficultyMap[question.difficultyLevel] || 3,
            order_position: i + 1
          })
          .select()
          .single();
        if (questionError) throw questionError;

        // Insert answer choices if multiple choice
        if (question.questionType === 'multiple_choice' && question.answerChoices) {
          const choices = question.answerChoices
            .filter(choice => choice && choice.trim())
            .map((choice, index) => ({
              question_id: questionData.id,
              choice_text: choice.trim(),
              is_correct: choice.trim() === question.correctAnswer.trim(),
              choice_order: index + 1
            }));
          if (choices.length > 0) {
            const { error: choicesError } = await supabase.from('answer_choices').insert(choices);
            if (choicesError) throw choicesError;
          }
        }
      }

      alert(`Quiz "${newLesson.title}" created successfully!`);
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert(`Error creating quiz: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200 px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/quiztopia-logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent animate-pulse">QuizTopia</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-6 h-6 text-purple-600 hover:text-purple-800 cursor-pointer transition-all hover:scale-110" />
            <Settings
              className="w-6 h-6 text-purple-600 hover:text-purple-800 cursor-pointer transition-all hover:scale-110"
              onClick={() => navigate('/settings')}
              />

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-purple-700">Parent Portal</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 py-8">
        {/* Student Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-purple-700 mb-2">Select Student</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="px-4 py-2 border border-purple-300 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-lg"
          >
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} - Age {student.age}
              </option>
            ))}
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Average Score */}
          <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl p-6 shadow-xl border border-yellow-200 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mt-1">85%</p>
                <p className="text-sm text-yellow-600">Overall Performance</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg animate-bounce">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Today's Learning */}
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-xl border border-blue-200 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Time</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mt-1">2.5h</p>
                <p className="text-sm text-blue-600">Learning Time</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg animate-spin" style={{animationDuration: '3s'}}>
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Quizzes Completed */}
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-xl border border-purple-200 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quizzes Done</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mt-1">12</p>
                <p className="text-sm text-purple-600">This Week</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-gradient-to-r from-white to-green-50 rounded-2xl p-6 shadow-xl border border-green-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"></div>
            Current Status
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">Engagement Level</p>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 h-4 rounded-full shadow-sm animate-pulse" style={{ width: '80%' }}></div>
              </div>
              <p className="text-sm text-green-600 font-bold mt-2">80% - Highly Engaged 🎯</p>
            </div>
            <div className="text-right ml-6">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-3">
                <p className="text-sm font-bold text-green-800">Face Detection</p>
                <p className="text-xs text-green-600">Active Now ●</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Progress Chart */}
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-6 shadow-xl border border-indigo-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">📈 This Week's Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyScores} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} 
                />
                <Line type="monotone" dataKey="score" stroke="url(#progressGradient)" strokeWidth={4} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity & AI Tip */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Quizzes */}
          <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl p-6 shadow-xl border border-pink-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">🎯 Recent Quizzes</h3>
            <div className="space-y-4">
              {recentQuizzes.map((quiz, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-pink-100 rounded-xl hover:bg-pink-50 transition-all hover:scale-102 bg-white/50 backdrop-blur-sm">
                  <div>
                    <h4 className="font-bold text-gray-800">{quiz.subject}</h4>
                    <p className="text-sm text-pink-600">{quiz.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">{quiz.score}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Tip + Buttons */}
          <div className="bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 rounded-2xl p-6 border-2 border-yellow-300 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg animate-bounce">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">AI Smart Tip</h3>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-yellow-300 mb-4 shadow-lg">
              <p className="text-gray-800 font-medium">
                Focus on multiplication tables - this will help improve {currentStudent?.name.split(' ')[0]}'s math scores! 🚀
              </p>
            </div>

            <button
              onClick={() => navigate('/generate-questions')}
              className="w-full mb-3 bg-gradient-to-r from-green-400 to-teal-500 text-white py-3 px-4 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 font-bold shadow-lg"
            >
              📝 Generate AI Questions
            </button>

            <button 
              onClick={() => setIsQuizModalOpen(true)}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white py-3 px-4 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 font-bold shadow-lg"
            >
              ✨ Create Practice Quiz
            </button>
          </div>
        </div>

        {/* Quiz Modal */}
        <QuizCreationModal 
          isOpen={isQuizModalOpen}
          onClose={() => setIsQuizModalOpen(false)}
          onSubmit={submitQuizToSupabase}
        />
      </div>
    </div>
  );
};

export default QuizTopiaDashboard;
