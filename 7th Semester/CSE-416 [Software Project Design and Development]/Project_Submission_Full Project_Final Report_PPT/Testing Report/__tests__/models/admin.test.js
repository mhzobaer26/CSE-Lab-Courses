const mongoose = require('mongoose');
const Admin = require('../../src/models/Admin');
const dbHandler = require('../helpers/db-handler');

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe('Admin Model Test', () => {
  describe('Admin Creation', () => {
    it('should create a valid admin successfully', async () => {
      const adminData = {
        username: 'admin123',
        email: 'admin@example.com',
        password: 'AdminPassword123!',
        role: 'admin'
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();

      expect(savedAdmin._id).toBeDefined();
      expect(savedAdmin.username).toBe(adminData.username);
      expect(savedAdmin.email).toBe(adminData.email);
      expect(savedAdmin.role).toBe('admin');
      expect(savedAdmin.createdAt).toBeDefined();
    });

    it('should fail to create admin without required fields', async () => {
      const admin = new Admin({});
      let err;
      try {
        await admin.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.username).toBeDefined();
      expect(err.errors.email).toBeDefined();
      expect(err.errors.password).toBeDefined();
    });

    it('should fail to create admin with duplicate username', async () => {
      const adminData = {
        username: 'admin123',
        email: 'admin1@example.com',
        password: 'Password123!'
      };

      await Admin.create(adminData);
      
      const duplicateAdmin = new Admin({
        username: 'admin123',
        email: 'admin2@example.com',
        password: 'Password123!'
      });
      
      let err;
      try {
        await duplicateAdmin.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeDefined();
      expect(err.code).toBe(11000); // Duplicate key error
    });

    it('should fail to create admin with duplicate email', async () => {
      const adminData = {
        username: 'admin1',
        email: 'admin@example.com',
        password: 'Password123!'
      };

      await Admin.create(adminData);
      
      const duplicateAdmin = new Admin({
        username: 'admin2',
        email: 'admin@example.com',
        password: 'Password123!'
      });
      
      let err;
      try {
        await duplicateAdmin.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeDefined();
      expect(err.code).toBe(11000);
    });

    it('should set default role as admin', async () => {
      const adminData = {
        username: 'admin123',
        email: 'admin@example.com',
        password: 'Password123!'
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();
      expect(savedAdmin.role).toBe('admin');
    });

    it('should trim username and email', async () => {
      const adminData = {
        username: '  admin123  ',
        email: '  admin@example.com  ',
        password: 'Password123!'
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();
      
      expect(savedAdmin.username).toBe('admin123');
      expect(savedAdmin.email).toBe('admin@example.com');
    });
  });

  describe('Admin Methods', () => {
    it('should compare passwords correctly', async () => {
      const adminData = {
        username: 'admin123',
        email: 'admin@example.com',
        password: 'Password123!'
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();
      
      const isMatch = savedAdmin.comparePassword('Password123!');
      expect(isMatch).toBe(true);
      
      const isNotMatch = savedAdmin.comparePassword('WrongPassword');
      expect(isNotMatch).toBe(false);
    });
  });

  describe('Admin Timestamps', () => {
    it('should automatically set createdAt timestamp', async () => {
      const adminData = {
        username: 'admin123',
        email: 'admin@example.com',
        password: 'Password123!'
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();
      
      expect(savedAdmin.createdAt).toBeDefined();
      expect(savedAdmin.createdAt).toBeInstanceOf(Date);
    });
  });
});
