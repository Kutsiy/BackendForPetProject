import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthServiceController,
  LoginArgs,
  SignUpArgs,
  AuthServiceControllerMethods,
  EmptyAuth,
  AuthReturns,
} from '@app/common/types/protos/auth';
import { Observable } from 'rxjs';

@Controller()
@AuthServiceControllerMethods()
export class AuthserviceController implements AuthServiceController {
  constructor(private authService: AuthService) {}
  async login(request: LoginArgs): Promise<AuthReturns> {
    return await this.authService.login(request);
  }
  async signUp(request: SignUpArgs): Promise<AuthReturns> {
    return await this.authService.signUp(request);
  }
  logOut(
    request: EmptyAuth,
  ): Promise<EmptyAuth> | Observable<EmptyAuth> | EmptyAuth {
    throw new Error('Method not implemented.');
  }
}
