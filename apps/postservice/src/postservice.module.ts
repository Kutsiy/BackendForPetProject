import { Module } from '@nestjs/common';
import { PostserviceController } from './postservice.controller';

@Module({
  imports: [],
  controllers: [PostserviceController],
})
export class PostserviceModule {}
