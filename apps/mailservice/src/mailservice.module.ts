import { Module } from '@nestjs/common';
import { MailserviceController } from './mailservice.controller';
import { MailserviceService } from './mailservice.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@app/common/schema/user.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          transport: {
            service: 'Gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
              user: config.get<string>('MAIL_USER'),
              pass: config.get<string>('MAIL_PASS'),
            },
          },
        };
      },
    }),
  ],
  controllers: [MailserviceController],
  providers: [MailserviceService, ConfigService],
})
export class MailserviceModule {}
