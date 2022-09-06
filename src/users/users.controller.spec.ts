import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';



describe.skip('UsersController', () => {
  let usersController: UsersController;


  beforeEach(async () => {
    const users: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService]

    }).compile();


    usersController = users.get<UsersController>(UsersController);
  });

  describe('root /users', () => {
    it('should return an array of users', async () => {
      expect(usersController).toBeDefined()
    });
  });
});
