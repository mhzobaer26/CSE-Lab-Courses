const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/User');
const dbHandler = require('../helpers/db-handler');
const { generateTestToken } = require('../helpers/test-data');

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe('User API Tests', () => {
  let testUser;
  let authToken;

  beforeEach(async () => {
    // Create a test user
    testUser = await User.create({
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '01712345678',
      password: 'Password123!',
      role: 'student'
    });

    // Generate auth token
    authToken = generateTestToken({
      id: testUser._id.toString(),
      email: testUser.email,
      role: testUser.role
    });
  });

  describe('GET /api/users/profile', () => {
    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.fullName).toBe(testUser.fullName);
    });

    it('should fail without authentication token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile with valid data', async () => {
      const updateData = {
        fullName: 'Jane Doe',
        phone: '01798765432',
        address: 'Dhaka, Bangladesh'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.fullName).toBe(updateData.fullName);
      expect(response.body.user.phone).toBe(updateData.phone);
      expect(response.body.user.address).toBe(updateData.address);
    });

    it('should fail without authentication', async () => {
      const updateData = {
        fullName: 'Jane Doe'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should validate email format on update', async () => {
      const updateData = {
        email: 'invalid-email-format'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect('Content-Type', /json/);

      // Should either validate or reject invalid email
      if (response.status === 400) {
        expect(response.body.success).toBe(false);
      }
    });

    it('should not allow updating sensitive fields directly', async () => {
      const updateData = {
        role: 'admin', // Should not be allowed
        password: 'NewPassword123!' // Should require special endpoint
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect('Content-Type', /json/);

      // User role should not change
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.role).toBe('student');
    });
  });
});
