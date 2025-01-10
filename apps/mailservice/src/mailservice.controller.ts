import { Controller, Get } from '@nestjs/common';
import { MailserviceService } from './mailservice.service';

@Controller()
export class MailserviceController {
  constructor(private readonly mailserviceService: MailserviceService) {}

  @Get()
  getHello(): string {
    return this.mailserviceService.getHello();
  }
}
