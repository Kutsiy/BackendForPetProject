import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CommentPost,
  CommentPostPostDocumentType,
  User,
  UserDocumentType,
  UserRatePost,
  UserRatePostDocumentType,
  UserRole,
  UserRoleDocumentType,
  UserViewPost,
  UserViewPostDocumentType,
} from '@app/common';
import { Model, Types } from 'mongoose';
import {
  AuthReturns,
  DeleteAccountArgs,
  DeleteAccountReturn,
  LoginArgs,
  SendMailArgs,
  SendMailReturn,
  SignUpArgs,
} from '@app/common/types/protos/auth';
import { RpcException } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import { Payload, TokenService } from './token.service';
import { MailService } from './mail/mail.service';
import { RoleService } from './role.service';
import { join } from 'path';
import { Post, PostDocumentType } from '@app/common/schemas/post.schema';
const fs = require('fs');

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocumentType>,
    @InjectModel(UserRole.name)
    private readonly userRoleModel: Model<UserRoleDocumentType>,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly roleService: RoleService,
    @InjectModel(UserRatePost.name, 'postConnection')
    private readonly postRateModel: Model<UserRatePostDocumentType>,
    @InjectModel(UserViewPost.name, 'postConnection')
    private readonly postViewModel: Model<UserViewPostDocumentType>,
    @InjectModel(CommentPost.name, 'postConnection')
    private readonly commentModel: Model<CommentPostPostDocumentType>,
    @InjectModel(Post.name, 'postConnection')
    private readonly postModel: Model<PostDocumentType>,
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
        avatarLink: coincidence.avatarLink,
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
    const hashPassword = await hash(args.password, 10);
    const roleId = await this.roleService.getRoleIdByName('USER');

    const link = uuidv4();
    const user = await this.userModel.create({
      name: args.name,
      email: args.email,
      password: hashPassword,
      linkForActivate: link,
      avatarLink: '',
      isActivated: false,
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
        avatarLink: user.avatarLink,
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
      const user = await this.userModel.findOne({ email }).exec();
      return {
        id,
        email,
        isActivated: user.isActivated,
        avatarLink: user.avatarLink,
      };
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

  async uploadAvatar(refreshToken: string, avatarLink: string) {
    try {
      const { email }: Payload =
        await this.tokenService.getUserByToken(refreshToken);

      const user = await this.userModel.findOne({ email }).exec();

      if (user.avatarLink !== '' && user.avatarLink) {
        const oldAvatarPath = join(process.cwd(), user.avatarLink);
        try {
          await fs.access(oldAvatarPath, () => {});
          await fs.unlink(oldAvatarPath, () => {});
        } catch (err) {
          console.error('Error', err);
        }
      }

      await this.userModel.findOneAndUpdate(
        { email },
        { $set: { avatarLink } },
      );
    } catch (error) {
      console.log(error);
    }
  }

  async sendMail(args: SendMailArgs): Promise<SendMailReturn> {
    try {
      const { refreshToken } = args;
      const { email }: Payload =
        await this.tokenService.getUserByToken(refreshToken);
      const user = await this.userModel.findOne({ email }).exec();
      await this.mailService.sendMail({
        link: user.linkForActivate,
        mail: email,
      });
      return { result: 'Mail Send' };
    } catch (e) {
      console.log(e);
    }
  }

  async deleteAccount(args: DeleteAccountArgs): Promise<DeleteAccountReturn> {
    const { refreshToken } = args;
    try {
      const { id }: Payload =
        await this.tokenService.getUserByToken(refreshToken);
      const userId = new Types.ObjectId(id);

      const user = await this.userModel.findOne({ _id: userId }).exec();
      if (!user) {
        throw new RpcException('User not found');
      }

      if (user.avatarLink !== '' && user.avatarLink) {
        const avatarPath = join(process.cwd(), user.avatarLink);
        try {
          await fs.access(avatarPath, () => {});
          await fs.unlink(avatarPath, () => {});
        } catch (err) {
          console.error('Error', err);
        }
      }

      const { deletedCount } = await this.userModel.deleteOne({ _id: userId });
      if (!deletedCount) {
        throw new RpcException('User not deleted');
      }

      await Promise.all([
        this.userRoleModel.deleteMany({ userId }),
        this.postModel.deleteMany({ authorId: userId }),
        this.commentModel.deleteMany({ authorId: userId }),
        this.postRateModel.deleteMany({ userId }),
        this.postViewModel.deleteMany({ userId }),
        this.tokenService.deleteUserToken(userId),
      ]);
    } catch (e) {
      throw new RpcException(e.message || 'Error with delete');
    }
    return { result: 'Account has been deleted' };
  }
}
