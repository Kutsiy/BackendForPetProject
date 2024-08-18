import { Controller, Get } from '@nestjs/common';
import { PostserviceService } from './postservice.service';

@Controller()
export class PostserviceController {
  constructor(private readonly postserviceService: PostserviceService) {}

  @Get()
  getHello(): string {
    return this.postserviceService.getHello();
  }
}
