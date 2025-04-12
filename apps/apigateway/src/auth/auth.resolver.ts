import { Resolver, Query, Args, Context, Mutation } from '@nestjs/graphql';
import {
  AuthReturn,
  LoginArgs,
  RefreshReturn,
  SendMailResult,
  SignUpArgs,
  Tokens,
  UploadAvatarReturn,
  User,
  UserInfo,
} from './auth.model';
import { AuthService } from './auth.service';
import { UseFilters, UseGuards } from '@nestjs/common';
import { AllExceptionFilter } from '../tools/exeption/exeption.filter';
import { Response, Request } from 'express';
import { AuthGuard } from '../tools/guards/auth/auth.guard';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { join } from 'path';
import { createWriteStream } from 'fs';

@Resolver(() => Tokens)
@UseFilters(new AllExceptionFilter())
export class AuthResolver {
  constructor(private authService: AuthService) {}

  private setCookies(res: Response, tokens: Tokens) {
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 20 * 60 * 1000,
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  @Query(() => AuthReturn)
  async Login(
    @Args() args: LoginArgs,
    @Context() context: { res: Response },
  ): Promise<AuthReturn> {
    const { res } = context;
    const result = await this.authService.login(args);
    const { tokens, user } = await result.toPromise();
    this.setCookies(res, tokens);

    return { tokens, user };
  }
  @Query(() => Tokens)
  LogOut(@Context() context: { res: Response }): Tokens {
    const { res } = context;
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return {
      accessToken: 'a',
      refreshToken: 'a',
    };
  }
  @Query(() => AuthReturn)
  async SignUp(
    @Args() args: SignUpArgs,
    @Context() context: { res: Response },
  ): Promise<AuthReturn> {
    const { res } = context;
    const result = await this.authService.signUp(args);
    const { tokens, user } = await result.toPromise();
    this.setCookies(res, tokens);

    return { tokens, user };
  }

  @Mutation(() => RefreshReturn)
  async Refresh(
    @Context() context: { res: Response; req: Request },
  ): Promise<RefreshReturn> {
    const { res, req } = context;
    const result = await this.authService.refresh({
      refreshToken: req.cookies?.refresh_token,
    });
    const { tokens, user } = await result.toPromise();
    this.setCookies(res, tokens);
    return { tokens, user };
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async GetUser(@Context() context: { req: Request }): Promise<User> {
    const { req } = context;
    const result = await this.authService.getUser({
      refreshToken: req.cookies?.refresh_token,
    });
    const { id, email, isActivated, avatarLink } = await result.toPromise();
    return { id, email, isActivated, avatarLink };
  }

  @Query(() => UserInfo)
  @UseGuards(AuthGuard)
  async GetAllInfoAboutUser(@Context() context: { req: Request }) {
    const { req } = context;

    const result = await this.authService.getAllInfoAboutUser({
      refreshToken: req.cookies?.refresh_token,
    });

    const { name, email, roles } = await result.toPromise();

    return { name, email, roles };
  }

  @Mutation(() => UploadAvatarReturn)
  async uploadAvatar(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename }: FileUpload,
    @Context() context: { req: Request },
  ) {
    const { req } = context;
    const refreshToken = req.cookies?.refresh_token;
    const filePath = join(process.cwd(), 'uploads/avatars', filename);
    await new Promise((resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(filePath))
        .on('finish', resolve)
        .on('error', reject),
    );
    const avatarUrl = `/uploads/avatars/${filename}`;

    const result = await this.authService.uploadAvatar({
      refreshToken,
      avatarLink: avatarUrl,
    });

    const { avatarLink } = await result.toPromise();

    return { avatarLink: avatarLink };
  }

  @Query(() => SendMailResult)
  @UseGuards(AuthGuard)
  async SendMail(@Context() context: { req: Request }) {
    const { req } = context;
    const result = await this.authService.sendMail({
      refreshToken: req.cookies?.refresh_token,
    });
    const mailResult = await result.toPromise();
    return mailResult;
  }
}
