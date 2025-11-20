const mongoose = require('mongoose');
const User = require('../../src/models/User');
const dbHandler = require('../helpers/db-handler');

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe('User Model Test', () => {
  describe('User Creation', () => {
    it('should create a valid user successfully', async () => {
      const userData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '01712345678',
        password: 'Password123!',
        role: 'student',
        studentId: 'STU2024001'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.fullName).toBe(userData.fullName);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.phone).toBe(userData.phone);
      expect(savedUser.role).toBe(userData.role);
      expect(savedUser.studentId).toBe(userData.studentId);
    });

    it('should fail to create user without required fields', async () => {
      const user = new User({});
      let err;
      try {
        await user.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.fullName).toBeDefined();
      expect(err.errors.email).toBeDefined();
    });

    it('should fail to create user with duplicate email', async () => {
      const userData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '01712345678',
        password: 'Password123!'
      };

      await User.create(userData);
      
      const duplicateUser = new User(userData);
      let err;
      try {
        await duplicateUser.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeDefined();
      expect(err.code).toBe(11000); // Duplicate key error
    });

    it('should validate email format', async () => {
      const userData = {
        fullName: 'John Doe',
        email: 'invalid-email',
        phone: '01712345678',
        password: 'Password123!'
      };

      const user = new User(userData);
      let err;
      try {
        await user.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.email).toBeDefined();
    });

    it('should validate phone number format', async () => {
      const userData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '12345', // Invalid phone
        password: 'Password123!'
      };

      const user = new User(userData);
      let err;
      try {
        await user.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.phone).toBeDefined();
    });

    it('should accept valid Bangladeshi phone formats', async () => {
      const validPhones = ['01712345678', '+8801712345678', '8801712345678'];
      
      for (let i = 0; i < validPhones.length; i++) {
        const userData = {
          fullName: `User ${i}`,
          email: `user${i}@example.com`,
          phone: validPhones[i],
          password: 'Password123!'
        };
        
        const user = new User(userData);
        const savedUser = await user.save();
        expect(savedUser.phone).toBe(validPhones[i]);
      }
    });
  });

  describe('User with Google Auth', () => {
    it('should create user with Google authentication', async () => {
      const userData = {
        fullName: 'Google User',
        email: 'google@example.com',
        googleId: 'google123456',
        authProvider: 'google'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.googleId).toBe(userData.googleId);
      expect(savedUser.authProvider).toBe('google');
    });

    it('should not require password for Google auth users', async () => {
      const userData = {
        fullName: 'Google User',
        email: 'google@example.com',
        googleId: 'google123456',
        authProvider: 'google'
      };

      const user = new User(userData);
      const savedUser = await user.save();
      expect(savedUser).toBeDefined();
    });
  });

  describe('User Roles', () => {
    it('should set default role as student', async () => {
      const userData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '01712345678',
        password: 'Password123!'
      };

      const user = new User(userData);
      const savedUser = await user.save();
      expect(savedUser.role).toBe('student');
    });

    it('should accept valid roles', async () => {
      const roles = ['student', 'teacher', 'parent', 'admin'];
      
      for (let i = 0; i < roles.length; i++) {
        const userData = {
          fullName: `User ${i}`,
          email: `user${i}@example.com`,
          phone: `0171234567${i}`,
          password: 'Password123!',
          role: roles[i]
        };
        
        const user = new User(userData);
        const savedUser = await user.save();
        expect(savedUser.role).toBe(roles[i]);
      }
    });
  });

  describe('User Password Handling', () => {
    it('should hash password before saving', async () => {
      const userData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '01712345678',
        password: 'Password123!'
      };

      const user = new User(userData);
      const savedUser = await user.save();
      
      // Password should be selected false by default, need to explicitly select
      const userWithPassword = await User.findById(savedUser._id).select('+password');
      expect(userWithPassword.password).toBeDefined();
      expect(userWithPassword.password).not.toBe(userData.password); // Should be hashed
    });

    it('should not include password in default queries', async () => {
      const userData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '01712345678',
        password: 'Password123!'
      };

      const user = new User(userData);
      const savedUser = await user.save();
      
      const foundUser = await User.findById(savedUser._id);
      expect(foundUser.password).toBeUndefined();
    });
  });

  describe('User Profile Fields', () => {
    it('should save additional profile information', async () => {
      const userData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '01712345678',
        password: 'Password123!',
        address: 'Dhaka, Bangladesh',
        dateOfBirth: new Date('2000-01-01'),
        bloodGroup: 'A+',
        gender: 'Male',
        nationality: 'Bangladeshi'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.address).toBe(userData.address);
      expect(savedUser.bloodGroup).toBe(userData.bloodGroup);
      expect(savedUser.gender).toBe(userData.gender);
    });

    it('should set default avatar', async () => {
      const userData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '01712345678',
        password: 'Password123!'
      };

      const user = new User(userData);
      const savedUser = await user.save();
      expect(savedUser.avatar).toBe('/assets/images/default-avatar.png');
    });
  });
});
