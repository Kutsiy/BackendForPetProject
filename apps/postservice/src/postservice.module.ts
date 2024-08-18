import { Module } from '@nestjs/common';
import { PostserviceController } from './postservice.controller';
import { PostserviceService } from './postservice.service';

@Module({
  imports: [],
  controllers: [PostserviceController],
  providers: [PostserviceService],
})
export class PostserviceModule {}
