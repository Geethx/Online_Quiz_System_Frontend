import api from './api';

export const attemptService = {
  // Start a new attempt
  startAttempt: async (assignmentId) => {
    const response = await api.post(`/attempts/start/${assignmentId}`);
    return response.data;
  },

  // Get attempt by ID
  getAttemptById: async (id) => {
    const response = await api.get(`/attempts/${id}`);
    return response.data;
  },

  // Get attempts by assignment
  getAttemptsByAssignment: async (assignmentId) => {
    const response = await api.get(`/attempts/assignment/${assignmentId}`);
    return response.data;
  },

  // Submit an answer
  submitAnswer: async (attemptId, answerData) => {
    const response = await api.post(`/attempts/${attemptId}/answer`, answerData);
    return response.data;
  },

  // Submit the entire attempt
  submitAttempt: async (attemptId) => {
    const response = await api.post(`/attempts/${attemptId}/submit`);
    return response.data;
  },

  // Get all answers for an attempt
  getAnswersByAttempt: async (attemptId) => {
    const response = await api.get(`/attempts/${attemptId}/answers`);
    return response.data;
  },
};