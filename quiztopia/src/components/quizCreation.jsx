// import React, { useState } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { X, Plus, Trash2, Upload, Book, Brain, Save, TrendingUp, Clock, BookOpen, User, Settings, Bell } from 'lucide-react';

// const QuizCreationModal = ({ isOpen, onClose, onSubmit }) => {
//   const [newLesson, setNewLesson] = useState({
//     title: '',
//     subject: '',
//     gradeLevel: '',
//     description: ''
//   });

//   const [questions, setQuestions] = useState([
//     {
//       questionText: '',
//       questionType: 'multiple_choice',
//       answerChoices: ['', '', '', ''],
//       correctAnswer: '',
//       explanation: '',
//       difficultyLevel: 'medium',
//       videoFile: null
//     }
//   ]);

//   const [currentStep, setCurrentStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const addQuestion = () => {
//     setQuestions([...questions, {
//       questionText: '',
//       questionType: 'multiple_choice',
//       answerChoices: ['', '', '', ''],
//       correctAnswer: '',
//       explanation: '',
//       difficultyLevel: 'medium',
//       videoFile: null
//     }]);
//   };

//   const removeQuestion = (index) => {
//     if (questions.length > 1) {
//       setQuestions(questions.filter((_, i) => i !== index));
//     }
//   };

//   const updateQuestion = (index, field, value) => {
//     const updated = [...questions];
//     updated[index] = { ...updated[index], [field]: value };
//     setQuestions(updated);
//   };

//   const updateAnswerChoice = (questionIndex, choiceIndex, value) => {
//     const updated = [...questions];
//     updated[questionIndex].answerChoices[choiceIndex] = value;
//     setQuestions(updated);
//   };

