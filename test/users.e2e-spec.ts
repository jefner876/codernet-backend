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

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await (app.get(getConnectionToken()) as Connection).db.dropDatabase();
    await app.close();
  });

  let postId = '';

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
          expect(body).toHaveProperty('newUser');
          const { newUser } = body;
          expect(newUser).toHaveProperty('username', 'new user');
          expect(newUser).toHaveProperty('email', '1234@gmail.com');
          expect(newUser).toHaveProperty('_id', expect.any(String));
          expect(newUser).toHaveProperty('location', expect.any(String));
          expect(newUser).toHaveProperty('avatar', expect.any(String));
          expect(newUser).toHaveProperty('bio', expect.any(String));
          expect(newUser).toHaveProperty('dateOfBirth', expect.any(String));
          postId = newUser._id;
        });
    });
    test('201 status: data type converted', () => {
      const testCreateAccount = {
        username: 10,
        email: '123456@gmail.com',
      };
      return request(app.getHttpServer())
        .post('/api/users')
        .send(testCreateAccount)
        .expect(201)
        .then(({ body: { newUser } }) => {
          expect(newUser).toHaveProperty('username', expect.any(String));
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
        .then(({ body: { message } }) => {
          expect(message).toBe('Bad Request');
        });
    });
    test('400 status: malformed body', () => {
      const bodyWithWrongField = {
        username: 'new user',
        email: '1234@gmail.com',
        notafield: 'testuser',
      };
      return request(app.getHttpServer())
        .post(`/api/users`)
        .send(bodyWithWrongField)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe('property notafield should not exist');
        });
    });
  });
  describe('PATCH', () => {
    test('200 status - update user profile fields', () => {
      const profileUpdates = {
        username: 'updated username',
        email: 'updatedemail@gmail.com',
        location: 'new location',
        avatar: 'https://cdn-icons-png.flaticon.com/512/40/40058.png',
        bio: 'new bio information',
      };
      return request(app.getHttpServer())
        .patch(`/api/users/${postId}`)
        .send(profileUpdates)
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          expect(body).toHaveProperty('updatedUser');
          const { updatedUser } = body;
          expect(updatedUser).toHaveProperty('username', 'updated username');
          expect(updatedUser).toHaveProperty('email', 'updatedemail@gmail.com');
          expect(updatedUser).toHaveProperty('_id', postId);
          expect(updatedUser).toHaveProperty('location', 'new location');
          expect(updatedUser).toHaveProperty(
            'avatar',
            'https://cdn-icons-png.flaticon.com/512/40/40058.png',
          );
          expect(updatedUser).toHaveProperty('bio', 'new bio information');
          expect(updatedUser).toHaveProperty('dateOfBirth', expect.any(String));
        });
    });
    test('200 status: data type converted', () => {
      const testCreateAccount = {
        username: 10,
        email: '1234@gmail.com',
      };
      return request(app.getHttpServer())
        .patch(`/api/users/${postId}`)
        .send(testCreateAccount)
        .expect(200)
        .then(({ body: { updatedUser } }) => {
          expect(updatedUser).toHaveProperty('username', expect.any(String));
        });
    });
    test('400 status: malformed body', () => {
      const bodyWithWrongField = {
        notafield: 'testuser',
        alsonotafield: 'testuser',
      };
      return request(app.getHttpServer())
        .patch(`/api/users/${postId}`)
        .send(bodyWithWrongField)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            'property notafield should not exist and property alsonotafield should not exist',
          );
        });
    });
    test('400 status - id not valid', () => {
      const profileUpdates = {
        username: 'updated username',
        email: 'updatedemail@gmail.com',
        location: 'new location',
        avatar: 'https://cdn-icons-png.flaticon.com/512/40/40058.png',
        bio: 'new bio information',
      };
      return request(app.getHttpServer())
        .patch(`/api/users/notanid`)
        .send(profileUpdates)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe('Invalid User ID');
        });
    });
    test('404 status - id not found', () => {
      const profileUpdates = {
        username: 'updated username',
        email: 'updatedemail@gmail.com',
        location: 'new location',
        avatar: 'https://cdn-icons-png.flaticon.com/512/40/40058.png',
        bio: 'new bio information',
      };
      return request(app.getHttpServer())
        .patch(`/api/users/6319c57ae80c5cc2c300318b`) //valid id format, not in collection
        .send(profileUpdates)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe('User ID not found');
        });
    });
  });

  describe('GET', () => {
    it('200 status', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          expect(body).toHaveProperty('users');
          const { users } = body;
          expect(users).toBeInstanceOf(Array);
          expect(users.length).toBeGreaterThan(0);

          users.forEach((user) => {
            expect(user).toHaveProperty('username', expect.any(String));
            expect(user).toHaveProperty('email', expect.any(String));
            expect(user).toHaveProperty('location', expect.any(String));
            expect(user).toHaveProperty('avatar', expect.any(String));
            expect(user).toHaveProperty('bio', expect.any(String));
            expect(user).toHaveProperty('dateOfBirth', expect.any(String));
          });
        });
    });
  });
});
