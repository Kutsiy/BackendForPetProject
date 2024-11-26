import { Controller, Get } from '@nestjs/common';
import { AuthserviceService } from './authservice.service';

@Controller()
export class AuthserviceController {
  constructor(private readonly authserviceService: AuthserviceService) {}

  @Get()
  getHello(): string {
    return this.authserviceService.getHello();
  }
}
