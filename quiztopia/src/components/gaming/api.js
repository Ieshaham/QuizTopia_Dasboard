import { supabase } from '../supabaseClient';

export const fetchQuestionsBySubject = async (subject) => {
  try {
    console.log('API - Fetching questions for subject:', subject);
    console.log('API - Subject type:', typeof subject);
    
    // Fetch lessons with that subject, and their questions
    const { data: lessons, error } = await supabase
      .from('lessons')
      .select(`
        id,
        title,
        subject,
        grade_level,
        is_active,
        is_public,
        questions (
          id,
          question_text,
          options,
          correct_answer,
          explanation,
          difficulty_level,
          order_position
        )
      `)
      .eq('subject', subject)
      .eq('is_active', true)
      .eq('is_public', true);

    if (error) {
      console.error('API - Supabase error:', error);
      throw error;
    }

    console.log('API - Lessons found:', lessons?.length || 0);
    console.log('API - Lessons data:', lessons);

    if (!lessons || lessons.length === 0) {
      console.log('API - No lessons found for subject:', subject);
      
      // Let's also try to fetch ALL lessons to debug
      const { data: allLessons } = await supabase
        .from('lessons')
        .select('subject, title, is_active, is_public')
        .limit(10);
      
      console.log('API - All available lessons (sample):', allLessons);
      return [];
    }

    // Log each lesson's questions
    lessons.forEach(lesson => {
      console.log(`API - Lesson "${lesson.title}" has ${lesson.questions?.length || 0} questions`);
    });

    // Flatten all questions from all lessons
    const allQuestions = lessons.flatMap(lesson => 
      (lesson.questions || []).map(q => ({
        id: q.id,
        question: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        difficulty_level: q.difficulty_level,
        order_position: q.order_position,
        lesson_title: lesson.title,
        lesson_id: lesson.id
      }))
    );

    console.log('API - Total questions found:', allQuestions.length);

    // Shuffle questions for variety
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    
    console.log(`API - Returning ${shuffled.length} shuffled questions for ${subject}`);
    return shuffled;

  } catch (error) {
    console.error('API - Error in fetchQuestionsBySubject:', error);
    throw error; // Re-throw to let caller handle it
  }
};