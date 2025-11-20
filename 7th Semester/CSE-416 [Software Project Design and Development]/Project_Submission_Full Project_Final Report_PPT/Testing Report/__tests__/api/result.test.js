const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const Result = require('../../src/models/Result');
const User = require('../../src/models/User');
const dbHandler = require('../helpers/db-handler');
const { generateTestToken, generateAdminToken } = require('../helpers/test-data');

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe('Result API Tests', () => {
  let testUser;
  let adminUser;
  let userToken;
  let adminToken;

  beforeEach(async () => {
    testUser = await User.create({
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '01712345678',
      password: 'Password123!',
      role: 'student',
      studentId: 'STU2024001'
    });

    adminUser = await User.create({
      fullName: 'Admin User',
      email: 'admin@example.com',
      phone: '01798765432',
      password: 'AdminPass123!',
      role: 'admin'
    });

    userToken = generateTestToken({
      id: testUser._id.toString(),
      email: testUser.email,
      role: 'student'
    });

    adminToken = generateAdminToken({
      id: adminUser._id.toString(),
      email: adminUser.email,
      role: 'admin'
    });
  });

  describe('POST /api/results', () => {
    it('should allow admin to create result', async () => {
      const resultData = {
        studentId: testUser._id,
        subject: 'Mathematics',
        score: 85,
        semester: 'Fall 2024',
        year: 2024
      };

      const response = await request(app)
        .post('/api/results')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(resultData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.result).toBeDefined();
      expect(response.body.result.subject).toBe(resultData.subject);
      expect(response.body.result.score).toBe(resultData.score);
    });

    it('should not allow regular user to create result', async () => {
      const resultData = {
        studentId: testUser._id,
        subject: 'Mathematics',
        score: 85,
        semester: 'Fall 2024',
        year: 2024
      };

      const response = await request(app)
        .post('/api/results')
        .set('Authorization', `Bearer ${userToken}`)
        .send(resultData)
        .expect('Content-Type', /json/)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should validate score range', async () => {
      const resultData = {
        studentId: testUser._id,
        subject: 'Mathematics',
        score: 150, // Invalid score
        semester: 'Fall 2024',
        year: 2024
      };

      const response = await request(app)
        .post('/api/results')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(resultData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/results', () => {
    beforeEach(async () => {
      await Result.create({
        studentId: testUser._id,
        subject: 'Mathematics',
        score: 85,
        semester: 'Fall 2024',
        year: 2024
      });

      await Result.create({
        studentId: testUser._id,
        subject: 'Science',
        score: 90,
        semester: 'Fall 2024',
        year: 2024
      });
    });

    it('should get all results for admin', async () => {
      const response = await request(app)
        .get('/api/results')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.results).toBeDefined();
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results.length).toBeGreaterThan(0);
    });

    it('should get student own results', async () => {
      const response = await request(app)
        .get('/api/results/my-results')
        .set('Authorization', `Bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.results).toBeDefined();
    });
  });

  describe('GET /api/results/:id', () => {
    let resultId;

    beforeEach(async () => {
      const result = await Result.create({
        studentId: testUser._id,
        subject: 'Mathematics',
        score: 85,
        semester: 'Fall 2024',
        year: 2024
      });
      resultId = result._id;
    });

    it('should get result by ID', async () => {
      const response = await request(app)
        .get(`/api/results/${resultId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.result).toBeDefined();
      expect(response.body.result.subject).toBe('Mathematics');
    });

    it('should return 404 for non-existent result', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/results/${fakeId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/results/:id', () => {
    let resultId;

    beforeEach(async () => {
      const result = await Result.create({
        studentId: testUser._id,
        subject: 'Mathematics',
        score: 85,
        semester: 'Fall 2024',
        year: 2024
      });
      resultId = result._id;
    });

    it('should allow admin to update result', async () => {
      const updateData = {
        score: 95
      };

      const response = await request(app)
        .put(`/api/results/${resultId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.result.score).toBe(95);
    });

    it('should not allow regular user to update result', async () => {
      const updateData = {
        score: 95
      };

      const response = await request(app)
        .put(`/api/results/${resultId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/results/:id', () => {
    let resultId;

    beforeEach(async () => {
      const result = await Result.create({
        studentId: testUser._id,
        subject: 'Mathematics',
        score: 85,
        semester: 'Fall 2024',
        year: 2024
      });
      resultId = result._id;
    });

    it('should allow admin to delete result', async () => {
      const response = await request(app)
        .delete(`/api/results/${resultId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify deletion
      const deletedResult = await Result.findById(resultId);
      expect(deletedResult).toBeNull();
    });

    it('should not allow regular user to delete result', async () => {
      const response = await request(app)
        .delete(`/api/results/${resultId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
