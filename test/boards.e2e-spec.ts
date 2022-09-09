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

  afterAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await (app.get(getConnectionToken()) as Connection).db.dropDatabase();
    await app.close();
  });

  describe('POST', () => {
    test('201 status - create new board', () => {
      const testCreateAccount = {
        boardname: 'new board',
      };
      return request(app.getHttpServer())
        .post('/api/boards')
        .send(testCreateAccount)
        .expect(201)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          expect(body).toHaveProperty('newBoard');
          const { newBoard } = body;
          expect(newBoard).toHaveProperty('boardname', 'new board');
          expect(newBoard).toHaveProperty('_id', expect.any(String));
        });
    });

    test('400 status: malformed body', () => {
      const bodyWithWrongField = {
        boardname: 'new board',
        notboardname: 'new board',
      };
      return request(app.getHttpServer())
        .post(`/api/boards`)
        .send(bodyWithWrongField)
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
            expect(board).toHaveProperty('boardname', expect.any(String));
          });
        });
    });
  });

  describe('GET by Id', () => {
    test('200 status', () => {
      const testCreateAccount = {
        boardname: 'testboardgetbyid',
      };
      return request(app.getHttpServer())
        .post('/api/boards')
        .send(testCreateAccount)
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
                expect(board).toHaveProperty('boardname', 'testboardgetbyid');
                expect(board).toHaveProperty('_id', id);
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
});
