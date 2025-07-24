// @jest-environment node
import request from 'supertest';
import app from '../../src/app';

describe('Auth Controller', () => {
  describe('POST /api/v1/auth/signin', () => {
    it('should return 401 for invalid login credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signin')
        .send({ email: 'fake@example.com', password: 'wrongpassword' });
      
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for missing email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signin')
        .send({ password: 'somepassword' });
      
      expect(res.status).toBe(400);
    });

    it('should return 400 for missing password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signin')
        .send({ email: 'test@example.com' });
      
      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid email format', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signin')
        .send({ email: 'invalid-email', password: 'password123' });
      
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/signup', () => {
    const validSignupData = {
      name: 'Test User',
      email: 'newuser@example.com',
      password: 'password123'
    };

    it('should return 400 for missing required fields', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .send({ email: 'test@example.com' }); // missing name and password
      
      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid email format in signup', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          ...validSignupData,
          email: 'invalid-email'
        });
      
      expect(res.status).toBe(400);
    });

    it('should handle duplicate email registration', async () => {
      // First attempt - might succeed or fail depending on database state
      await request(app)
        .post('/api/v1/auth/signup')
        .send(validSignupData);

      // Second attempt with same email should fail
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .send(validSignupData);
      
      // Should return conflict status for duplicate email
      expect([400, 409]).toContain(res.status);
    });
  });
}); 