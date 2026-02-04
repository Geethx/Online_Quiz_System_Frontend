import api from './api';

export const questionService = {
  // Get all questions
  getAllQuestions: async () => {
    const response = await api.get('/questions');
    return response.data;
  },

  // Get question by ID
  getQuestionById: async (id) => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  },

  // Get questions by difficulty
  getQuestionsByDifficulty: async (difficulty) => {
    const response = await api.get(`/questions/difficulty/${difficulty}`);
    return response.data;
  },

  // Create new question
  createQuestion: async (questionData) => {
    const response = await api.post('/questions', questionData);
    return response.data;
  },

  // Update question
  updateQuestion: async (id, questionData) => {
    const response = await api.put(`/questions/${id}`, questionData);
    return response.data;
  },

  // Delete question
  deleteQuestion: async (id) => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  },
};