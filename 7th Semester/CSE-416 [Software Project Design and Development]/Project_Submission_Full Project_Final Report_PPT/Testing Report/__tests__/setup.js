// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.JWT_EXPIRE = '1d';
process.env.MONGODB_URI = 'mongodb://localhost:27017/educonnect-test';

// Increase timeout for slower machines
jest.setTimeout(30000);