//   const handleVideoUpload = (questionIndex, file) => {
//     const updated = [...questions];
//     updated[questionIndex].videoFile = file;
//     setQuestions(updated);
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     try {
//       await onSubmit({ newLesson, questions });
//       // Reset form
//       setNewLesson({
//         title: '',
//         subject: '',
//         gradeLevel: '',
//         description: ''
//       });
//       setQuestions([{
//         questionText: '',
//         questionType: 'multiple_choice',
//         answerChoices: ['', '', '', ''],
//         correctAnswer: '',
//         explanation: '',
//         difficultyLevel: 'medium',
//         videoFile: null
//       }]);
//       setCurrentStep(1);
//       onClose();
//     } catch (error) {
//       console.error('Error creating quiz:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const nextStep = () => {
//     if (currentStep < 2) setCurrentStep(currentStep + 1);
//   };

//   const prevStep = () => {
//     if (currentStep > 1) setCurrentStep(currentStep - 1);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 p-6 text-white">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
//                 <Brain className="w-6 h-6" />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold">Create New Quiz</h2>
//                 <p className="text-purple-100">Step {currentStep} of 2</p>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
          
//           {/* Progress Bar */}
//           <div className="mt-4 w-full bg-white/20 rounded-full h-2">
//             <div 
//               className="bg-white h-2 rounded-full transition-all duration-500"
//               style={{ width: `${(currentStep / 2) * 100}%` }}
//             />
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
//           {currentStep === 1 && (
//             <div className="space-y-6">
//               <div className="flex items-center space-x-2 mb-4">
//                 <Book className="w-5 h-5 text-purple-600" />
//                 <h3 className="text-lg font-semibold text-gray-800">Lesson Information</h3>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Lesson Title *
//                   </label>
//                   <input
//                     type="text"
//                     value={newLesson.title}
//                     onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                     placeholder="Enter lesson title"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Subject *
//                   </label>
//                   <select
//                     value={newLesson.subject}
//                     onChange={(e) => setNewLesson({...newLesson, subject: e.target.value})}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                     required
//                   >
//                     <option value="">Select Subject</option>
//                     <option value="math">Math</option>
//                     <option value="science">Science</option>
//                     <option value="reading">Reading</option>
//                     <option value="history">History</option>
//                     <option value="geography">Geography</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Grade Level *
//                   </label>
//                   <select
//                     value={newLesson.gradeLevel}
//                     onChange={(e) => setNewLesson({...newLesson, gradeLevel: e.target.value})}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                     required
//                   >
//                     <option value="">Select Grade</option>
//                     <option value="1">Grade 1</option>
//                     <option value="2">Grade 2</option>
//                     <option value="3">Grade 3</option>
//                     <option value="4">Grade 4</option>
//                     <option value="5">Grade 5</option>
//                     <option value="6">Grade 6</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Description
//                 </label>
//                 <textarea
//                   value={newLesson.description}
//                   onChange={(e) => setNewLesson({...newLesson, description: e.target.value})}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-24 resize-none"
//                   placeholder="Brief description of the lesson..."
//                 />
//               </div>
//             </div>
//           )}

//           {currentStep === 2 && (
//             <div className="space-y-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center space-x-2">
//                   <Brain className="w-5 h-5 text-purple-600" />
//                   <h3 className="text-lg font-semibold text-gray-800">Quiz Questions</h3>
//                 </div>
//                 <button
//                   onClick={addQuestion}
//                   className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all"
//                 >
//                   <Plus className="w-4 h-4" />
//                   <span>Add Question</span>
//                 </button>
//               </div>

//               {questions.map((question, questionIndex) => (
//                 <div key={questionIndex} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
//                   <div className="flex items-center justify-between mb-4">
//                     <h4 className="font-medium text-gray-800">Question {questionIndex + 1}</h4>
//                     {questions.length > 1 && (
//                       <button
//                         onClick={() => removeQuestion(questionIndex)}
//                         className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-all"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     )}
//                   </div>

//                   <div className="space-y-4">
//                     {/* Question Text */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Question Text *
//                       </label>
//                       <textarea
//                         value={question.questionText}
//                         onChange={(e) => updateQuestion(questionIndex, 'questionText', e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-20 resize-none"
//                         placeholder="Enter your question..."
//                         required
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {/* Question Type */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Question Type
//                         </label>
//                         <select
//                           value={question.questionType}
//                           onChange={(e) => updateQuestion(questionIndex, 'questionType', e.target.value)}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                         >
//                           <option value="multiple_choice">Multiple Choice</option>
//                           <option value="true_false">True/False</option>
//                           <option value="short_answer">Short Answer</option>
//                         </select>
//                       </div>

//                       {/* Difficulty Level */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Difficulty
//                         </label>
//                         <select
//                           value={question.difficultyLevel}
//                           onChange={(e) => updateQuestion(questionIndex, 'difficultyLevel', e.target.value)}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                         >
//                           <option value="easy">Easy</option>
//                           <option value="medium">Medium</option>
//                           <option value="hard">Hard</option>
//                         </select>
//                       </div>
//                     </div>

//                     {/* Answer Choices for Multiple Choice */}
//                     {question.questionType === 'multiple_choice' && (
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Answer Choices *
//                         </label>
//                         <div className="space-y-2">
//                           {question.answerChoices.map((choice, choiceIndex) => (
//                             <div key={choiceIndex} className="flex items-center space-x-2">
//                               <input
//                                 type="radio"
//                                 name={`correct-${questionIndex}`}
//                                 checked={question.correctAnswer === choice}
//                                 onChange={() => updateQuestion(questionIndex, 'correctAnswer', choice)}
//                                 className="w-4 h-4 text-purple-600"
//                               />
//                               <input
//                                 type="text"
//                                 value={choice}
//                                 onChange={(e) => updateAnswerChoice(questionIndex, choiceIndex, e.target.value)}
//                                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                                 placeholder={`Option ${String.fromCharCode(65 + choiceIndex)}`}
//                                 required
//                               />
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Correct Answer for other types */}
//                     {question.questionType !== 'multiple_choice' && (
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Correct Answer *
//                         </label>
//                         {question.questionType === 'true_false' ? (
//                           <select
//                             value={question.correctAnswer}
//                             onChange={(e) => updateQuestion(questionIndex, 'correctAnswer', e.target.value)}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                             required
//                           >
//                             <option value="">Select Answer</option>
//                             <option value="true">True</option>
//                             <option value="false">False</option>
//                           </select>
//                         ) : (
//                           <input
//                             type="text"
//                             value={question.correctAnswer}
//                             onChange={(e) => updateQuestion(questionIndex, 'correctAnswer', e.target.value)}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                             placeholder="Enter the correct answer"
//                             required
//                           />
//                         )}
//                       </div>
//                     )}

//                     {/* Explanation */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Explanation (Optional)
//                       </label>
//                       <textarea
//                         value={question.explanation}
//                         onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-16 resize-none"
//                         placeholder="Explain why this is the correct answer..."
//                       />
//                     </div>

//                     {/* Video Upload */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Video (Optional)
//                       </label>
//                       <div className="flex items-center space-x-2">
//                         <input
//                           type="file"
//                           accept="video/*"
//                           onChange={(e) => handleVideoUpload(questionIndex, e.target.files[0])}
//                           className="hidden"
//                           id={`video-${questionIndex}`}
//                         />
//                         <label
//                           htmlFor={`video-${questionIndex}`}
//                           className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl cursor-pointer transition-all"
//                         >
//                           <Upload className="w-4 h-4 text-gray-600" />
//                           <span className="text-sm text-gray-600">
//                             {question.videoFile ? question.videoFile.name : 'Upload Video'}
//                           </span>
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
//           <div>
//             {currentStep === 1 && (
//               <p className="text-sm text-gray-500">
//                 Fill in the basic lesson information
//               </p>
//             )}
//             {currentStep === 2 && (
//               <p className="text-sm text-gray-500">
//                 Add questions for your quiz ({questions.length} question{questions.length !== 1 ? 's' : ''})
//               </p>
//             )}
//           </div>

//           <div className="flex items-center space-x-3">
//             {currentStep > 1 && (
//               <button
//                 onClick={prevStep}
//                 className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
//               >
//                 Previous
//               </button>
//             )}
            
//             {currentStep < 2 ? (
//               <button
//                 onClick={nextStep}
//                 disabled={!newLesson.title || !newLesson.subject || !newLesson.gradeLevel}
//                 className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Next Step
//               </button>
//             ) : (
//               <button
//                 onClick={handleSubmit}
//                 disabled={isSubmitting || questions.some(q => !q.questionText || !q.correctAnswer)}
//                 className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Save className="w-4 h-4" />
//                 <span>{isSubmitting ? 'Creating...' : 'Create Quiz'}</span>
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuizCreationModal;



import React, { useState } from 'react';
import {
  X, Plus, Trash2, Book, Brain, Save
} from 'lucide-react';
import { supabase } from './supabaseClient';

const QuizCreationModal = ({ isOpen, onClose }) => {
  const [newLesson, setNewLesson] = useState({
    title: '',
    subject: '',
    gradeLevel: '',
    description: ''
  });

  const [questions, setQuestions] = useState([{
    questionText: '',
    questionType: 'multiple_choice',
    answerChoices: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    difficultyLevel: 'medium'
  }]);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, {
      questionText: '',
      questionType: 'multiple_choice',
      answerChoices: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      difficultyLevel: 'medium'
    }]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateAnswerChoice = (questionIndex, choiceIndex, value) => {
    const updated = [...questions];
    updated[questionIndex].answerChoices[choiceIndex] = value;
    setQuestions(updated);
  };

  const createQuiz = async ({ newLesson, questions }) => {
    setIsSubmitting(true);
    try {
      // 1️⃣ Get authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('You must be logged in.');

      // 2️⃣ Insert lesson
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .insert({
          title: newLesson.title,
          subject: newLesson.subject,
          grade_level: newLesson.gradeLevel,
          description: newLesson.description,
          created_by: user.id
        })
        .select()
        .single();
      if (lessonError) throw lessonError;

      // 3️⃣ Insert questions
      for (const q of questions) {
        const { error: questionError } = await supabase
          .from('questions')
          .insert({
            lesson_id: lessonData.id,
            user_id: user.id,
            question_text: q.questionText,
            question_type: q.questionType,
            options: q.answerChoices,
            correct_answer: q.correctAnswer,
            explanation: q.explanation,
            difficulty_level: parseInt(q.difficultyLevel) || 3
          });
        if (questionError) throw questionError;
      }

      // Reset form
      setNewLesson({ title: '', subject: '', gradeLevel: '', description: '' });
      setQuestions([{
        questionText: '',
        questionType: 'multiple_choice',
        answerChoices: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        difficultyLevel: 'medium'
      }]);
      setCurrentStep(1);
      onClose();
      alert('Quiz created successfully!');
    } catch (err) {
      console.error('Error creating quiz:', err);
      alert('Error creating quiz: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => createQuiz({ newLesson, questions });
  const nextStep = () => currentStep < 2 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Create New Quiz</h2>
                <p className="text-purple-100">Step {currentStep} of 2</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Book className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">Lesson Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title *</label>
                  <input
                    type="text"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter lesson title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <select
                    value={newLesson.subject}
                    onChange={(e) => setNewLesson({...newLesson, subject: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    <option value="">Select Subject</option>
                    <option value="math">Math</option>
                    <option value="science">Science</option>
                    <option value="reading">Reading</option>
                    <option value="history">History</option>
                    <option value="geography">Geography</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level *</label>
                  <select
                    value={newLesson.gradeLevel}
                    onChange={(e) => setNewLesson({...newLesson, gradeLevel: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    <option value="">Select Grade</option>
                    <option value="1">Grade 1</option>
                    <option value="2">Grade 2</option>
                    <option value="3">Grade 3</option>
                    <option value="4">Grade 4</option>
                    <option value="5">Grade 5</option>
                    <option value="6">Grade 6</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newLesson.description}
                  onChange={(e) => setNewLesson({...newLesson, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-24 resize-none"
                  placeholder="Brief description of the lesson..."
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Quiz Questions</h3>
                </div>
                <button
                  onClick={addQuestion}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question</span>
                </button>
              </div>

              {questions.map((question, questionIndex) => (
                <div key={questionIndex} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800">Question {questionIndex + 1}</h4>
                    {questions.length > 1 && (
                      <button
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Question Text */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question Text *</label>
                    <textarea
                      value={question.questionText}
                      onChange={(e) => updateQuestion(questionIndex, 'questionText', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-20 resize-none"
                      placeholder="Enter your question..."
                      required
                    />
                  </div>

                  {/* Answer Choices for Multiple Choice */}
                  {question.questionType === 'multiple_choice' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Answer Choices *</label>
                      <div className="space-y-2">
                        {question.answerChoices.map((choice, choiceIndex) => (
                          <div key={choiceIndex} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`correct-${questionIndex}`}
                              checked={question.correctAnswer === choice}
                              onChange={() => updateQuestion(questionIndex, 'correctAnswer', choice)}
                              className="w-4 h-4 text-purple-600"
                            />
                            <input
                              type="text"
                              value={choice}
                              onChange={(e) => updateAnswerChoice(questionIndex, choiceIndex, e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder={`Option ${String.fromCharCode(65 + choiceIndex)}`}
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Correct Answer for other types */}
                  {question.questionType !== 'multiple_choice' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer *</label>
                      {question.questionType === 'true_false' ? (
                        <select
                          value={question.correctAnswer}
                          onChange={(e) => updateQuestion(questionIndex, 'correctAnswer', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                        >
                          <option value="">Select Answer</option>
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={question.correctAnswer}
                          onChange={(e) => updateQuestion(questionIndex, 'correctAnswer', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Enter the correct answer"
                          required
                        />
                      )}
                    </div>
                  )}

                  {/* Explanation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (Optional)</label>
                    <textarea
                      value={question.explanation}
                      onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-16 resize-none"
                      placeholder="Explain why this is the correct answer..."
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div>
            {currentStep === 1 && <p className="text-sm text-gray-500">Fill in the basic lesson information</p>}
            {currentStep === 2 && <p className="text-sm text-gray-500">Add questions for your quiz ({questions.length} question{questions.length !== 1 ? 's' : ''})</p>}
          </div>
          <div className="flex items-center space-x-3">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
              >
                Previous
              </button>
            )}
            {currentStep < 2 ? (
              <button
                onClick={nextStep}
                disabled={!newLesson.title || !newLesson.subject || !newLesson.gradeLevel}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || questions.some(q => !q.questionText || !q.correctAnswer)}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Creating...' : 'Create Quiz'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCreationModal;