import { Test, TestingModule } from '@nestjs/testing';
import { PostserviceController } from './postservice.controller';
import { PostserviceService } from './postservice.service';

describe('PostserviceController', () => {
  let postserviceController: PostserviceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PostserviceController],
      providers: [PostserviceService],
    }).compile();

    postserviceController = app.get<PostserviceController>(
      PostserviceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(postserviceController.getHello()).toBe('Hello World 3001!');
    });
  });
});
