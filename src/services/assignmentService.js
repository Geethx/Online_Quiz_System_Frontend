import api from './api';

export const assignmentService = {
  // Get all assignments
  getAllAssignments: async () => {
    const response = await api.get('/assignments');
    return response.data;
  },

  // Get available assignments
  getAvailableAssignments: async () => {
    const response = await api.get('/assignments/available');
    return response.data;
  },

  // Get assignment by ID
  getAssignmentById: async (id) => {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  },

  // Create new assignment
  createAssignment: async (assignmentData) => {
    const response = await api.post('/assignments', assignmentData);
    return response.data;
  },

  // Update assignment
  updateAssignment: async (id, assignmentData) => {
    const response = await api.put(`/assignments/${id}`, assignmentData);
    return response.data;
  },

  // Delete assignment
  deleteAssignment: async (id) => {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  },
};