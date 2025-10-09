import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft, Save, AlertCircle, Edit2 } from 'lucide-react';
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export default function QuestionApprovalPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Get questions from navigation state (passed from GenerateQuestionsPage)
    const generatedQuestions = location.state?.questions || [];
    const subjectData = location.state?.subject || "";
    const gradeData = location.state?.grade || "";

    console.log("Received questions in approval page:", generatedQuestions);

    if (generatedQuestions.length > 0) {
      // Transform Grok API questions to include editing state
      const transformedQuestions = generatedQuestions.map((q, idx) => ({
        ...q,
        id: idx,
        approved: true, // Default all to approved
        editing: false,
        editedQuestion: q.question,
        editedOptions: [...q.options],
        editedCorrectAnswer: q.correct_answer,
        editedExplanation: q.explanation || ""
      }));

      setQuestions(transformedQuestions);
      setSubject(subjectData);
      setGrade(gradeData);
    }
  }, [location]);

  const handleToggleApproval = (id) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, approved: !q.approved } : q
    ));
  };

  const handleEdit = (id) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, editing: !q.editing } : q
    ));
  };

  const handleQuestionChange = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const handleOptionChange = (id, optionIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        const newOptions = [...q.editedOptions];
        const prefix = String.fromCharCode(65 + optionIndex);
        newOptions[optionIndex] = `${prefix}) ${value.replace(/^[A-D]\)\s*/, '')}`;
        return { ...q, editedOptions: newOptions };
      }
      return q;
    }));
  };

  const handleSaveEdit = (id) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        return {
          ...q,
          question: q.editedQuestion,
          options: q.editedOptions,
          correct_answer: q.editedCorrectAnswer,
          explanation: q.editedExplanation,
          editing: false
        };
      }
      return q;
    }));
  };

  const handleSaveToDatabase = async () => {
    const approvedQuestions = questions.filter(q => q.approved);
    
    if (approvedQuestions.length === 0) {
      setSaveError("Please approve at least one question before saving");
      return;
    }

    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Prepare questions for the Edge Function
      const questionsToSave = approvedQuestions.map(q => ({
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        user_id: user?.id || null,
        lesson_id: null
      }));

      console.log("Saving approved questions:", questionsToSave);

      // Call Edge Function to save with service role permissions
      const { data, error } = await supabase.functions.invoke(
        "save-approved-questions",
        {
          body: { questions: questionsToSave }
        }
      );

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to save questions");
      }

      setSaveSuccess(true);
      console.log(`Successfully saved ${data.count} approved questions!`);
      
      // Navigate to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard', { 
          state: { 
            message: `Successfully saved ${data.count} questions!`,
            type: 'success'
          } 
        });
      }, 2000);
      
    } catch (error) {
      console.error("Error saving questions:", error);
      setSaveError(error.message || "Failed to save questions to database");
    } finally {
      setSaving(false);
    }
  };

  const approvedCount = questions.filter(q => q.approved).length;

  // Show message when no questions are passed
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Questions to Approve</h2>
          <p className="text-gray-600 mb-6">Generate some questions first before accessing this page.</p>
          <button
            onClick={() => navigate('/generate-questions')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            Generate Questions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Review & Approve Questions
              </h1>
              <p className="text-gray-600">
                Review AI-generated questions for {subject} {grade && `- Grade ${grade}`}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <button
              onClick={() => navigate('/generate-questions')}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-all px-4 py-2.5 rounded-xl bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-md group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm">
                <span className="text-sm text-gray-600">Approved: </span>
                <span className="font-bold text-green-600">{approvedCount}</span>
                <span className="text-gray-400"> / {questions.length}</span>
              </div>

              <button
                onClick={handleSaveToDatabase}
                disabled={saving || approvedCount === 0}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Approved Questions</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Successfully saved {approvedCount} approved questions to the database!</span>
          </div>
        )}

        {/* Error Message */}
        {saveError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start space-x-2">
            <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{saveError}</span>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className={`bg-white rounded-2xl shadow-lg border-2 transition-all ${
                q.approved 
                  ? 'border-green-300 bg-gradient-to-br from-white to-green-50/30' 
                  : 'border-gray-200 opacity-60'
              }`}
            >
              <div className="p-6">
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 ${
                      q.approved ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    
                    {q.editing ? (
                      <textarea
                        value={q.editedQuestion}
                        onChange={(e) => handleQuestionChange(q.id, 'editedQuestion', e.target.value)}
                        className="flex-1 p-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        rows={3}
                      />
                    ) : (
                      <p className="font-semibold text-lg text-gray-800 flex-1">
                        {q.question}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(q.id)}
                      className={`p-2 rounded-lg transition-all ${
                        q.editing 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={q.editing ? "Editing" : "Edit question"}
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleToggleApproval(q.id)}
                      className={`p-2 rounded-lg transition-all ${
                        q.approved 
                          ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={q.approved ? "Approved - Click to reject" : "Rejected - Click to approve"}
                    >
                      {q.approved ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 ml-13">
                  {q.editedOptions.map((opt, i) => {
                    const isCorrect = opt === q.editedCorrectAnswer;
                    return (
                      <div key={i}>
                        {q.editing ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`correct-${q.id}`}
                              checked={isCorrect}
                              onChange={() => handleQuestionChange(q.id, 'editedCorrectAnswer', opt)}
                              className="w-4 h-4"
                            />
                            <input
                              type="text"
                              value={opt.replace(/^[A-D]\)\s*/, '')}
                              onChange={(e) => handleOptionChange(q.id, i, e.target.value)}
                              className="flex-1 p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        ) : (
                          <div
                            className={`p-3 rounded-xl border transition-all ${
                              isCorrect
                                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-sm font-medium text-gray-700 border border-gray-200">
                                {String.fromCharCode(65 + i)}
                              </span>
                              <span className={isCorrect ? "font-medium text-gray-800" : "text-gray-700"}>
                                {opt.replace(/^[A-D]\)\s*/, '')}
                              </span>
                              {isCorrect && (
                                <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Save Edit Button */}
                {q.editing && (
                  <button
                    onClick={() => handleSaveEdit(q.id)}
                    className="ml-13 mb-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                )}

                {/* Explanation */}
                {(q.explanation || q.editing) && (
                  <div className="ml-13 mt-3">
                    {q.editing ? (
                      <textarea
                        value={q.editedExplanation}
                        onChange={(e) => handleQuestionChange(q.id, 'editedExplanation', e.target.value)}
                        placeholder="Add an explanation (optional)"
                        className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        rows={2}
                      />
                    ) : q.explanation && (
                      <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg">
                        <span className="text-sm font-medium text-blue-700">Explanation: </span>
                        <span className="text-sm text-blue-900">{q.explanation}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">How to use this page:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Click the <CheckCircle className="w-4 h-4 inline text-green-600" /> or <XCircle className="w-4 h-4 inline text-gray-600" /> icon to approve or reject questions</li>
                <li>• Click the <Edit2 className="w-4 h-4 inline text-gray-600" /> icon to edit question text, options, or explanations</li>
                <li>• Only approved questions (with green checkmarks) will be saved to the database</li>
                <li>• You can change the correct answer while editing by selecting a different radio button</li>
                <li>• Questions are generated by Grok AI and should be reviewed before saving</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}