import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthServiceController,
  LoginArgs,
  SignUpArgs,
  AuthServiceControllerMethods,
  EmptyAuth,
  AuthReturns,
  RefreshArgs,
  Tokens,
} from '@app/common/types/protos/auth';
import { Observable } from 'rxjs';

@Controller()
@AuthServiceControllerMethods()
export class AuthserviceController implements AuthServiceController {
  constructor(private authService: AuthService) {}
  async refresh(request: RefreshArgs): Promise<Tokens> {
    const { refreshToken } = request;
    return await this.authService.refresh(refreshToken);
  }
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
