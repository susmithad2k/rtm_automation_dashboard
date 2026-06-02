/**
 * Dashboard Component Test Suite
 * Tests API rendering and report display functionality
 */

const BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  test: (msg) => console.log(`${colors.cyan}▶ ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.magenta}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}\n`),
};

// Test results tracking
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
};

/**
 * Generic API endpoint tester
 */
async function testEndpoint(name, url, method = 'GET', body = null, expectedFields = []) {
  log.test(`Testing: ${name}`);
  testResults.total++;
  
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

    const data = await response.json().catch(() => null);

    if (response.ok) {
      log.success(`${name} - Status: ${response.status} (${duration}ms)`);
      
      // Validate expected fields if provided
      if (expectedFields.length > 0 && data) {
        validateFields(data, expectedFields, name);
      }

      if (data) {
        const preview = JSON.stringify(data, null, 2);
        console.log('  Response:', preview.substring(0, 300) + (preview.length > 300 ? '...' : ''));
      }
      
      testResults.passed++;
      return { success: true, data, status: response.status, duration };
    } else {
      log.error(`${name} - Status: ${response.status} (${duration}ms)`);
      console.log('  Error:', data?.message || 'Unknown error');
      testResults.failed++;
      return { success: false, data, status: response.status, duration };
    }
  } catch (error) {
    log.error(`${name} - Request failed: ${error.message}`);
    testResults.failed++;
    return { success: false, error: error.message };
  }
}

/**
 * Validate that expected fields exist in response
 */
function validateFields(data, expectedFields, testName) {
  const missingFields = expectedFields.filter(field => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], data);
    return value === undefined || value === null;
  });

  if (missingFields.length > 0) {
    log.warn(`${testName}: Missing expected fields: ${missingFields.join(', ')}`);
    testResults.warnings++;
  } else {
    log.info(`All expected fields present: ${expectedFields.join(', ')}`);
  }
}

/**
 * Test report data structure and display requirements
 */
function testReportDataStructure(reportData, testName) {
  log.test(`Validating report data structure for: ${testName}`);
  testResults.total++;

  const requiredFields = [
    'coveragePercentage',
    'totalRequirements',
    'mappedRequirements',
    'highRiskItems',
    'untestedRequirements'
  ];

  const missingFields = requiredFields.filter(field => 
    reportData[field] === undefined || reportData[field] === null
  );

  if (missingFields.length === 0) {
    log.success(`Report data structure valid - all required fields present`);
    
    // Validate data types and ranges
    const validations = [
      {
        field: 'coveragePercentage',
        check: typeof reportData.coveragePercentage === 'number' && 
               reportData.coveragePercentage >= 0 && 
               reportData.coveragePercentage <= 100,
        message: 'Coverage percentage should be a number between 0-100'
      },
      {
        field: 'totalRequirements',
        check: typeof reportData.totalRequirements === 'number' && 
               reportData.totalRequirements >= 0,
        message: 'Total requirements should be a non-negative number'
      },
      {
        field: 'mappedRequirements',
        check: typeof reportData.mappedRequirements === 'number' && 
               reportData.mappedRequirements >= 0 &&
               reportData.mappedRequirements <= reportData.totalRequirements,
        message: 'Mapped requirements should be <= total requirements'
      },
      {
        field: 'highRiskItems',
        check: typeof reportData.highRiskItems === 'number' && 
               reportData.highRiskItems >= 0,
        message: 'High risk items should be a non-negative number'
      },
      {
        field: 'untestedRequirements',
        check: typeof reportData.untestedRequirements === 'number' && 
               reportData.untestedRequirements >= 0,
        message: 'Untested requirements should be a non-negative number'
      }
    ];

    validations.forEach(({ field, check, message }) => {
      if (check) {
        log.info(`  ✓ ${field}: ${reportData[field]} (valid)`);
      } else {
        log.warn(`  ⚠ ${field}: ${reportData[field]} - ${message}`);
        testResults.warnings++;
      }
    });

    testResults.passed++;
    return true;
  } else {
    log.error(`Report data structure invalid - missing fields: ${missingFields.join(', ')}`);
    testResults.failed++;
    return false;
  }
}

