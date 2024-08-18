import { Injectable } from '@nestjs/common';

@Injectable()
export class PostserviceService {
  getHello(): string {
    return 'Hello World 3001!';
  }
}
