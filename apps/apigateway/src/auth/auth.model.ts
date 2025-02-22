import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import {
  LoginArgs as Login,
  SignUpArgs as SignUp,
} from '@app/common/types/protos/auth';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@ArgsType()
export class LoginArgs implements Login {
  @Field(() => String)
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

@ArgsType()
export class SignUpArgs implements SignUp {
  @Field(() => String)
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @Field(() => String)
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

@ObjectType()
export class Tokens {
  @Field(() => String, { nullable: true })
  accessToken: string;

  @Field(() => String, { nullable: true })
  refreshToken: string;
}

@ObjectType()
export class User {
  @Field(() => String)
  id: string;

  @Field(() => String)
  email: string;
}

@ObjectType()
export class AuthReturn {
  @Field(() => Tokens)
  tokens: Tokens;

  @Field(() => User)
  user: User;
}


@ObjectType()
export class RefreshReturn {
  @Field(() => Tokens)
  tokens: Tokens;

  @Field(() => User)
  user: User;
}