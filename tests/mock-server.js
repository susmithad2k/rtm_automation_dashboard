/**
 * Mock API Server for Testing Ingestion Flows
 * Run this server to test the ingestion functionality without a real backend
 * Uses only Node.js built-in modules (no dependencies required)
 */

import http from 'http';
import { URL } from 'url';

const PORT = 3001;

// Mock data
const mockTestCases = [
  { id: 1, name: 'Test Case 1', status: 'Passed' },
  { id: 2, name: 'Test Case 2', status: 'Failed' },
];

const mockJiraData = {
  project: 'TEST',
  issues: [
    { key: 'TEST-1', summary: 'Sample Issue 1' },
    { key: 'TEST-2', summary: 'Sample Issue 2' },
  ],
};

const mockConfluenceData = {
  space: 'TEST',
  pages: [
    { id: 1, title: 'Sample Page 1' },
    { id: 2, title: 'Sample Page 2' },
  ],
};

const mockTraceabilityMatrix = [
  {
    id: 'REQ-001',
    requirement: 'User Authentication',
    description: 'System shall support user login with email and password',
    priority: 'High',
    testCases: ['TC-001', 'TC-002', 'TC-003'],
    coverage: '100%',
    status: 'Verified',
  },
  {
    id: 'REQ-002',
    requirement: 'Data Validation',
    description: 'System shall validate all input fields before submission',
    priority: 'High',
    testCases: ['TC-004', 'TC-005'],
    coverage: '100%',
    status: 'Verified',
  },
  {
    id: 'REQ-003',
    requirement: 'Report Generation',
    description: 'Users shall be able to export reports in PDF and Excel formats',
    priority: 'Medium',
    testCases: ['TC-006', 'TC-007', 'TC-008', 'TC-009'],
    coverage: '100%',
    status: 'Verified',
  },
  {
    id: 'REQ-004',
    requirement: 'Dashboard Analytics',
    description: 'Dashboard shall display real-time analytics and metrics',
    priority: 'Medium',
    testCases: ['TC-010', 'TC-011'],
    coverage: '67%',
    status: 'In Progress',
  },
  {
    id: 'REQ-005',
    requirement: 'API Integration',
    description: 'System shall integrate with external APIs for data sync',
    priority: 'Low',
    testCases: ['TC-012'],
    coverage: '50%',
    status: 'Pending',
  },
  {
    id: 'REQ-006',
    requirement: 'Email Notifications',
    description: 'System shall send email notifications for important events',
    priority: 'Medium',
    testCases: ['TC-013', 'TC-014', 'TC-015'],
    coverage: '100%',
    status: 'Verified',
  },
  {
    id: 'REQ-007',
    requirement: 'Role-based Access',
    description: 'System shall implement role-based access control (RBAC)',
    priority: 'High',
    testCases: ['TC-016', 'TC-017'],
    coverage: '100%',
    status: 'Verified',
  },
  {
    id: 'REQ-008',
    requirement: 'Data Backup',
    description: 'System shall perform automated daily backups',
    priority: 'High',
    testCases: [],
    coverage: '0%',
    status: 'Not Started',
  },
];

let ingestionHistory = [];
let reportsList = [];

// Simulate processing delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to parse request body
const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
};

// Helper to send JSON response
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data));
};

