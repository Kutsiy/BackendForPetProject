import { User, UserDocumentType } from '@app/common/schemas/user.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MailserviceService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocumentType>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendMail({ link, mail }) {
    await this.mailerService.sendMail({
      from: `NE <${this.configService.get<string>('MAIL_USER')}>`,
      to: mail,
      subject: 'NE: Activate account',
      html: `<p>Please activate your account, click to this text => <a href="http://localhost:3000/link/${link}">ACTIVATE</a></p>`,
    });
    return {};
  }

  async checkMail(link: string) {
    const user = await this.userModel.findOne({ linkForActivate: link });
    if (!user) throw new RpcException('User not found');
    if (user.isActivated) throw new RpcException('Account already activated');
    user.isActivated = true;
    user.save();
    return {};
  }
}
