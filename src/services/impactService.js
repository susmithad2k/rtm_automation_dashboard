import apiClient from './apiClient';

export const analyzeImpact = async (itemId, itemType) => {
  const response = await apiClient.post('/impact/analyze', {
    itemId,
    itemType,
  });
  return response;
};

export const getImpactedItems = async (params = {}) => {
  const response = await apiClient.get('/impact/items', params);
  return response;
};

export const getImpactHistory = async (itemId) => {
  const response = await apiClient.get(`/impact/history/${itemId}`);
  return response;
};

export const getImpactSummary = async () => {
  const response = await apiClient.get('/impact/summary');
  return response;
};

export const analyzeRequirementChange = async (requirementId, changes) => {
  const response = await apiClient.post('/impact/requirement-change', {
    requirementId,
    changes,
  });
  return response;
};

export const getAffectedTestCases = async (requirementId) => {
  const response = await apiClient.get(`/impact/affected-tests/${requirementId}`);
  return response;
};

export default {
  analyzeImpact,
  getImpactedItems,
  getImpactHistory,
  getImpactSummary,
  analyzeRequirementChange,
  getAffectedTestCases,
};