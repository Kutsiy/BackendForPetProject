import { Module } from '@nestjs/common';
import { PostserviceController } from './postservice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostName, PostSchema } from '@app/common/schemas';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://kycujegor2020:V70y4HO1DNZvGxkC@posts.z6fvh.mongodb.net/?retryWrites=true&w=majority&appName=Posts',
      {},
    ),
    MongooseModule.forFeature([{ name: PostName.name, schema: PostSchema }]),
  ],
  controllers: [PostserviceController],
})
export class PostserviceModule {}
