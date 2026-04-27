import apiClient from './apiClient';

export const loadTestCases = async () => {
  const response = await apiClient.post('/ingest/test-cases');
  return response;
};

export const ingestJira = async () => {
  const response = await apiClient.post('/ingest/jira');
  return response;
};

export const ingestConfluence = async () => {
  const response = await apiClient.post('/ingest/confluence');
  return response;
};

export default {
  loadTestCases,
  ingestJira,
  ingestConfluence,
};