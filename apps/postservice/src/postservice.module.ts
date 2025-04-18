import { Module } from '@nestjs/common';
import { PostserviceController } from './postservice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CommentPost,
  CommentPostSchema,
  PostName,
  PostSchema,
  User,
  UserRatePost,
  UserRatePostSchema,
  UserSchema,
  UserViewPost,
  UserViewPostSchema,
} from '@app/common/schemas';
import { PostService } from './post.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://kycujegor2020:V70y4HO1DNZvGxkC@posts.z6fvh.mongodb.net/?retryWrites=true&w=majority&appName=Posts',
      {
        connectionName: 'postConnection',
      },
    ),
    MongooseModule.forRoot(
      'mongodb+srv://kycujegor2020:vF1LewKKMDRE3h8L@user.mitxz.mongodb.net/?retryWrites=true&w=majority&appName=User',
      {
        connectionName: 'userConnection',
      },
    ),
    MongooseModule.forFeature(
      [
        { name: PostName.name, schema: PostSchema },
        { name: UserRatePost.name, schema: UserRatePostSchema },
        { name: UserViewPost.name, schema: UserViewPostSchema },
        { name: CommentPost.name, schema: CommentPostSchema },
      ],
      'postConnection',
    ),
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      'userConnection',
    ),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule,
  ],
  controllers: [PostserviceController],
  providers: [PostService, JwtService],
})
export class PostserviceModule {}
