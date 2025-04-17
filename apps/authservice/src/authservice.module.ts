import { Module, OnModuleInit } from '@nestjs/common';
import { AuthserviceController } from './authservice.controller';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { User, UserSchema } from '@app/common/schemas/user.schema';
import { TokenService } from './token.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail/mail.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { protobufPackage as mailProtobufPackage } from '@app/common/types/protos/mail';
import {
  CommentPost,
  CommentPostSchema,
  PostName,
  PostSchema,
  Role,
  RoleSchema,
  Token,
  TokenSchema,
  UserRatePost,
  UserRatePostSchema,
  UserRole,
  UserRoleSchema,
  UserViewPost,
  UserViewPostSchema,
} from '@app/common';
import { RoleService } from './role.service';
import { Model } from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      'mongodb+srv://kycujegor2020:vF1LewKKMDRE3h8L@user.mitxz.mongodb.net/?retryWrites=true&w=majority&appName=User',
      {},
    ),
    MongooseModule.forRoot(
      'mongodb+srv://kycujegor2020:V70y4HO1DNZvGxkC@posts.z6fvh.mongodb.net/?retryWrites=true&w=majority&appName=Posts',
      {
        connectionName: 'postConnection',
      },
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Token.name, schema: TokenSchema },
      { name: UserRole.name, schema: UserRoleSchema },
    ]),
    MongooseModule.forFeature(
      [
        { name: PostName.name, schema: PostSchema },
        { name: UserRatePost.name, schema: UserRatePostSchema },
        { name: UserViewPost.name, schema: UserViewPostSchema },
        { name: CommentPost.name, schema: CommentPostSchema },
      ],
      'postConnection',
    ),
    JwtModule,
    ClientsModule.register([
      {
        name: 'MAIL_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: mailProtobufPackage,
          protoPath: join(__dirname, '../mail.proto'),
          // url: 'post-service:5002',
          url: 'localhost:5002',
        },
      },
    ]),
  ],
  controllers: [AuthserviceController],
  providers: [
    AuthService,
    TokenService,
    JwtService,
    ConfigService,
    MailService,
    RoleService,
  ],
})
export class AuthserviceModule {}
