import apiClient from './apiClient';

export const generateReport = async (reportType, filters = {}) => {
  const response = await apiClient.post('/reports/generate', {
    reportType,
    filters,
  });
  return response;
};

export const getReportList = async () => {
  const response = await apiClient.get('/reports/list');
  return response;
};

export const getReport = async (reportId) => {
  const response = await apiClient.get(`/reports/${reportId}`);
  return response;
};

export const exportReport = async (reportId, format = 'pdf') => {
  const response = await apiClient.post('/reports/export', {
    reportId,
    format,
  });
  return response;
};

export const deleteReport = async (reportId) => {
  const response = await apiClient.del(`/reports/${reportId}`);
  return response;
};

export const getReportTemplates = async () => {
  const response = await apiClient.get('/reports/templates');
  return response;
};

export const scheduleReport = async (reportType, schedule, recipients) => {
  const response = await apiClient.post('/reports/schedule', {
    reportType,
    schedule,
    recipients,
  });
  return response;
};

export default {
  generateReport,
  getReportList,
  getReport,
  exportReport,
  deleteReport,
  getReportTemplates,
  scheduleReport,
};