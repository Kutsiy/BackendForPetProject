import { Module } from '@nestjs/common';
import { MailserviceController } from './mailservice.controller';
import { MailserviceService } from './mailservice.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@app/common/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://kycujegor2020:vF1LewKKMDRE3h8L@user.mitxz.mongodb.net/?retryWrites=true&w=majority&appName=User',
      {},
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [MailserviceController],
  providers: [MailserviceService],
})
export class MailserviceModule {}
