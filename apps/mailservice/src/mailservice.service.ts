import { Injectable } from '@nestjs/common';

@Injectable()
export class MailserviceService {
  getHello(): string {
    return 'Hello World!';
  }
}
