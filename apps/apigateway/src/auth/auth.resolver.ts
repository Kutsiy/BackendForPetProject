import { Resolver, Query, Args, Context, Mutation } from '@nestjs/graphql';
import {
  AuthReturn,
  LoginArgs,
  RefreshReturn,
  SignUpArgs,
  Tokens,
  User,
  UserInfo,
} from './auth.model';
import { AuthService } from './auth.service';
import { UseFilters, UseGuards } from '@nestjs/common';
import { AllExceptionFilter } from '../tools/exeption/exeption.filter';
import { Response, Request } from 'express';
import { AuthGuard } from '../tools/guards/auth/auth.guard';

@Resolver(() => Tokens)
@UseFilters(new AllExceptionFilter())
export class AuthResolver {
  constructor(private authService: AuthService) {}

  private setCookies(res: Response, tokens: Tokens) {
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 15 * 60 * 1000,
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
    const { accessToken, refreshToken } = tokens;
    res.cookie('access_token', `${accessToken}`, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', `${refreshToken}`, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { tokens, user };
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async GetUser(@Context() context: { req: Request }): Promise<User> {
    const { req } = context;
    const result = await this.authService.getUser({
      refreshToken: req.cookies?.refresh_token,
    });
    const { id, email, isActivated } = await result.toPromise();
    return { id, email, isActivated };
  }

  @Query(() => UserInfo)
  @UseGuards(AuthGuard)
  async getAllInfoAboutUser(@Context() context: { req: Request }) {
    const { req } = context;

    const result = await this.authService.getAllInfoAboutUser({
      refreshToken: req.cookies?.refresh_token,
    });

    const { name, email, roles } = await result.toPromise();

    return { name, email, roles };
  }
}
