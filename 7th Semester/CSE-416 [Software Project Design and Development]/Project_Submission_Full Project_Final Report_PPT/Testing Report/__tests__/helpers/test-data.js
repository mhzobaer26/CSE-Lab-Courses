const jwt = require('jsonwebtoken');

/**
 * Generate a test JWT token
 */
const generateTestToken = (payload = {}) => {
  const defaultPayload = {
    id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    role: 'user',
    ...payload
  };
  
  return jwt.sign(defaultPayload, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '1d'
  });
};

/**
 * Generate admin token
 */
const generateAdminToken = (payload = {}) => {
  return generateTestToken({
    id: '507f1f77bcf86cd799439012',
    email: 'admin@example.com',
    role: 'admin',
    ...payload
  });
};

/**
 * Mock user data
 */
const mockUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123!',
  phone: '+8801712345678',
  role: 'user'
};

/**
 * Mock admin data
 */
const mockAdmin = {
  name: 'Test Admin',
  email: 'admin@example.com',
  password: 'AdminPass123!',
  phone: '+8801712345679',
  role: 'admin'
};

/**
 * Mock student data
 */
const mockStudent = {
  name: 'Test Student',
  email: 'student@example.com',
  studentId: 'STU2024001',
  classLevel: '10',
  section: 'A',
  rollNumber: '001',
  dateOfBirth: new Date('2008-01-01'),
  guardianName: 'Guardian Name',
  guardianPhone: '+8801712345680'
};

/**
 * Mock admission data
 */
const mockAdmission = {
  studentName: 'John Doe',
  fatherName: 'Father Name',
  motherName: 'Mother Name',
  dateOfBirth: new Date('2008-01-01'),
  gender: 'male',
  email: 'john@example.com',
  phone: '+8801712345681',
  address: '123 Test Street, Dhaka',
  previousSchool: 'Previous School',
  classApplied: '9',
  academicYear: '2024'
};

/**
 * Mock result data
 */
const mockResult = {
  studentId: 'STU2024001',
  studentName: 'Test Student',
  classLevel: '10',
  examType: 'midterm',
  examYear: 2024,
  subjects: [
    { name: 'Mathematics', marks: 85, totalMarks: 100 },
    { name: 'English', marks: 78, totalMarks: 100 },
    { name: 'Science', marks: 92, totalMarks: 100 }
  ],
  totalMarks: 255,
  totalPossibleMarks: 300,
  percentage: 85,
  grade: 'A+',
  remarks: 'Excellent'
};

/**
 * Mock news data
 */
const mockNews = {
  title: 'Test News Title',
  content: 'This is test news content for testing purposes.',
  category: 'academic',
  author: 'Test Author',
  published: true
};

/**
 * Mock textbook data
 */
const mockTextbook = {
  title: 'Test Textbook',
  subject: 'Mathematics',
  class: '10',
  author: 'Test Author',
  publisher: 'Test Publisher',
  edition: '2024',
  isbn: '978-1234567890',
  language: 'Bengali',
  available: true
};

module.exports = {
  generateTestToken,
  generateAdminToken,
  mockUser,
  mockAdmin,
  mockStudent,
  mockAdmission,
  mockResult,
  mockNews,
  mockTextbook
};
