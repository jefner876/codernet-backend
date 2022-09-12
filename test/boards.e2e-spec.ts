import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

describe('Boards (e2e)', () => {
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

  describe('POST', () => {
    test('201 status - create new board', () => {
      const createTestBoard = {
        topic: 'test topic',
        subject: 'test subject',
        icon: 'https://cdn-icons-png.flaticon.com/512/1216/1216895.png',
      };
      return request(app.getHttpServer())
        .post('/api/boards')
        .send(createTestBoard)
        .expect(201)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          expect(body).toHaveProperty('newBoard');
          const { newBoard } = body;
          expect(newBoard).toHaveProperty('_id', expect.any(String));
          expect(newBoard).toHaveProperty('topic', 'test topic');
          expect(newBoard).toHaveProperty('subject', 'test subject');
          expect(newBoard).toHaveProperty('postCount', 0);
          expect(newBoard).toHaveProperty('subscriberCount', 0);
          expect(newBoard).toHaveProperty(
            'icon',
            'https://cdn-icons-png.flaticon.com/512/1216/1216895.png',
          );
        });
    });

    test('400 status: malformed body', () => {
      const createTestBoardWithWrongField = {
        topic: 'test topic',
        subject: 'test subject',
        icon: 'https://cdn-icons-png.flaticon.com/512/1216/1216895.png',
        notboardname: 'new board',
      };
      return request(app.getHttpServer())
        .post(`/api/boards`)
        .send(createTestBoardWithWrongField)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe('property notboardname should not exist');
        });
    });
  });

  describe('GET', () => {
    it('200 status', () => {
      return request(app.getHttpServer())
        .get('/api/boards')
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          expect(body).toHaveProperty('boards');
          const { boards } = body;
          expect(boards).toBeInstanceOf(Array);
          expect(boards.length).toBeGreaterThan(0);

          boards.forEach((board) => {
            expect(board).toHaveProperty('topic', expect.any(String));
            expect(board).toHaveProperty('subject', expect.any(String));
            expect(board).toHaveProperty('_id', expect.any(String));
            expect(board).toHaveProperty('subject', 'test subject');
            expect(board).toHaveProperty('postCount', 0);
            expect(board).toHaveProperty('subscriberCount', 0);
          });
        });
    });
  });

  describe('GET by Id', () => {
    test('200 status', () => {
      const createTestBoard = {
        topic: 'testboardgetbyid',
        subject: 'test subject',
        icon: 'https://cdn-icons-png.flaticon.com/512/1216/1216895.png',
      };
      return request(app.getHttpServer())
        .post('/api/boards')
        .send(createTestBoard)
        .expect(201)
        .then(
          ({
            body: {
              newBoard: { _id: id },
            },
          }) => {
            return request(app.getHttpServer())
              .get(`/api/boards/${id}`)
              .expect(200)
              .then(({ body }) => {
                expect(body).toBeInstanceOf(Object);
                expect(body).toHaveProperty('board');
                const { board } = body;
                expect(board).toHaveProperty('topic', 'testboardgetbyid');
                expect(board).toHaveProperty('subject', 'test subject');
                expect(board).toHaveProperty('_id', id);
                expect(board).toHaveProperty('postCount', 0);
                expect(board).toHaveProperty('subscriberCount', 0);
                expect(board).toHaveProperty(
                  'icon',
                  'https://cdn-icons-png.flaticon.com/512/1216/1216895.png',
                );
              });
          },
        );
    });
    test('400 status - id not valid', () => {
      return request(app.getHttpServer())
        .get(`/api/boards/notanid`)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe('Invalid Board ID');
        });
    });
    test('404 status - id not found', () => {
      return request(app.getHttpServer())
        .get(`/api/boards/6319c57ae80c5cc2c300318b`) //valid id format, not in collection
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe('Board ID not found');
        });
    });
  });

  describe('PATCH', () => {
    test('200 status', () => {
      const createTestBoard = {
        topic: 'testboardgetbyid',
        subject: 'test subject',
        icon: 'https://cdn-icons-png.flaticon.com/512/1216/1216895.png',
      };
      return request(app.getHttpServer())
        .post('/api/boards')
        .send(createTestBoard)
        .expect(201)
        .then(
          ({
            body: {
              newBoard: { _id: boardId },
            },
          }) => {
            const testCreateAccount = {
              username: 'new user',
              email: '1234@gmail.com',
            };
            return request(app.getHttpServer())
              .post('/api/users')
              .send(testCreateAccount)
              .expect(201)
              .then(
                ({
                  body: {
                    newUser: { _id: userId },
                  },
                }) => {
                  return request(app.getHttpServer())
                    .patch(`/api/boards`)
                    .send({ userId, boardId })
                    .expect(200)
                    .then(({ body }) => {
                      expect(body).toBeInstanceOf(Object);
                      expect(body).toHaveProperty('updatedBoard');
                      const { updatedBoard } = body;
                      expect(updatedBoard).toHaveProperty(
                        'topic',
                        'testboardgetbyid',
                      );
                      expect(updatedBoard).toHaveProperty(
                        'subject',
                        'test subject',
                      );
                      expect(updatedBoard).toHaveProperty('_id', boardId);
                      expect(updatedBoard).toHaveProperty('postCount', 0);
                      expect(updatedBoard).toHaveProperty('subscriberCount', 1);
                      expect(updatedBoard).toHaveProperty(
                        'icon',
                        'https://cdn-icons-png.flaticon.com/512/1216/1216895.png',
                      );
                      expect(updatedBoard).toHaveProperty('subscribers');
                      const { subscribers } = updatedBoard;
                      expect(subscribers).toBeInstanceOf(Array);
                      expect(subscribers.length).toBe(1);
                      expect(subscribers[0]).toBe(userId);
                      const testCreateAccount = {
                        username: 'new user',
                        email: '1234@gmail.com',
                      };
                      const testCreateAccount2 = {
                        username: 'new user2',
                        email: '2234@gmail.com',
                      };
                      return request(app.getHttpServer())
                        .post('/api/users')
                        .send(testCreateAccount2)
                        .expect(201)
                        .then(
                          ({
                            body: {
                              newUser: { _id: userId2 },
                            },
                          }) => {
                            return request(app.getHttpServer())
                              .patch(`/api/boards`)
                              .send({ userId: userId2, boardId })
                              .expect(200)
                              .then(({ body }) => {
                                expect(body).toBeInstanceOf(Object);
                                expect(body).toHaveProperty('updatedBoard');
                                const { updatedBoard } = body;

                                expect(updatedBoard).toHaveProperty(
                                  'topic',
                                  'testboardgetbyid',
                                );
                                expect(updatedBoard).toHaveProperty(
                                  'subject',
                                  'test subject',
                                );
                                expect(updatedBoard).toHaveProperty(
                                  '_id',
                                  boardId,
                                );
                                expect(updatedBoard).toHaveProperty(
                                  'postCount',
                                  0,
                                );
                                expect(updatedBoard).toHaveProperty(
                                  'subscriberCount',
                                  2,
                                );
                                expect(updatedBoard).toHaveProperty(
                                  'icon',
                                  'https://cdn-icons-png.flaticon.com/512/1216/1216895.png',
                                );
                                expect(updatedBoard).toHaveProperty(
                                  'subscribers',
                                );
                                const { subscribers } = updatedBoard;
                                expect(subscribers).toBeInstanceOf(Array);
                                expect(subscribers.length).toBe(2);
                                expect(subscribers[1]).toBe(userId2);
                              });
                          },
                        );
                    });
                },
              );
          },
        );
    });
  });
});
