const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const Admission = require('../../src/models/Admission');
const User = require('../../src/models/User');
const dbHandler = require('../helpers/db-handler');
const { generateTestToken, generateAdminToken } = require('../helpers/test-data');

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe('Admission API Tests', () => {
  let testUser;
  let adminUser;
  let userToken;
  let adminToken;

  beforeEach(async () => {
    // Create test user
    testUser = await User.create({
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '01712345678',
      password: 'Password123!',
      role: 'student'
    });

    // Create admin user
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

  describe('POST /api/admissions', () => {
    it('should create admission application with valid data', async () => {
      const admissionData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '01712345678',
        selectedUniversity: 'Dhaka University',
        selectedProgram: 'Computer Science',
        sscGPA: 5.0,
        hscGPA: 5.0,
        totalFee: 1000
      };

      const response = await request(app)
        .post('/api/admissions')
        .set('Authorization', `Bearer ${userToken}`)
        .send(admissionData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.admission).toBeDefined();
      expect(response.body.admission.fullName).toBe(admissionData.fullName);
      expect(response.body.admission.applicationId).toBeDefined();
    });

    it('should fail without authentication', async () => {
      const admissionData = {
        fullName: 'John Doe',
        selectedUniversity: 'Dhaka University',
        selectedProgram: 'Computer Science'
      };

      const response = await request(app)
        .post('/api/admissions')
        .send(admissionData)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/admissions', () => {
    beforeEach(async () => {
      // Create test admissions
      await Admission.create({
        userId: testUser._id,
        applicationId: 'APP2024001',
        fullName: 'John Doe',
        email: 'john@example.com',
        selectedUniversity: 'Dhaka University',
        selectedProgram: 'Computer Science',
        totalFee: 1000
      });
    });

    it('should get all admissions for admin', async () => {
      const response = await request(app)
        .get('/api/admissions')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.admissions).toBeDefined();
      expect(Array.isArray(response.body.admissions)).toBe(true);
    });

    it('should get user own admissions', async () => {
      const response = await request(app)
        .get('/api/admissions/my-applications')
        .set('Authorization', `Bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.admissions).toBeDefined();
    });
  });

  describe('PUT /api/admissions/:id/status', () => {
    let admissionId;

    beforeEach(async () => {
      const admission = await Admission.create({
        userId: testUser._id,
        applicationId: 'APP2024001',
        fullName: 'John Doe',
        email: 'john@example.com',
        selectedUniversity: 'Dhaka University',
        selectedProgram: 'Computer Science',
        totalFee: 1000,
        status: 'Pending'
      });
      admissionId = admission._id;
    });

    it('should allow admin to update admission status', async () => {
      const response = await request(app)
        .put(`/api/admissions/${admissionId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Approved', adminRemarks: 'Application approved' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.admission.status).toBe('Approved');
    });

    it('should not allow regular user to update status', async () => {
      const response = await request(app)
        .put(`/api/admissions/${admissionId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'Approved' })
        .expect('Content-Type', /json/)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
