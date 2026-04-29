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

let ingestionHistory = [];

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
  console.log('\nAvailable endpoints:');
  console.log('  POST   /api/ingest/test-cases');
  console.log('  POST   /api/ingest/jira');
  console.log('  POST   /api/ingest/confluence');
  console.log('  GET    /api/ingest/status');
  console.log('  GET    /api/ingest/history');
  console.log('  GET    /api/health');
  console.log('\n' + '='.repeat(60) + '\n');
});

