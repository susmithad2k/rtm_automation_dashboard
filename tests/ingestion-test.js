/**
 * Test script for all ingestion flows
 * This script tests each ingestion endpoint
 */

const BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  test: (msg) => console.log(`${colors.cyan}▶ ${msg}${colors.reset}`),
};

async function testEndpoint(name, url, method = 'GET', body = null) {
  log.test(`Testing: ${name}`);
  
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    const startTime = Date.now();
    const response = await fetch(`${BASE_URL}${url}`, options);
    const endTime = Date.now();
    const duration = endTime - startTime;

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      log.success(`${name} - Status: ${response.status} (${duration}ms)`);
      console.log('  Response:', JSON.stringify(data, null, 2).substring(0, 200) + '...');
      return { success: true, data, status: response.status, duration };
    } else {
      log.error(`${name} - Status: ${response.status} (${duration}ms)`);
      console.log('  Error:', data);
      return { success: false, error: data, status: response.status, duration };
    }
  } catch (error) {
    log.error(`${name} - Failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  console.log('\n' + '='.repeat(60));
  log.info(`Testing API at: ${BASE_URL}`);
  console.log('='.repeat(60) + '\n');

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    tests: [],
  };

  // Test 1: Load Test Cases
  console.log('\n--- Test 1: Load Test Cases ---');
  const test1 = await testEndpoint(
    'Load Test Cases',
    '/ingest/test-cases',
    'POST',
    { source: 'test' }
  );
  results.total++;
  results.tests.push({ name: 'Load Test Cases', ...test1 });
  if (test1.success) results.passed++;
  else results.failed++;

  // Test 2: Ingest Jira
  console.log('\n--- Test 2: Ingest Jira ---');
  const test2 = await testEndpoint(
    'Ingest Jira',
    '/ingest/jira',
    'POST',
    { project: 'TEST' }
  );
  results.total++;
  results.tests.push({ name: 'Ingest Jira', ...test2 });
  if (test2.success) results.passed++;
  else results.failed++;

  // Test 3: Ingest Confluence
  console.log('\n--- Test 3: Ingest Confluence ---');
  const test3 = await testEndpoint(
    'Ingest Confluence',
    '/ingest/confluence',
    'POST',
    { space: 'TEST' }
  );
  results.total++;
  results.tests.push({ name: 'Ingest Confluence', ...test3 });
  if (test3.success) results.passed++;
  else results.failed++;

  // Test 4: Get Ingestion Status
  console.log('\n--- Test 4: Get Ingestion Status ---');
  const test4 = await testEndpoint(
    'Get Ingestion Status',
    '/ingest/status',
    'GET'
  );
  results.total++;
  results.tests.push({ name: 'Get Ingestion Status', ...test4 });
  if (test4.success) results.passed++;
  else results.failed++;

  // Test 5: Get Ingestion History
  console.log('\n--- Test 5: Get Ingestion History ---');
  const test5 = await testEndpoint(
    'Get Ingestion History',
    '/ingest/history',
    'GET'
  );
  results.total++;
  results.tests.push({ name: 'Get Ingestion History', ...test5 });
  if (test5.success) results.passed++;
  else results.failed++;

  // Print Summary
  console.log('\n' + '='.repeat(60));
  console.log('Test Summary');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${results.total}`);
  log.success(`Passed: ${results.passed}`);
  log.error(`Failed: ${results.failed}`);
  
  if (results.failed > 0) {
    console.log('\nFailed Tests:');
    results.tests.forEach((test) => {
      if (!test.success) {
        log.error(`- ${test.name}`);
        console.log(`  Error: ${test.error}`);
      }
    });
  }

  // Calculate average response time
  const avgDuration = results.tests
    .filter(t => t.duration)
    .reduce((sum, t) => sum + t.duration, 0) / results.tests.filter(t => t.duration).length;
  
  console.log(`\nAverage Response Time: ${avgDuration.toFixed(2)}ms`);
  console.log('='.repeat(60) + '\n');

  return results;
}

// Run tests
runAllTests()
  .then((results) => {
    process.exit(results.failed > 0 ? 1 : 0);
  })
  .catch((error) => {
    log.error(`Test execution failed: ${error.message}`);
    process.exit(1);
  });
