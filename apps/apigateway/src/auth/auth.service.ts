import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  GetAllInfoAboutUserArgs,
  GetUserArgs,
  LoginArgs,
  RefreshArgs,
  SendMailArgs,
  SignUpArgs,
  UploadAvatarArgs,
} from '@app/common/types/protos/auth';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: AuthServiceClient;
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientGrpc) {}
  onModuleInit() {
    this.authService =
      this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  async login(args: LoginArgs) {
    return await this.authService.login(args);
  }

  async signUp(args: SignUpArgs) {
    return await this.authService.signUp(args);
  }

  async refresh(args: RefreshArgs) {
    return await this.authService.refresh(args);
  }

  async getUser(args: GetUserArgs) {
    return await this.authService.getUser(args);
  }

  async getAllInfoAboutUser(args: GetAllInfoAboutUserArgs) {
    return await this.authService.getAllInfoAboutUser(args);
  }

  async uploadAvatar(args: UploadAvatarArgs) {
    return await this.authService.uploadAvatar(args);
  }

  async sendMail(args: SendMailArgs) {
    return await this.authService.sendMail(args);
  }
}