// Request handler
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  try {
    // Load Test Cases
    if (path === '/api/ingest/test-cases' && method === 'POST') {
      await delay(1000);
      const result = {
        success: true,
        message: 'Test cases loaded successfully',
        data: mockTestCases,
        count: mockTestCases.length,
        timestamp: new Date().toISOString(),
      };
      ingestionHistory.push({
        type: 'test-cases',
        timestamp: new Date().toISOString(),
        status: 'completed',
        recordsProcessed: mockTestCases.length,
      });
      sendJSON(res, 200, result);
      return;
    }

    // Ingest Jira
    if (path === '/api/ingest/jira' && method === 'POST') {
      await delay(1500);
      const result = {
        success: true,
        message: 'Jira data ingested successfully',
        data: mockJiraData,
        issuesProcessed: mockJiraData.issues.length,
        timestamp: new Date().toISOString(),
      };
      ingestionHistory.push({
        type: 'jira',
        timestamp: new Date().toISOString(),
        status: 'completed',
        recordsProcessed: mockJiraData.issues.length,
      });
      sendJSON(res, 200, result);
      return;
    }

    // Ingest Confluence
    if (path === '/api/ingest/confluence' && method === 'POST') {
      await delay(1200);
      const result = {
        success: true,
        message: 'Confluence data ingested successfully',
        data: mockConfluenceData,
        pagesProcessed: mockConfluenceData.pages.length,
        timestamp: new Date().toISOString(),
      };
      ingestionHistory.push({
        type: 'confluence',
        timestamp: new Date().toISOString(),
        status: 'completed',
        recordsProcessed: mockConfluenceData.pages.length,
      });
      sendJSON(res, 200, result);
      return;
    }

    // Get Ingestion Status
    if (path === '/api/ingest/status' && method === 'GET') {
      await delay(300);
      const status = {
        currentJobs: 0,
        queuedJobs: 0,
        lastIngestion: ingestionHistory.length > 0 ? ingestionHistory[ingestionHistory.length - 1] : null,
        systemStatus: 'operational',
        timestamp: new Date().toISOString(),
      };
      sendJSON(res, 200, status);
      return;
    }

    // Get Ingestion History
    if (path === '/api/ingest/history' && method === 'GET') {
      await delay(400);
      const history = {
        total: ingestionHistory.length,
        records: ingestionHistory.slice(-10),
        timestamp: new Date().toISOString(),
      };
      sendJSON(res, 200, history);
      return;
    }

    // Get Trace Data (main endpoint)
    if (path === '/api/trace' && method === 'GET') {
      await delay(500);
      const result = {
        success: true,
        data: mockTraceabilityMatrix,
        total: mockTraceabilityMatrix.length,
        timestamp: new Date().toISOString(),
      };
      sendJSON(res, 200, result);
      return;
    }

    // Get Traceability Matrix
    if (path === '/api/trace/matrix' && method === 'GET') {
      await delay(600);
      const result = {
        success: true,
        data: mockTraceabilityMatrix,
        total: mockTraceabilityMatrix.length,
        timestamp: new Date().toISOString(),
      };
      sendJSON(res, 200, result);
      return;
    }

    // Get Requirements
    if (path === '/api/trace/requirements' && method === 'GET') {
      await delay(450);
      const requirements = mockTraceabilityMatrix.map(item => ({
        id: item.id,
        requirement: item.requirement,
        description: item.description,
        priority: item.priority,
        status: item.status,
      }));
      const result = {
        success: true,
        data: mockTraceabilityMatrix,
        requirements: requirements,
        total: requirements.length,
        timestamp: new Date().toISOString(),
      };
      sendJSON(res, 200, result);
      return;
    }

    // Get Test Cases
    if (path === '/api/trace/test-cases' && method === 'GET') {
      await delay(550);
      const result = {
        success: true,
        data: mockTraceabilityMatrix,
        total: mockTraceabilityMatrix.length,
        timestamp: new Date().toISOString(),
      };
      sendJSON(res, 200, result);
      return;
    }

    // Get Coverage Report
    if (path === '/api/trace/coverage' && method === 'GET') {
      await delay(700);
      const totalReqs = mockTraceabilityMatrix.length;
      const verifiedReqs = mockTraceabilityMatrix.filter(r => r.status === 'Verified').length;
      const coveragePercentage = parseFloat(((verifiedReqs / totalReqs) * 100).toFixed(2));
      
      const result = {
        success: true,
        percentage: coveragePercentage,
        data: mockTraceabilityMatrix,
        summary: {
          totalRequirements: totalReqs,
          verifiedRequirements: verifiedReqs,
          overallCoverage: `${coveragePercentage}%`,
          pending: mockTraceabilityMatrix.filter(r => r.status === 'Pending').length,
          inProgress: mockTraceabilityMatrix.filter(r => r.status === 'In Progress').length,
          notStarted: mockTraceabilityMatrix.filter(r => r.status === 'Not Started').length,
        },
        timestamp: new Date().toISOString(),
      };
      sendJSON(res, 200, result);
      return;
    }

    // Fetch generic report data for Reports page and Dashboard
    if (path === '/api/report' && method === 'GET') {
      await delay(300);
      const totalReqs = mockTraceabilityMatrix.length;
      const verifiedReqs = mockTraceabilityMatrix.filter(r => r.status === 'Verified').length;
      const notStartedReqs = mockTraceabilityMatrix.filter(r => r.status === 'Not Started').length;
      const coveragePercentage = parseFloat(((verifiedReqs / totalReqs) * 100).toFixed(2));
      const totalTestCases = mockTraceabilityMatrix.reduce((acc, r) => acc + r.testCases.length, 0);
      
      const sampleReportData = {
        coveragePercentage: coveragePercentage,
        totalRequirements: totalReqs,
        mappedRequirements: totalReqs - notStartedReqs,
        highRiskItems: 2,
        untestedRequirements: notStartedReqs,
        summary: {
          totalRequirements: totalReqs,
          totalTests: totalTestCases,
          coverage: coveragePercentage,
          passRate: 92,
        },
        reports: reportsList,
        risks: { high: 2, medium: 5, low: 8 },
        timestamp: new Date().toISOString(),
      };
      sendJSON(res, 200, sampleReportData);
      return;
    }

    // Impact Analysis Summary
    if (path === '/api/impact/summary' && method === 'GET') {
      await delay(400);
      const impactData = {
        totalChanges: 15,
        affectedRequirements: 8,
        affectedTestCases: 23,
        criticalImpact: 3,
        mediumImpact: 5,
        lowImpact: 7,
        riskScore: 6.5,
        timestamp: new Date().toISOString(),
      };
      sendJSON(res, 200, impactData);
      return;
    }

    // Generate a report
    if (path === '/api/reports/generate' && method === 'POST') {
      const body = await parseBody(req);
      await delay(800);
      const id = `RPT-${Date.now()}`;
      const newReport = {
        id,
        reportId: id,
        reportType: body.reportType || 'generic',
        status: 'completed',
        date: new Date().toISOString(),
        meta: body.filters || {},
      };
      reportsList.unshift(newReport);
      sendJSON(res, 200, { success: true, report: newReport });
      return;
    }

    // Get report list
    if (path === '/api/reports/list' && method === 'GET') {
      await delay(200);
      sendJSON(res, 200, { success: true, reports: reportsList });
      return;
    }

    // Export report (stub)
    if (path === '/api/reports/export' && method === 'POST') {
      const body = await parseBody(req);
      await delay(300);
      sendJSON(res, 200, { success: true, message: `Report ${body.reportId} exported as ${body.format}` });
      return;
    }

    // Report templates
    if (path === '/api/reports/templates' && method === 'GET') {
      await delay(100);
      const templates = [
        { id: 'tpl-1', name: 'Executive Summary' },
        { id: 'tpl-2', name: 'Traceability Overview' },
        { id: 'tpl-3', name: 'Coverage Summary' },
      ];
      sendJSON(res, 200, { success: true, templates });
      return;
    }

    // Health check
    if (path === '/api/health' && method === 'GET') {
      sendJSON(res, 200, { status: 'ok', timestamp: new Date().toISOString() });
      return;
    }

    // 404 for unknown routes
    sendJSON(res, 404, { error: 'Not Found' });

  } catch (error) {
    sendJSON(res, 500, { error: error.message });
  }
});

server.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log(`🚀 Mock API Server running at http://localhost:${PORT}`);
  console.log('='.repeat(60));
  console.log('\nIngestion endpoints:');
  console.log('  POST   /api/ingest/test-cases');
  console.log('  POST   /api/ingest/jira');
  console.log('  POST   /api/ingest/confluence');
  console.log('  GET    /api/ingest/status');
  console.log('  GET    /api/ingest/history');
  console.log('\nTraceability endpoints:');
  console.log('  GET    /api/trace');
  console.log('  GET    /api/trace/matrix');
  console.log('  GET    /api/trace/requirements');
  console.log('  GET    /api/trace/test-cases');
  console.log('  GET    /api/trace/coverage');
  console.log('\nReport & Dashboard endpoints:');
  console.log('  GET    /api/report');
  console.log('  POST   /api/reports/generate');
  console.log('  GET    /api/reports/list');
  console.log('  POST   /api/reports/export');
  console.log('  GET    /api/reports/templates');
  console.log('\nImpact Analysis endpoints:');
  console.log('  GET    /api/impact/summary');
  console.log('\nUtility endpoints:');
  console.log('  GET    /api/health');
  console.log('\n' + '='.repeat(60) + '\n');
});

