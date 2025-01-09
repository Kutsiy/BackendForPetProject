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
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;
}
