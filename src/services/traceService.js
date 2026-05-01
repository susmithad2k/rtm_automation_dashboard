import apiClient from './apiClient';

export const getTrace = async (params = {}) => {
  const response = await apiClient.get('/trace', params);
  return response;
};

export const getTraceabilityMatrix = async (filters = {}) => {
  const response = await apiClient.get('/trace/matrix', filters);
  return response;
};

export const getRequirements = async (params = {}) => {
  const response = await apiClient.get('/trace/requirements', params);
  return response;
};

export const getTestCases = async (params = {}) => {
  const response = await apiClient.get('/trace/test-cases', params);
  return response;
};

export const linkRequirementToTest = async (requirementId, testCaseId) => {
  const response = await apiClient.post('/trace/link', {
    requirementId,
    testCaseId,
  });
  return response;
};

export const unlinkRequirementFromTest = async (requirementId, testCaseId) => {
  const response = await apiClient.del(`/trace/link/${requirementId}/${testCaseId}`);
  return response;
};

export const getTraceDetails = async (id) => {
  const response = await apiClient.get(`/trace/details/${id}`);
  return response;
};

export const updateTraceMapping = async (id, data) => {
  const response = await apiClient.put(`/trace/mapping/${id}`, data);
  return response;
};

export const getCoverageReport = async () => {
  const response = await apiClient.get('/trace/coverage');
  return response;
};

export default {
  getTrace,
  getTraceabilityMatrix,
  getRequirements,
  getTestCases,
  linkRequirementToTest,
  unlinkRequirementFromTest,
  getTraceDetails,
  updateTraceMapping,
  getCoverageReport,
};