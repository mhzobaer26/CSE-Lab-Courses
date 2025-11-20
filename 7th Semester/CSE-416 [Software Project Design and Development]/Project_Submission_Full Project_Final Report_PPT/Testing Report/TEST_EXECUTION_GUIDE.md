# Test Execution Guide

## Quick Start

### Run All Tests
```bash
cd backend
npm test
```

### Run Tests with Coverage
```bash
cd backend
npm test -- --coverage
```

---

## Detailed Test Execution

### 1. Run Specific Test Suite

#### Run Model Tests Only
```bash
# User model tests
npm test -- __tests__/models/user.test.js

# Admin model tests
npm test -- __tests__/models/admin.test.js

# Result model tests
npm test -- __tests__/models/result.test.js

# Admission model tests
npm test -- __tests__/models/admission.test.js
```

#### Run API Tests Only
```bash
# Auth API tests
npm test -- __tests__/api/auth.test.js

# User API tests
npm test -- __tests__/api/user.test.js

# Admission API tests
npm test -- __tests__/api/admission.test.js

# Result API tests
npm test -- __tests__/api/result.test.js
```

### 2. Run Tests in Watch Mode
```bash
cd backend
npm test -- --watch
```

This will:
- Re-run tests when files change
- Show interactive menu
- Only run tests related to changed files

### 3. Run Tests with Verbose Output
```bash
cd backend
npm test -- --verbose
```

### 4. Run Tests and Update Snapshots
```bash
cd backend
npm test -- --updateSnapshot
```

### 5. Run Only Failed Tests
```bash
cd backend
npm test -- --onlyFailures
```

---

## Coverage Reports

### Generate Coverage Report
```bash
cd backend
npm test -- --coverage
```

### Coverage Report Formats
1. **Terminal Output:** Displayed after test run
2. **HTML Report:** `backend/coverage/lcov-report/index.html`
3. **LCOV Report:** `backend/coverage/lcov.info`
4. **JSON Report:** `backend/coverage/coverage-summary.json`

### View HTML Coverage Report

**Windows:**
```bash
cd backend
start coverage/lcov-report/index.html
```

**macOS:**
```bash
cd backend
open coverage/lcov-report/index.html
```

**Linux:**
```bash
cd backend
xdg-open coverage/lcov-report/index.html
```

---

## Advanced Testing Options

### Run Tests with Specific Pattern
```bash
# Run all tests matching "user"
npm test -- --testNamePattern="user"

# Run all tests in models directory
npm test -- --testPathPattern="models"
```

### Run Tests with Coverage Threshold
```bash
npm test -- --coverage --coverageThreshold='{"global":{"branches":50,"functions":50,"lines":50,"statements":50}}'
```

### Run Tests in CI/CD Mode
```bash
npm test -- --ci --coverage --maxWorkers=2
```

### Run Tests with JSON Output
```bash
npm test -- --json --outputFile=test-results.json
```

---

## Debugging Tests

### Run Tests in Debug Mode (VS Code)
1. Add breakpoint in test file
2. Press `F5` or use Debug menu
3. Select "Jest Debug" configuration

### Run Single Test
```javascript
// Use .only to run a single test
it.only('should test something', () => {
  // test code
});

// Or use describe.only for a test suite
describe.only('Test Suite', () => {
  // tests
});
```

### Skip Tests
```javascript
// Use .skip to skip a test
it.skip('should test something', () => {
  // test code
});

// Or use describe.skip for a test suite
describe.skip('Test Suite', () => {
  // tests
});
```

### Run Tests with Increased Timeout
```bash
npm test -- --testTimeout=60000
```

---

## Environment Setup for Testing

### Required Environment Variables
Tests use the following environment variables (set in `__tests__/setup.js`):

```bash
NODE_ENV=test
JWT_SECRET=test-secret-key-for-testing-only
JWT_EXPIRE=1d
MONGODB_URI=mongodb://localhost:27017/educonnect-test
```

### Installing Test Dependencies
```bash
cd backend
npm install --save-dev jest supertest mongodb-memory-server @types/jest
```

---

## Common Test Commands

### Full Test Suite
```bash
# Run all tests with coverage
npm test -- --coverage --verbose

# Run all tests and generate reports
npm test -- --coverage --json --outputFile=test-results.json

# Run tests and watch for changes
npm test -- --watch --coverage
```

