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
  RefreshReturns,
  GetUserArgs,
  User,
  GetAllInfoAboutUserArgs,
  UserInfo,
  UploadAvatarArgs,
  UploadAvatarReturn,
} from '@app/common/types/protos/auth';
import { Observable } from 'rxjs';

@Controller()
@AuthServiceControllerMethods()
export class AuthserviceController implements AuthServiceController {
  constructor(private authService: AuthService) {}

  async getAllInfoAboutUser(
    request: GetAllInfoAboutUserArgs,
  ): Promise<UserInfo> {
    const { refreshToken } = request;
    return await this.authService.getAllInfoAboutUser(refreshToken);
  }

  async getUser(request: GetUserArgs): Promise<User> {
    const { refreshToken } = request;
    const { id, email, isActivated, avatarLink } =
      await this.authService.getUser(refreshToken);
    return { id: `${id}`, email, isActivated, avatarLink };
  }
  async refresh(request: RefreshArgs): Promise<RefreshReturns> {
    try {
      const { refreshToken: refreshTokenRequest } = request;
      const { accessToken, refreshToken, user } =
        await this.authService.refresh(refreshTokenRequest);
      return {
        tokens: { accessToken: accessToken, refreshToken: refreshToken },
        user,
      };
    } catch (error) {
      console.log(error, 'ERROR FROM CONTROLLER');
    }
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

  async uploadAvatar(request: UploadAvatarArgs): Promise<UploadAvatarReturn> {
    const { refreshToken, avatarLink } = request;
    await this.authService.uploadAvatar(refreshToken, avatarLink);
    return { avatarLink };
  }
}
