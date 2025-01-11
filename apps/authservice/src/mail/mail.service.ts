import {
  MAIL_SERVICE_NAME,
  MailServiceClient,
  SendMailArgs,
} from '@app/common/types/protos/mail';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class MailService {
  private mailService: MailServiceClient;
  constructor(@Inject('MAIL_SERVICE') private mailClient: ClientGrpc) {}
  onModuleInit() {
    this.mailService =
      this.mailClient.getService<MailServiceClient>(MAIL_SERVICE_NAME);
  }

  async sendMail(mailArgs: SendMailArgs) {
    const answer = await this.mailService.sendMail(mailArgs);
    return answer.toPromise();
  }
}
