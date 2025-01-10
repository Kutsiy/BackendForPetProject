import { Module } from '@nestjs/common';
import { MailserviceController } from './mailservice.controller';
import { MailserviceService } from './mailservice.service';

@Module({
  imports: [],
  controllers: [MailserviceController],
  providers: [MailserviceService],
})
export class MailserviceModule {}
