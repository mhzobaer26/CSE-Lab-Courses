const mongoose = require('mongoose');
const Admission = require('../../src/models/Admission');
const dbHandler = require('../helpers/db-handler');

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe('Admission Model Test', () => {
  describe('Admission Creation', () => {
    it('should create a valid admission successfully', async () => {
      const admissionData = {
        userId: new mongoose.Types.ObjectId(),
        applicationId: 'APP2024001',
        fullName: 'John Doe',
        email: 'john@example.com',
        selectedUniversity: 'Dhaka University',
        selectedProgram: 'Computer Science',
        totalFee: 1000
      };

      const admission = new Admission(admissionData);
      const savedAdmission = await admission.save();

      expect(savedAdmission._id).toBeDefined();
      expect(savedAdmission.applicationId).toBe(admissionData.applicationId);
      expect(savedAdmission.fullName).toBe(admissionData.fullName);
      expect(savedAdmission.email).toBe(admissionData.email);
      expect(savedAdmission.selectedUniversity).toBe(admissionData.selectedUniversity);
      expect(savedAdmission.selectedProgram).toBe(admissionData.selectedProgram);
      expect(savedAdmission.status).toBe('Pending'); // Default status
    });

    it('should fail to create admission without required fields', async () => {
      const admission = new Admission({});
      let err;
      try {
        await admission.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.userId).toBeDefined();
      expect(err.errors.applicationId).toBeDefined();
      expect(err.errors.fullName).toBeDefined();
      expect(err.errors.email).toBeDefined();
    });

    it('should fail to create admission with duplicate applicationId', async () => {
      const admissionData = {
        userId: new mongoose.Types.ObjectId(),
        applicationId: 'APP2024001',
        fullName: 'John Doe',
        email: 'john@example.com',
        selectedUniversity: 'Dhaka University',
        selectedProgram: 'Computer Science',
        totalFee: 1000
      };

      await Admission.create(admissionData);
      
      const duplicateAdmission = new Admission({
        ...admissionData,
        userId: new mongoose.Types.ObjectId(),
        email: 'jane@example.com'
      });
      
      let err;
      try {
        await duplicateAdmission.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeDefined();
      expect(err.code).toBe(11000); // Duplicate key error
    });

    it('should set default values correctly', async () => {
      const admissionData = {
        userId: new mongoose.Types.ObjectId(),
        applicationId: 'APP2024001',
        fullName: 'John Doe',
        email: 'john@example.com',
        selectedUniversity: 'Dhaka University',
        selectedProgram: 'Computer Science',
        totalFee: 1000
      };

      const admission = new Admission(admissionData);
      const savedAdmission = await admission.save();

      expect(savedAdmission.nationality).toBe('Bangladeshi');
      expect(savedAdmission.serviceFee).toBe(100);
      expect(savedAdmission.admissionFee).toBe(0);
      expect(savedAdmission.status).toBe('Pending');
      expect(savedAdmission.paymentStatus).toBe('Completed');
      expect(savedAdmission.adminRemarks).toBe('');
    });

    it('should validate gender enum values', async () => {
      const admissionData = {
        userId: new mongoose.Types.ObjectId(),
        applicationId: 'APP2024001',
        fullName: 'John Doe',
        email: 'john@example.com',
        selectedUniversity: 'Dhaka University',
        selectedProgram: 'Computer Science',
        totalFee: 1000,
        gender: 'InvalidGender'
      };

      const admission = new Admission(admissionData);
      let err;
      try {
        await admission.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.gender).toBeDefined();
    });

    it('should validate status enum values', async () => {
      const admissionData = {
        userId: new mongoose.Types.ObjectId(),
        applicationId: 'APP2024001',
        fullName: 'John Doe',
        email: 'john@example.com',
        selectedUniversity: 'Dhaka University',
        selectedProgram: 'Computer Science',
        totalFee: 1000,
        status: 'InvalidStatus'
      };

      const admission = new Admission(admissionData);
      let err;
      try {
        await admission.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.status).toBeDefined();
    });

    it('should validate paymentStatus enum values', async () => {
      const admissionData = {
        userId: new mongoose.Types.ObjectId(),
        applicationId: 'APP2024001',
        fullName: 'John Doe',
        email: 'john@example.com',
        selectedUniversity: 'Dhaka University',
        selectedProgram: 'Computer Science',
        totalFee: 1000,
        paymentStatus: 'InvalidPaymentStatus'
      };

      const admission = new Admission(admissionData);
      let err;
      try {
        await admission.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.paymentStatus).toBeDefined();
    });
  });

  describe('Admission with Education Details', () => {
    it('should save SSC and HSC information', async () => {
      const admissionData = {
        userId: new mongoose.Types.ObjectId(),
        applicationId: 'APP2024001',
        fullName: 'John Doe',
        email: 'john@example.com',
        selectedUniversity: 'Dhaka University',
        selectedProgram: 'Computer Science',
        totalFee: 1000,
        sscBoard: 'Dhaka',
        sscRoll: '123456',
        sscRegNo: 'REG123',
        sscYear: '2020',
        sscGPA: 5.0,
        hscBoard: 'Dhaka',
        hscRoll: '654321',
        hscRegNo: 'REG456',
        hscYear: '2022',
        hscGPA: 5.0
      };

      const admission = new Admission(admissionData);
      const savedAdmission = await admission.save();

      expect(savedAdmission.sscBoard).toBe('Dhaka');
      expect(savedAdmission.sscGPA).toBe(5.0);
      expect(savedAdmission.hscBoard).toBe('Dhaka');
      expect(savedAdmission.hscGPA).toBe(5.0);
    });
  });

  describe('Admission Status Management', () => {
    it('should update admission status', async () => {
      const admissionData = {
        userId: new mongoose.Types.ObjectId(),
        applicationId: 'APP2024001',
        fullName: 'John Doe',
        email: 'john@example.com',
        selectedUniversity: 'Dhaka University',
        selectedProgram: 'Computer Science',
        totalFee: 1000
      };

      const admission = new Admission(admissionData);
      const savedAdmission = await admission.save();

      savedAdmission.status = 'Approved';
      savedAdmission.approvedBy = new mongoose.Types.ObjectId();
      savedAdmission.approvedAt = new Date();
      const updatedAdmission = await savedAdmission.save();

      expect(updatedAdmission.status).toBe('Approved');
      expect(updatedAdmission.approvedBy).toBeDefined();
      expect(updatedAdmission.approvedAt).toBeDefined();
    });

    it('should add admin remarks', async () => {
      const admissionData = {
        userId: new mongoose.Types.ObjectId(),
        applicationId: 'APP2024001',
        fullName: 'John Doe',
        email: 'john@example.com',
        selectedUniversity: 'Dhaka University',
        selectedProgram: 'Computer Science',
        totalFee: 1000
      };

      const admission = new Admission(admissionData);
      const savedAdmission = await admission.save();

      savedAdmission.adminRemarks = 'Application approved after document verification';
      const updatedAdmission = await savedAdmission.save();

      expect(updatedAdmission.adminRemarks).toBe('Application approved after document verification');
    });
  });

  describe('Admission Timestamps', () => {
    it('should automatically set timestamps', async () => {
      const admissionData = {
        userId: new mongoose.Types.ObjectId(),
        applicationId: 'APP2024001',
        fullName: 'John Doe',
        email: 'john@example.com',
        selectedUniversity: 'Dhaka University',
        selectedProgram: 'Computer Science',
        totalFee: 1000
      };

      const admission = new Admission(admissionData);
      const savedAdmission = await admission.save();

      expect(savedAdmission.createdAt).toBeDefined();
      expect(savedAdmission.updatedAt).toBeDefined();
    });
  });
});
