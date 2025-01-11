import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { MailService } from './mail.service';
import { AllExceptionFilter } from '../tools/exeption/exeption.filter';

@Controller('link')
@UseFilters(new AllExceptionFilter())
export class MailController {
  constructor(private readonly mailserviceService: MailService) {}

  @Get(':link')
  async checkMail(@Param('link') link: string) {
    return await this.mailserviceService.checkMail(link);
  }
}
