import { Test, TestingModule } from '@nestjs/testing';
import { AuthserviceController } from './authservice.controller';
import { AuthserviceService } from './authservice.service';

describe('AuthserviceController', () => {
  let authserviceController: AuthserviceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthserviceController],
      providers: [AuthserviceService],
    }).compile();

    authserviceController = app.get<AuthserviceController>(AuthserviceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(authserviceController.getHello()).toBe('Hello World!');
    });
  });
});
