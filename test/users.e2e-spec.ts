import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await (app.get(getConnectionToken()) as Connection).db.dropDatabase();
    await app.close();
  });

  describe('POST', () => {
    test('201 status - create new user', () => {
      const testCreateAccount = {
        username: 'new user',
        email: '1234@gmail.com',
      };
      return request(app.getHttpServer())
        .post('/api/users')
        .send(testCreateAccount)
        .expect(201)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          expect(body).toHaveProperty('username', 'new user');
          expect(body).toHaveProperty('email', '1234@gmail.com');
          expect(body).toHaveProperty('_id', expect.any(String));
        });
    });
    test('200 status: data type converted', () => {
      const testCreateAccount = {
        username: 10,
        email: '1234@gmail.com',
      };
      return request(app.getHttpServer())
        .post('/api/users')
        .send(testCreateAccount)
        .expect(201)
        .then(({ body }) => {
          expect(body).toHaveProperty('username', expect.any(String));
        });
    });
    test('400 status: malformed body rejection', () => {
      const testCreateAccount = {
        username: 'testuser',
      };
      return request(app.getHttpServer())
        .post('/api/users')
        .send(testCreateAccount)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe('Missing required data');
        });
    });
  });

  describe('GET', () => {
    it('200 status', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Array);
          expect(body.length).toBeGreaterThan(0);
          body.forEach((user) => {
            expect(user).toHaveProperty('username', expect.any(String));
            expect(user).toHaveProperty('email', expect.any(String));
          });
        });
    });
  });

  describe('POST', () => {
    test('201 status - extended for full profile', () => {
      const testCreateAccount = {
        username: 'new user expanded',
        email: '12345@gmail.com',
      };
      return request(app.getHttpServer())
        .post('/api/users')
        .send(testCreateAccount)
        .expect(201)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          // expect(body).toHaveProperty('location', expect.any(String));
          // expect(body).toHaveProperty('dateOfBirth', expect.any(Date));
          // expect(body).toHaveProperty('avatar', expect.any(String));
          // expect(body).toHaveProperty('bio', expect.any(String));
        });
    });
  });
});
