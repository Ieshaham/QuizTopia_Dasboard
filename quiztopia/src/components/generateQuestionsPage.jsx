import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Brain, Sparkles, BookOpen, TrendingUp, CheckCircle, XCircle, Loader, ArrowLeft  } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 

// Initialize Supabase client with your anon key
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);


const GenerateQuestionsPage = () => {

  const navigate = useNavigate();


  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [error, setError] = useState("");

  const handleBack = () => {
    // Navigate to the dashboard page path
    navigate('/dashboard'); 
  };

  const handleGenerate = async () => {
    if (!subject || !grade || !numQuestions) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedQuestions([]);

    try {
      // Call the Supabase Edge Function
      const { data, error: fnError } = await supabase.functions.invoke(
        "generate-questions",
        {
          body: { 
            subject, 
            grade_level: parseInt(grade), 
            num_questions: parseInt(numQuestions),
            lesson_id: "example-lesson-uuid",
            user_id: "parent-uuid"
          }
        }
      );

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.success) {
        setGeneratedQuestions(data.questions || []);
      } else {
        setError(data?.error || "Failed to generate questions");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                AI Question Generator
              </h1>
              <p className="text-gray-600">Create custom questions powered by artificial intelligence</p>
            </div>
          </div>
        </div>

             {/* Back Button */}
            <button
                onClick={handleBack}
                className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-all px-4 py-2.5 rounded-xl bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-md group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Dashboard</span>
            </button>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-800">Generation Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Mathematics, Science"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade Level *
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              >
                <option value="">Select Grade</option>
                <option value="1">Grade 1</option>
                <option value="2">Grade 2</option>
                <option value="3">Grade 3</option>
                <option value="4">Grade 4</option>
                <option value="5">Grade 5</option>
                <option value="6">Grade 6</option>
                <option value="7">Grade 7</option>
                <option value="8">Grade 8</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions *
              </label>
              <input
                type="number"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Math.max(1, Math.min(10, e.target.value)))}
                min="1"
                max="10"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !subject || !grade || !numQuestions}
            className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white py-4 rounded-xl hover:shadow-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Generating Questions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Questions</span>
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start space-x-2">
              <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Generated Questions */}
        {generatedQuestions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Generated Questions
                </h2>
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-xl font-medium">
                {generatedQuestions.length} Question{generatedQuestions.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="space-y-6">
              {generatedQuestions.map((q, index) => (
                <div
                  key={q.id || index}
                  className="bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="font-semibold text-lg text-gray-800 flex-1">
                      {q.question}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 ml-11">
                    {q.options?.map((opt, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border transition-all ${
                          opt === q.correct_answer
                            ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-sm"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-700">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className={opt === q.correct_answer ? "font-medium text-gray-800" : "text-gray-700"}>
                            {opt}
                          </span>
                          {opt === q.correct_answer && (
                            <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="ml-11 flex items-center space-x-2 text-sm">
                    <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Correct: {q.correct_answer}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && generatedQuestions.length === 0 && !error && (
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Ready to Generate Questions
            </h3>
            <p className="text-gray-600">
              Fill in the details above and click "Generate Questions" to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateQuestionsPage;