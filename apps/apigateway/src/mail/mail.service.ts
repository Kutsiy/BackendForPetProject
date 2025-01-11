import {
  MAIL_SERVICE_NAME,
  MailServiceClient,
} from '@app/common/types/protos/mail';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class MailService implements OnModuleInit {
  private mailService: MailServiceClient;
  constructor(@Inject('MAIL_SERVICE') private mailClient: ClientGrpc) {}
  onModuleInit() {
    this.mailService =
      this.mailClient.getService<MailServiceClient>(MAIL_SERVICE_NAME);
  }

  async checkMail(link: string) {
    return await this.mailService.checkMail({ link });
  }
}
