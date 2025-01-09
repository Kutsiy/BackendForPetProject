import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  LoginArgs,
  SignUpArgs,
} from '@app/common/types/protos/auth';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: AuthServiceClient;
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientGrpc) {}
  onModuleInit() {
    this.authService =
      this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  async login(args: LoginArgs): Promise<any> {
    return await this.authService.login(args);
  }

  async signUp(args: SignUpArgs) {
    return await this.authService.signUp(args);
  }
}
