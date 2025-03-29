import { Module } from '@nestjs/common';
import { PostserviceController } from './postservice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostName, PostSchema } from '@app/common/schemas';
import { PostService } from './post.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://kycujegor2020:V70y4HO1DNZvGxkC@posts.z6fvh.mongodb.net/?retryWrites=true&w=majority&appName=Posts',
      {},
    ),
    MongooseModule.forFeature([{ name: PostName.name, schema: PostSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule,
  ],
  controllers: [PostserviceController],
  providers: [PostService, JwtService],
})
export class PostserviceModule {}
