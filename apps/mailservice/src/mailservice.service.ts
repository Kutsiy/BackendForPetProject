import { User, UserDocumentType } from '@app/common/schema/user.schema';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MailserviceService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocumentType>,
  ) {}
  async checkMail(link: string) {
    const user = await this.userModel.findOne({ linkForActivate: link });
    if (!user) throw new RpcException('User not found');
    if (user.isActivated) throw new RpcException('Account already activated');
    user.isActivated = true;
    user.save();
    return {};
  }
}
