import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  jest.setTimeout(35000);
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('/*', () => {
    describe('ALL', () => {
      test('status 404: uncreated route returns Not found message', () => {
        return request(app.getHttpServer())
          .get('/notaroute')
          .expect(404)
          .then(({ body }) => {
            expect(body).toHaveProperty('error', 'Not Found');
          });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
