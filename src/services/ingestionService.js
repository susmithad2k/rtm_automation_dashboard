import apiClient from './apiClient';

export const loadTestCases = async (data = {}) => {
  const response = await apiClient.post('/ingest/test-cases', data);
  return response;
};

export const ingestJira = async (data = {}) => {
  const response = await apiClient.post('/ingest/jira', data);
  return response;
};

export const ingestConfluence = async (data = {}) => {
  const response = await apiClient.post('/ingest/confluence', data);
  return response;
};

export const uploadFile = async (file, type) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  const response = await apiClient.post('/ingest/upload', formData);
  return response;
};

export const getIngestionStatus = async () => {
  const response = await apiClient.get('/ingest/status');
  return response;
};

export const getIngestionHistory = async () => {
  const response = await apiClient.get('/ingest/history');
  return response;
};

export default {
  loadTestCases,
  ingestJira,
  ingestConfluence,
  uploadFile,
  getIngestionStatus,
  getIngestionHistory,
};