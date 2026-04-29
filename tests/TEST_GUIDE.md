# Ingestion Testing Guide

## Overview
This guide provides comprehensive instructions for testing all ingestion flows in the RTM Automation Dashboard.

## Prerequisites
- Node.js installed
- Project dependencies installed (`npm install`)
- For API testing: Backend server or mock server running

## Loading Spinner Implementation ✅

The loading spinner has been successfully implemented with the following features:

### Components Created
1. **Spinner Component** (`src/components/ui/Spinner.jsx`)
   - Customizable size (sm, md, lg, xl)
   - Customizable colors (blue, green, purple, yellow, indigo, white)
   - Animated rotation
   - Accessible with ARIA labels

2. **LoadingOverlay Component** (`src/components/ui/LoadingOverlay.jsx`)
   - Full-screen overlay with semi-transparent background
   - Centered spinner with custom message
   - Can be used for blocking operations

### Integration
The Ingestion page now displays:
- ✓ Animated spinner on each button during loading
- ✓ Disabled buttons during API calls
- ✓ Visual feedback with spinner + "Loading..." text

---

## Testing Methods

### Method 1: Manual UI Testing (Recommended First)

#### Step 1: Start the Mock Server
```bash
npm run mock-server
```
The mock server will start on http://localhost:3000

#### Step 2: Start the Development Server
In a new terminal:
```bash
npm run dev
```
The app will start on http://localhost:5173

#### Step 3: Test Each Flow
Navigate to the Ingestion page and test each button:

1. **Load Test Cases**
   - Click "Load Test Cases" button
   - ✓ Verify spinner appears
   - ✓ Verify button is disabled
   - ✓ Verify success message appears
   - ✓ Verify test case data is displayed

2. **Ingest Jira**
   - Click "Ingest Jira" button
   - ✓ Verify spinner appears
   - ✓ Verify button is disabled
   - ✓ Verify success message appears
   - ✓ Verify Jira data is displayed

3. **Ingest Confluence**
   - Click "Ingest Confluence" button
   - ✓ Verify spinner appears
   - ✓ Verify button is disabled
   - ✓ Verify success message appears
   - ✓ Verify Confluence data is displayed

4. **Get Status**
   - Click "Get Status" button
   - ✓ Verify spinner appears
   - ✓ Verify status information is displayed

5. **Get History**
   - Click "Get History" button
   - ✓ Verify spinner appears
   - ✓ Verify history records are displayed

---

### Method 2: Automated API Testing

#### Quick Test (with mock server)
```bash
# Terminal 1: Start mock server
npm run mock-server

# Terminal 2: Run tests
npm run test:ingestion
```

#### Test with Real Backend
```bash
# Make sure your backend is running on port 3000
# Or set VITE_API_BASE_URL in .env

npm run test:ingestion
```

---

## Test Checklist

### Visual Testing
- [ ] Spinner appears on all buttons when clicked
- [ ] Spinner is properly sized and colored
- [ ] Spinner animation is smooth
- [ ] Buttons are disabled during loading
- [ ] Success messages appear in green background
- [ ] Error messages appear in red background
- [ ] Response data is formatted and readable

### Functional Testing
- [ ] Load Test Cases endpoint responds correctly
- [ ] Ingest Jira endpoint responds correctly
- [ ] Ingest Confluence endpoint responds correctly
- [ ] Get Status endpoint responds correctly
- [ ] Get History endpoint responds correctly
- [ ] Error handling works (test with server stopped)
- [ ] Multiple rapid clicks don't cause issues
- [ ] Loading state clears after completion

### Performance Testing
- [ ] Spinner appears immediately on click
- [ ] UI remains responsive during loading
- [ ] No console errors
- [ ] Network requests complete successfully

---

## Expected Test Results

### With Mock Server Running

All 5 ingestion flows should return:
```
Total Tests: 5
Passed: 5 ✓
Failed: 0
Average Response Time: < 2000ms
```

### Individual Flow Responses

1. **Load Test Cases**
   ```json
   {
     "success": true,
     "message": "Test cases loaded successfully",
     "count": 2,
     "data": [...]
   }
   ```

2. **Ingest Jira**
   ```json
   {
     "success": true,
     "message": "Jira data ingested successfully",
     "issuesProcessed": 2,
     "data": {...}
   }
   ```

3. **Ingest Confluence**
   ```json
   {
     "success": true,
     "message": "Confluence data ingested successfully",
     "pagesProcessed": 2,
     "data": {...}
   }
   ```

4. **Get Status**
   ```json
   {
     "currentJobs": 0,
     "queuedJobs": 0,
     "systemStatus": "operational",
     "lastIngestion": {...}
   }
   ```

5. **Get History**
   ```json
   {
     "total": 3,
     "records": [...]
   }
   ```

---

## Troubleshooting

### Spinner Not Appearing
- Check browser console for errors
- Verify Tailwind CSS is properly configured
- Check that `animate-spin` class is supported

### API Calls Failing
- Verify mock server is running: `curl http://localhost:3000/api/health`
- Check VITE_API_BASE_URL in .env file
- Check browser network tab for request details

### Tests Timing Out
- Increase timeout in test script
- Check network connectivity
- Verify server is not overloaded

---

## Files Modified/Created

### Created Files
- `src/components/ui/Spinner.jsx` - Spinner component
- `src/components/ui/LoadingOverlay.jsx` - Overlay component
- `src/components/ui/index.js` - UI components export
- `tests/ingestion-test.js` - Automated test script
- `tests/mock-server.js` - Mock API server
- `tests/TEST_GUIDE.md` - This file
- `.env.example` - Environment variables template

### Modified Files
- `src/pages/Ingestion/index.jsx` - Added spinner integration
- `package.json` - Added test scripts

---

## Next Steps

1. Run manual UI tests to verify spinner behavior
2. Run automated tests to verify API integration
3. Test error scenarios (server down, network errors)
4. Conduct performance testing under load
5. Document any issues found

---

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all dependencies are installed
3. Ensure servers are running on correct ports
4. Review this guide for troubleshooting steps
