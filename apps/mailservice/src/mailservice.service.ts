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
      html: `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); padding: 20px;">
        <h2 style="color: #333333;">Welcome to NE!</h2>
        <p style="font-size: 16px; color: #555555;">
          Thank you for registering. Please activate your account by clicking the button below:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3000/link/${link}" 
             style="background-color: #007BFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
            Activate Account
          </a>
        </div>
        <p style="font-size: 14px; color: #999999;">
          If you did not sign up for this account, please ignore this email.
        </p>
      </div>
    </div>
  `,
    });
    return {};
  }

  async checkMail(link: string) {
    const user = await this.userModel.findOne({ linkForActivate: link });
    if (!user) throw new RpcException('User not found');
    if (user.isActivated) throw new RpcException('Account already activated');
    user.isActivated = true;
    user.save();
    console.log('LOGGG');
    return { link: 'http://localhost:4200' };
  }
}