### Continuous Integration
```bash
# CI-friendly test run
npm test -- --ci --coverage --maxWorkers=2 --silent

# With coverage threshold enforcement
npm test -- --ci --coverage --coverageThreshold='{"global":{"branches":70}}'
```

---

## Test File Structure

```
backend/
├── __tests__/
│   ├── setup.js                    # Global test setup
│   ├── helpers/
│   │   ├── db-handler.js          # Database utilities
│   │   └── test-data.js           # Mock data
│   ├── models/                     # Model tests
│   │   ├── user.test.js
│   │   ├── admin.test.js
│   │   ├── result.test.js
│   │   └── admission.test.js
│   └── api/                        # API integration tests
│       ├── auth.test.js
│       ├── user.test.js
│       ├── admission.test.js
│       └── result.test.js
├── coverage/                       # Generated coverage reports
│   ├── lcov-report/               # HTML coverage report
│   ├── lcov.info                  # LCOV format
│   └── coverage-summary.json      # JSON summary
├── jest.config.js                 # Jest configuration
└── package.json                   # Test scripts
```

---

## Interpreting Test Results

### Test Output Format
```
 PASS  __tests__/models/user.test.js
  User Model Test
    User Creation
      ✓ should create a valid user successfully (123ms)
      ✓ should fail with missing required fields (45ms)
    User Roles
      ✓ should set default role as student (12ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        2.5s
```

### Coverage Report Format
```
File               | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
All files          |   70.5  |   65.2   |   75.3  |   70.1  |
 models/           |   85.2  |   80.1   |   90.0  |   84.8  |
  User.js          |   88.5  |   82.5   |   92.0  |   88.0  |
  Admin.js         |   90.0  |   85.0   |   95.0  |   90.5  |
```

### Understanding Coverage Metrics
- **Statements:** % of statements executed
- **Branches:** % of decision branches tested (if/else, switch, etc.)
- **Functions:** % of functions called
- **Lines:** % of lines executed

---

## Troubleshooting

### Tests Timing Out
```bash
# Increase timeout
npm test -- --testTimeout=60000
```

### Database Connection Issues
- Ensure MongoDB Memory Server is installed
- Check if port 27017 is available
- Restart tests to get fresh database instance

### Memory Issues
```bash
# Run tests with limited workers
npm test -- --maxWorkers=2

# Clear Jest cache
npx jest --clearCache
```

### Test Failures After Changes
```bash
# Update snapshots if needed
npm test -- --updateSnapshot

# Run only failed tests
npm test -- --onlyFailures
```

---

## Best Practices

### 1. Run Tests Before Committing
```bash
git add .
npm test
git commit -m "Your commit message"
```

### 2. Keep Tests Fast
- Use `beforeEach` for setup instead of repeating code
- Mock external dependencies
- Use in-memory database

### 3. Write Descriptive Test Names
```javascript
// Good
it('should return 404 when user not found', () => {});

// Bad
it('test user', () => {});
```

### 4. Test One Thing Per Test
```javascript
// Good - Single responsibility
it('should validate email format', () => {});
it('should validate phone format', () => {});

// Bad - Multiple concerns
it('should validate user input', () => {
  // tests email, phone, name, etc.
});
```

### 5. Use Test Coverage as a Guide
- Aim for >70% coverage on critical paths
- Don't obsess over 100% coverage
- Focus on testing behavior, not implementation

---

## Integration with CI/CD

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd backend && npm install
      - name: Run tests
        run: cd backend && npm test -- --ci --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

---

## Additional Resources

### Jest Documentation
- Official Docs: https://jestjs.io/
- API Reference: https://jestjs.io/docs/api

### Supertest Documentation
- GitHub: https://github.com/visionmedia/supertest
- Usage Examples: https://github.com/visionmedia/supertest#example

### MongoDB Memory Server
- GitHub: https://github.com/nodkz/mongodb-memory-server
- Documentation: https://nodkz.github.io/mongodb-memory-server/

---

## Support & Contribution

### Adding New Tests
1. Create test file in appropriate directory
2. Follow existing test patterns
3. Run tests to ensure they pass
4. Check coverage impact

### Reporting Issues
- Include test output
- Provide steps to reproduce
- Share environment details

---

**Last Updated:** November 18, 2025  
**Test Framework:** Jest v30.2.0  
**Platform:** EduConnect Backend
