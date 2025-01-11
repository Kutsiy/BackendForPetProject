import { Controller, Get } from '@nestjs/common';
import { MailserviceService } from './mailservice.service';
import {
  CheckLinkArg,
  Empty,
  MailServiceController,
  MailServiceControllerMethods,
  SendMailArgs,
} from '@app/common/types/protos/mail';
import { Observable } from 'rxjs';

@Controller()
@MailServiceControllerMethods()
export class MailserviceController implements MailServiceController {
  constructor(private readonly mailService: MailserviceService) {}

  async sendMail(request: SendMailArgs): Promise<Empty> {
    return await this.mailService.sendMail(request);
  }

  async checkMail(request: CheckLinkArg): Promise<Empty> {
    return await this.mailService.checkMail(request.link);
  }
}
