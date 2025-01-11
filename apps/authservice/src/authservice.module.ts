import { Module } from '@nestjs/common';
import { AuthserviceController } from './authservice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { User, UserSchema } from '@app/common/schema/user.schema';
import { TokenService } from './token.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail/mail.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { protobufPackage as mailProtobufPackage } from '@app/common/types/protos/mail';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      'mongodb+srv://kycujegor2020:vF1LewKKMDRE3h8L@user.mitxz.mongodb.net/?retryWrites=true&w=majority&appName=User',
      {},
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
  ],
})
export class AuthserviceModule {}
