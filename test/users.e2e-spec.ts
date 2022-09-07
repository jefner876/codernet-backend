import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST', () => {
    it('201 status', () => {
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

  afterAll(async () => {
    await app.close();
  });
});
