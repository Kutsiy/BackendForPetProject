import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocumentType } from '@app/common';
import { Model } from 'mongoose';
import { LoginArgs, SignUpArgs, Tokens } from '@app/common/types/protos/auth';
import { RpcException } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import { TokenService } from './token.service';
import { MailService } from './mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocumentType>,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}
  async login(args: LoginArgs): Promise<Tokens> {
    const coincidence = await this.userModel
      .findOne({ email: args.email })
      .exec();
    if (!coincidence) {
      throw new RpcException('User not found!');
    }
    if (coincidence.isActivated) {
      throw new RpcException(
        'A user with this email already exists, but not activated',
      );
    }
    const isPasswordCorrect = await compare(
      args.password,
      coincidence.password,
    );
    if (!isPasswordCorrect) {
      throw new RpcException('Incorrect login or password');
    }
    const { accessToken, refreshToken } = this.tokenService.generateToken(args);
    await this.tokenService.saveRefreshToken(refreshToken, coincidence._id);
    return {
      accessToken,
      refreshToken,
    };
  }
  async logOut() {}
  async signUp(args: SignUpArgs): Promise<Tokens> {
    const coincidence = await this.userModel
      .findOne({ email: args.email })
      .exec();
    if (coincidence) {
      throw new RpcException('A user with this email already exists.');
    }
    const { accessToken, refreshToken } = this.tokenService.generateToken(args);
    const hashPassword = await hash(args.password, 10);

    const link = uuidv4();
    const user = await this.userModel.create({
      name: args.name,
      email: args.email,
      password: hashPassword,
      linkForActivate: link,
    });

    await this.tokenService.saveRefreshToken(refreshToken, user._id);

    await this.mailService.sendMail({ link, mail: args.email });
    return {
      accessToken,
      refreshToken,
    };
  }
}
