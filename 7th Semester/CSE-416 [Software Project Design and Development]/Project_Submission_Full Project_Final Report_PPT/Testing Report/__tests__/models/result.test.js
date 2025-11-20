const mongoose = require('mongoose');
const Result = require('../../src/models/Result');
const dbHandler = require('../helpers/db-handler');

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe('Result Model Test', () => {
  describe('Result Creation', () => {
    it('should create a valid result successfully', async () => {
      const resultData = {
        studentId: new mongoose.Types.ObjectId(),
        subject: 'Mathematics',
        score: 85,
        semester: 'Fall 2024',
        year: 2024
      };

      const result = new Result(resultData);
      const savedResult = await result.save();

      expect(savedResult._id).toBeDefined();
      expect(savedResult.subject).toBe(resultData.subject);
      expect(savedResult.score).toBe(resultData.score);
      expect(savedResult.semester).toBe(resultData.semester);
      expect(savedResult.year).toBe(resultData.year);
      expect(savedResult.createdAt).toBeDefined();
    });

    it('should fail to create result without required fields', async () => {
      const result = new Result({});
      let err;
      try {
        await result.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.studentId).toBeDefined();
      expect(err.errors.subject).toBeDefined();
      expect(err.errors.score).toBeDefined();
      expect(err.errors.semester).toBeDefined();
      expect(err.errors.year).toBeDefined();
    });

    it('should validate score is between 0 and 100', async () => {
      const resultData = {
        studentId: new mongoose.Types.ObjectId(),
        subject: 'Mathematics',
        semester: 'Fall 2024',
        year: 2024
      };

      // Test score below minimum
      const invalidResultLow = new Result({ ...resultData, score: -10 });
      let err;
      try {
        await invalidResultLow.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.score).toBeDefined();

      // Test score above maximum
      const invalidResultHigh = new Result({ ...resultData, score: 150 });
      try {
        await invalidResultHigh.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.score).toBeDefined();

      // Test valid score
      const validResult = new Result({ ...resultData, score: 85 });
      const savedResult = await validResult.save();
      expect(savedResult.score).toBe(85);
    });

    it('should accept valid ObjectId for studentId', async () => {
      const studentId = new mongoose.Types.ObjectId();
      const resultData = {
        studentId: studentId,
        subject: 'Mathematics',
        score: 85,
        semester: 'Fall 2024',
        year: 2024
      };

      const result = new Result(resultData);
      const savedResult = await result.save();
      
      expect(savedResult.studentId.toString()).toBe(studentId.toString());
    });
  });

  describe('Result Timestamps', () => {
    it('should automatically set createdAt timestamp', async () => {
      const resultData = {
        studentId: new mongoose.Types.ObjectId(),
        subject: 'Mathematics',
        score: 85,
        semester: 'Fall 2024',
        year: 2024
      };

      const result = new Result(resultData);
      const savedResult = await result.save();
      
      expect(savedResult.createdAt).toBeDefined();
      expect(savedResult.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('Result Queries', () => {
    it('should find results by studentId', async () => {
      const studentId = new mongoose.Types.ObjectId();
      const results = [
        {
          studentId: studentId,
          subject: 'Mathematics',
          score: 85,
          semester: 'Fall 2024',
          year: 2024
        },
        {
          studentId: studentId,
          subject: 'Science',
          score: 90,
          semester: 'Fall 2024',
          year: 2024
        }
      ];

      await Result.insertMany(results);
      const foundResults = await Result.find({ studentId: studentId });
      
      expect(foundResults).toHaveLength(2);
      expect(foundResults[0].studentId.toString()).toBe(studentId.toString());
    });

    it('should find results by year and semester', async () => {
      const results = [
        {
          studentId: new mongoose.Types.ObjectId(),
          subject: 'Mathematics',
          score: 85,
          semester: 'Fall 2024',
          year: 2024
        },
        {
          studentId: new mongoose.Types.ObjectId(),
          subject: 'Science',
          score: 90,
          semester: 'Spring 2024',
          year: 2024
        }
      ];

      await Result.insertMany(results);
      const foundResults = await Result.find({ year: 2024, semester: 'Fall 2024' });
      
      expect(foundResults).toHaveLength(1);
      expect(foundResults[0].semester).toBe('Fall 2024');
    });
  });
});