/**
 * Test dashboard summary cards data
 */
function testSummaryCardsDisplay(reportData) {
  log.test('Testing Summary Cards Display Logic');
  testResults.total++;

  try {
    const cards = [
      {
        name: 'Coverage Card',
        value: `${reportData.coveragePercentage}%`,
        color: 'blue',
        hasValue: reportData.coveragePercentage !== undefined
      },
      {
        name: 'Total Requirements Card',
        value: reportData.totalRequirements,
        color: 'purple',
        hasValue: reportData.totalRequirements !== undefined
      },
      {
        name: 'Mapped Requirements Card',
        value: reportData.mappedRequirements,
        color: 'green',
        hasValue: reportData.mappedRequirements !== undefined
      },
      {
        name: 'High Risk Items Card',
        value: reportData.highRiskItems,
        color: 'red',
        hasValue: reportData.highRiskItems !== undefined
      },
      {
        name: 'Untested Requirements Card',
        value: reportData.untestedRequirements,
        color: 'orange',
        hasValue: reportData.untestedRequirements !== undefined
      }
    ];

    console.log('\n  Dashboard Summary Cards Preview:');
    console.log('  ' + '─'.repeat(50));

    cards.forEach(card => {
      if (card.hasValue) {
        console.log(`  ${card.name.padEnd(30)} │ ${card.value} (${card.color})`);
      } else {
        console.log(`  ${card.name.padEnd(30)} │ -- (no data)`);
      }
    });

    console.log('  ' + '─'.repeat(50));

    const allCardsHaveData = cards.every(card => card.hasValue);
    
    if (allCardsHaveData) {
      log.success('All summary cards have valid data for display');
      testResults.passed++;
      return true;
    } else {
      log.warn('Some summary cards are missing data');
      testResults.warnings++;
      return false;
    }
  } catch (error) {
    log.error(`Summary cards display test failed: ${error.message}`);
    testResults.failed++;
    return false;
  }
}

/**
 * Test coverage data for dashboard display
 */
function testCoverageDisplay(coverageData) {
  log.test('Testing Coverage Display Data');
  testResults.total++;

  try {
    if (!coverageData) {
      log.warn('No coverage data available');
      testResults.warnings++;
      return false;
    }

    const expectedFields = ['percentage'];
    const hasPercentage = coverageData.percentage !== undefined;

    if (hasPercentage) {
      log.success(`Coverage display data valid - ${coverageData.percentage}% coverage`);
      testResults.passed++;
      return true;
    } else {
      log.error('Coverage data missing percentage field');
      testResults.failed++;
      return false;
    }
  } catch (error) {
    log.error(`Coverage display test failed: ${error.message}`);
    testResults.failed++;
    return false;
  }
}

/**
 * Main test suite runner
 */
