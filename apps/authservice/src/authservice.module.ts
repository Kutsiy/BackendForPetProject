import { Module } from '@nestjs/common';
import { AuthserviceController } from './authservice.controller';
import { AuthserviceService } from './authservice.service';

@Module({
  imports: [],
  controllers: [AuthserviceController],
  providers: [AuthserviceService],
})
export class AuthserviceModule {}
