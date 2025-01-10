import { Test, TestingModule } from '@nestjs/testing';
import { MailserviceController } from './mailservice.controller';
import { MailserviceService } from './mailservice.service';

describe('MailserviceController', () => {
  let mailserviceController: MailserviceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MailserviceController],
      providers: [MailserviceService],
    }).compile();

    mailserviceController = app.get<MailserviceController>(MailserviceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(mailserviceController.getHello()).toBe('Hello World!');
    });
  });
});
