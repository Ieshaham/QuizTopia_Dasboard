import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with your anon key
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const GenerateQuestionsPage = () => {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [error, setError] = useState("");

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Generate AI Questions</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Mathematics, Science, History"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Grade Level</label>
              <input
                type="number"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g., 5"
                min="1"
                max="12"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Number of Questions</label>
              <input
                type="number"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Math.max(1, Math.min(10, e.target.value)))}
                min="1"
                max="10"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Questions...
              </span>
            ) : (
              "Generate Questions"
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {generatedQuestions.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Generated Questions ({generatedQuestions.length})
            </h2>
            <div className="space-y-6">
              {generatedQuestions.map((q, index) => (
                <div
                  key={q.id || index}
                  className="border border-gray-200 rounded-lg p-5 bg-gray-50"
                >
                  <p className="font-semibold text-lg text-gray-800 mb-3">
                    {index + 1}. {q.question}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    {q.options?.map((opt, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded border ${
                          opt === q.correct_answer
                            ? "bg-green-100 border-green-300 font-medium"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </div>
                    ))}
                  </div>
                  <p className="text-green-700 font-bold text-sm">
                    ✓ Correct Answer: {q.correct_answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateQuestionsPage;