import { Controller, Get } from '@nestjs/common';
import { MailserviceService } from './mailservice.service';
import {
  CheckLinkArg,
  Empty,
  MailServiceController,
  MailServiceControllerMethods,
} from '@app/common/types/protos/mail';
import { Observable } from 'rxjs';

@Controller()
@MailServiceControllerMethods()
export class MailserviceController implements MailServiceController {
  constructor(private readonly mailService: MailserviceService) {}

  async checkMail(request: CheckLinkArg): Promise<Empty> {
    return await this.mailService.checkMail(request.link);
  }
}
