import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    prismaService = app.get(PrismaService);
    await prismaService.cleanDb();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    describe('signUp', () => {
      it.todo('should create a new user');
    });
    describe('signIn', () => {
      it.todo('should return a token');
    });
  });
  describe('User', () => {
    describe('Get me', () => {});
    describe('Edit User', () => {});
  });
  describe('Bookmark', () => {
    describe('Create Bookmark', () => {});
    describe('Get Bookmarks', () => {});
    describe('Get Bookmark by id', () => {});
    describe('Edit Bookmark', () => {});
    describe('Delete Bookmark', () => {});
  });
});
