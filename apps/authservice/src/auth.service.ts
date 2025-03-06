import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocumentType,
  UserRole,
  UserRoleDocumentType,
} from '@app/common';
import { Model } from 'mongoose';
import {
  AuthReturns,
  LoginArgs,
  SignUpArgs,
} from '@app/common/types/protos/auth';
import { RpcException } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import { Payload, TokenService } from './token.service';
import { MailService } from './mail/mail.service';
import { RoleService } from './role.service';
import * as request from 'supertest';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocumentType>,
    @InjectModel(UserRole.name)
    private readonly userRoleModel: Model<UserRoleDocumentType>,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly roleService: RoleService,
  ) {}
  async login(args: LoginArgs): Promise<AuthReturns> {
    const coincidence = await this.userModel
      .findOne({ email: args.email })
      .populate('roles')
      .exec();
    if (!coincidence) {
      throw new RpcException('User not found!');
    }
    const isPasswordCorrect = await compare(
      args.password,
      coincidence.password,
    );
    if (!isPasswordCorrect) {
      throw new RpcException('Incorrect login or password');
    }

    const roles = coincidence.roles.map((ur: any) => ur.roleId.name);

    const { accessToken, refreshToken } = await this.tokenService.generateToken(
      {
        id: coincidence._id,
        email: coincidence.email,
        roles,
        isActivated: coincidence.isActivated,
      },
    );
    await this.tokenService.saveRefreshToken(refreshToken, coincidence._id);

    return {
      tokens: {
        accessToken,
        refreshToken,
      },
      user: {
        id: `${coincidence._id}`,
        email: coincidence.email,
        isActivated: coincidence.isActivated,
      },
    };
  }
  async logOut() {}

  async signUp(args: SignUpArgs): Promise<AuthReturns> {
    const coincidence = await this.userModel
      .findOne({ email: args.email })
      .exec();
    if (coincidence) {
      throw new RpcException('A user with this email already exists.');
    }
    // if (!coincidence.isActivated) {
    //   throw new RpcException(
    //     'A user with this email already exists, but not activated',
    //   );
    // }
    const hashPassword = await hash(args.password, 10);
    const roleId = await this.roleService.getRoleIdByName('USER');

    const link = uuidv4();
    const user = await this.userModel.create({
      name: args.name,
      email: args.email,
      password: hashPassword,
      linkForActivate: link,
    });
    await this.userRoleModel.create({ userId: user._id, roleId: roleId._id });
    const { accessToken, refreshToken } = await this.tokenService.generateToken(
      {
        id: user._id,
        email: user.email,
        roles: [roleId.name],
        isActivated: user.isActivated,
      },
    );
    await this.tokenService.saveRefreshToken(refreshToken, user._id);
    await this.mailService.sendMail({ link, mail: args.email });
    return {
      tokens: {
        accessToken,
        refreshToken,
      },
      user: {
        id: `${user._id}`,
        email: user.email,
        isActivated: user.isActivated,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      return await this.tokenService.refreshToken(refreshToken);
    } catch (err) {
      console.log(err, 'ERROR FROM AUTHSERVICE');
    }
  }

  async getUser(refreshToken: string) {
    try {
      const { id, email, isActivated }: Payload =
        await this.tokenService.getUserByToken(refreshToken);
      return { id, email, isActivated };
    } catch (error) {
      console.log(error);
    }
  }

  async getAllInfoAboutUser(refreshToken: string) {
    try {
      const { email }: Payload =
        await this.tokenService.getUserByToken(refreshToken);
      const user = await this.userModel
        .findOne({ email })
        .populate('roles')
        .exec();
      const roles = user.roles.map((ur: any) => ur.roleId.name);
      return { name: user.name, email: user.email, roles };
    } catch (error) {
      console.log(error);
    }
  }
}