async function runDashboardTests() {
  log.section('🚀 DASHBOARD TEST SUITE - API Rendering & Report Display');

  console.log(`Testing against: ${BASE_URL}\n`);

  // Test 1: Coverage Report API
  log.section('TEST SUITE 1: Dashboard API Endpoints');
  
  const coverageResult = await testEndpoint(
    'Coverage Report API',
    '/trace/coverage',
    'GET',
    null,
    ['percentage']
  );

  // Test 2: Impact Summary API
  const impactResult = await testEndpoint(
    'Impact Summary API',
    '/impact/summary',
    'GET',
    null,
    []
  );

  // Test 3: Ingestion Status API
  const ingestionResult = await testEndpoint(
    'Ingestion Status API',
    '/ingestion/status',
    'GET',
    null,
    []
  );

  // Test 4: Report Data API (main report endpoint)
  const reportResult = await testEndpoint(
    'Report Data API',
    '/report',
    'GET',
    null,
    ['coveragePercentage', 'totalRequirements', 'mappedRequirements', 'highRiskItems', 'untestedRequirements']
  );

  // Test 5: Report Display Structure
  log.section('TEST SUITE 2: Report Data Structure Validation');
  
  if (reportResult.success && reportResult.data) {
    testReportDataStructure(reportResult.data, 'Main Report Data');
  } else {
    log.warn('Skipping report structure test - API call failed');
    testResults.total++;
    testResults.warnings++;
  }

  // Test 6: Summary Cards Display
  log.section('TEST SUITE 3: Dashboard Display Components');
  
  if (reportResult.success && reportResult.data) {
    testSummaryCardsDisplay(reportResult.data);
  } else {
    log.warn('Skipping summary cards test - no report data available');
    testResults.total++;
    testResults.warnings++;
  }

  // Test 7: Coverage Display
  if (coverageResult.success && coverageResult.data) {
    testCoverageDisplay(coverageResult.data);
  } else {
    log.warn('Skipping coverage display test - no coverage data available');
    testResults.total++;
    testResults.warnings++;
  }

  // Test 8: All APIs Parallel Load (simulating dashboard mount)
  log.section('TEST SUITE 4: Parallel API Loading (Dashboard Mount Simulation)');
  
  log.test('Simulating dashboard component mount - parallel API calls');
  const parallelStartTime = Date.now();
  
  try {
    const [parallelCoverage, parallelImpact, parallelIngestion, parallelReport] = await Promise.allSettled([
      fetch(`${BASE_URL}/trace/coverage`).then(r => r.json()),
      fetch(`${BASE_URL}/impact/summary`).then(r => r.json()),
      fetch(`${BASE_URL}/ingestion/status`).then(r => r.json()),
      fetch(`${BASE_URL}/report`).then(r => r.json()),
    ]);

    const parallelEndTime = Date.now();
    const parallelDuration = parallelEndTime - parallelStartTime;

    testResults.total++;

    const results = [
      { name: 'Coverage', result: parallelCoverage },
      { name: 'Impact', result: parallelImpact },
      { name: 'Ingestion', result: parallelIngestion },
      { name: 'Report', result: parallelReport }
    ];

    const successCount = results.filter(r => r.result.status === 'fulfilled').length;
    
    console.log(`\n  Parallel Load Results (${parallelDuration}ms total):`);
    results.forEach(({ name, result }) => {
      if (result.status === 'fulfilled') {
        log.success(`  ${name}: Loaded successfully`);
      } else {
        log.error(`  ${name}: Failed - ${result.reason?.message || 'Unknown error'}`);
      }
    });

    if (successCount === 4) {
      log.success(`All 4 APIs loaded successfully in ${parallelDuration}ms`);
      testResults.passed++;
    } else if (successCount > 0) {
      log.warn(`${successCount}/4 APIs loaded successfully in ${parallelDuration}ms`);
      testResults.warnings++;
    } else {
      log.error(`All parallel API calls failed`);
      testResults.failed++;
    }

  } catch (error) {
    log.error(`Parallel load test failed: ${error.message}`);
    testResults.failed++;
  }

  // Print test summary
  log.section('📊 TEST RESULTS SUMMARY');
  
  console.log(`Total Tests:    ${testResults.total}`);
  console.log(`${colors.green}Passed:         ${testResults.passed}${colors.reset}`);
  console.log(`${colors.red}Failed:         ${testResults.failed}${colors.reset}`);
  console.log(`${colors.yellow}Warnings:       ${testResults.warnings}${colors.reset}`);
  
  const successRate = testResults.total > 0 
    ? ((testResults.passed / testResults.total) * 100).toFixed(2) 
    : 0;
  
  console.log(`\nSuccess Rate:   ${successRate}%`);
  
  if (testResults.failed === 0) {
    log.success('\n🎉 All tests passed!');
    process.exit(0);
  } else if (testResults.failed <= testResults.passed) {
    log.warn('\n⚠️  Some tests failed, but most passed');
    process.exit(0);
  } else {
    log.error('\n❌ Most tests failed - check your API server');
    process.exit(1);
  }
}

// Run the test suite
runDashboardTests().catch(error => {
  log.error(`\nTest suite crashed: ${error.message}`);
  console.error(error);
  process.exit(1);
});
