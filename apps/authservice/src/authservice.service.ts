import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthserviceService {
  getHello(): string {
    return 'Hello World!';
  }
}
