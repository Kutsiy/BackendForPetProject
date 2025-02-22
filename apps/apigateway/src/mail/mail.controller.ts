import {
  Controller,
  Get,
  Param,
  Redirect,
  Res,
  UseFilters,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { AllExceptionFilter } from '../tools/exeption/exeption.filter';

@Controller('link')
@UseFilters(new AllExceptionFilter())
export class MailController {
  constructor(private readonly mailserviceService: MailService) {}

  @Get(':link')
  @Redirect('http://localhost:4200')
  async checkMail(@Param('link') link: string) {
    const result = await this.mailserviceService.checkMail(link);
    return { url: 'http://localhost:4200' };
  }
}
