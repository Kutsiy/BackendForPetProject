import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthServiceController,
  LoginArgs,
  SignUpArgs,
  Tokens,
  AuthServiceControllerMethods,
  EmptyAuth,
} from '@app/common/types/protos/auth';
import { Observable } from 'rxjs';

@Controller()
@AuthServiceControllerMethods()
export class AuthserviceController implements AuthServiceController {
  constructor(private authService: AuthService) {}
  async login(request: LoginArgs): Promise<Tokens> {
    return await this.authService.login(request);
  }
  async signUp(request: SignUpArgs): Promise<Tokens> {
    return await this.authService.signUp(request);
  }
  logOut(
    request: EmptyAuth,
  ): Promise<EmptyAuth> | Observable<EmptyAuth> | EmptyAuth {
    throw new Error('Method not implemented.');
  }
}
