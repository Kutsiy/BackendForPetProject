import { Controller, Get } from '@nestjs/common';

@Controller()
export class PostserviceController {
  @Get()
  getHello() {
    return 2;
  }
}
