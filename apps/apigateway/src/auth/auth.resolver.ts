import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { LoginArgs, SignUpArgs, Tokens } from './auth.model';
import { AuthService } from './auth.service';
import { UseFilters, UseGuards } from '@nestjs/common';
import { AllExceptionFilter } from '../tools/exeption/exeption.filter';
import { Response } from 'express';
import { AuthGuard } from '../tools/guards/auth/auth.guard';

@Resolver(() => Tokens)
@UseFilters(new AllExceptionFilter())
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => Tokens)
  async Login(
    @Args() args: LoginArgs,
    @Context() context: { res: Response },
  ): Promise<Tokens> {
    const { res } = context;
    const result = await this.authService.login(args);
    const { accessToken, refreshToken } = await result.toPromise();
    res.cookie('access_token', `${accessToken}`, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', `${refreshToken}`, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken, refreshToken };
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
  @Query(() => Tokens)
  async SignUp(
    @Args() args: SignUpArgs,
    @Context() context: { res: Response },
  ): Promise<Tokens> {
    const { res } = context;
    const result = await this.authService.signUp(args);
    const { accessToken, refreshToken } = await result.toPromise();
    res.cookie('access_token', `${accessToken}`, {
      // httpOnly: true,
      sameSite: 'strict',
      // secure: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', `${refreshToken}`, {
      // httpOnly: true,
      sameSite: 'strict',
      // secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken, refreshToken };
  }
}
