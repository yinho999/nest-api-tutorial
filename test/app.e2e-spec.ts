import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { request, spec } from 'pactum';
import { AuthDto } from 'src/auth/dto';
import CreateBookmarkDto from 'src/bookmark/dto/create-bookmark.dto';
import EditBookmarkDto from 'src/bookmark/dto/edit-bookmark.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import EditUserDto from 'src/user/dto/edit-user.dto';
import { AppModule } from '../src/app.module';
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
    await app.listen(3333);
    // set base url for pactum
    request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'vlad@gmail.com',
      password: '123',
    };
    describe('signup', () => {
      it('should throw if email empty', async () => {
        return await spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', async () => {
        return await spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if body empty', async () => {
        return await spec().post('/auth/signup').expectStatus(400);
      });
      it('should create a new user', async () => {
        return await spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('signIn', () => {
      it('should throw if email empty', async () => {
        return await spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', async () => {
        return await spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if body empty', async () => {
        return await spec().post('/auth/signin').expectStatus(400);
      });
      it('should return a token and signin', async () => {
        return await spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          // Store the token in the context with the key 'userAt'
          .stores('userAt', 'accessToken');
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it('should throw if token empy', async () => {
        return await spec().get('/users/me').expectStatus(401);
      });
      it('should return a user', async () => {
        return await spec()
          .get('/users/me')
          // Add the token to the header which was stored in the context
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
    describe('Edit User', () => {
      it('should edit user', async () => {
        const dto: EditUserDto = {
          email: 'vlad@codewithvlad.com',
          firstName: 'Vladimir',
        };

        return await spec()
          .patch('/users')
          // Add the token to the header which was stored in the context
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains('accessToken')
          .stores('userAt', 'accessToken');
      });
    });
  });
  describe('Bookmark', () => {
    describe('Get Empty Bookmarks', () => {
      it('should get bookmarks', async () => {
        return await spec()
          .get('/bookmarks')
          // Add the token to the header which was stored in the context
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Create Bookmark', () => {
      it('should create bookmarks', async () => {
        const dto: CreateBookmarkDto = {
          title: 'First Bookmark',
          link: 'https://google.com',
        };
        return await spec()
          .post('/bookmarks')
          // Add the token to the header which was stored in the context
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          // Store the id in the context with the key 'bookmarkId'
          .stores('bookmarkId', 'id');
      });
    });
    describe('Get Bookmarks', () => {
      it('should get bookmarks', async () => {
        return await spec()
          .get('/bookmarks')
          // Add the token to the header which was stored in the context
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Get Bookmark by id', () => {
      it('should get bookmark by id', async () => {
        return await spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          // Add the token to the header which was stored in the context
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      });
    });
    describe('Edit Bookmark by id', () => {
      it('should edit bookmark by id', async () => {
        const dto: EditBookmarkDto = {
          title: 'Second Bookmark',
          description: 'Youtube bookmark description',
          link: 'https://youtube.com',
        };
        return await spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          // Add the token to the header which was stored in the context
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
          .expectBodyContains(dto.link);
      });
    });
    describe('Delete Bookmark by id', () => {
      it('should delete bookmark by id', async () => {
        return await spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          // Add the token to the header which was stored in the context
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });
      it('should get empty bookmark', async () => {
        return await spec()
          .get('/bookmarks')
          // Add the token to the header which was stored in the context
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
