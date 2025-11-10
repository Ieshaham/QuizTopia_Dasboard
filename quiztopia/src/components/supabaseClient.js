// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
// const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error("Supabase URL or anon key is missing. Check your .env file.");
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// api.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);


// Fetch all active lessons
export const fetchLessons = async () => {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('is_active', true);
  if (error) throw error;
  return data;
};

// Fetch questions for a specific lesson
export const fetchQuestions = async (lesson_id) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('lesson_id', lesson_id);
  if (error) throw error;
  return data;
};

// Fetch all students (children)
export const fetchStudents = async () => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('role', 'child');
  if (error) throw error;
  return data;
};

// Insert user progress
export const insertProgress = async ({ user_id, lesson_id, question_id, user_answer, is_correct, concentration_score }) => {
  const { data, error } = await supabase
    .from('user_progress')
    .insert([{ user_id, lesson_id, question_id, user_answer, is_correct, concentration_score }]);
  if (error) throw error;
  return data;
};

// Fetch child scores for dashboard
export const fetchChildScores = async (user_id) => {
  const { data, error } = await supabase
    .from('child_lesson_scores')
    .select('*')
    .eq('user_id', user_id);
  if (error) throw error;
  return data;
};

// Fetch recent quizzes for a student
export const fetchRecentQuizzes = async (user_id, limit = 5) => {
  const { data, error } = await supabase
    .from('user_progress')
    .select('lesson_id, is_correct, completed_at')
    .eq('user_id', user_id)
    .order('completed_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
};

// Subscribe to real-time progress updates
export const subscribeProgress = (user_id, callback) => {
  const subscription = supabase
    .from(`user_progress:user_id=eq.${user_id}`)
    .on('INSERT', payload => callback(payload.new))
    .subscribe();

  return () => supabase.removeSubscription(subscription);
};

