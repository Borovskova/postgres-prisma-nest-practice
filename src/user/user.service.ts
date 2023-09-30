import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '@prisma/client';

import { compareHash, getHash } from 'src/auth/constants/bcrypt';
import { LoginUserDto } from 'src/auth/dto/login-user-dto';
import { RegisterUserDto } from 'src/auth/dto/register-user-dto';
import { ITAuthResponse } from 'src/auth/interfaces/auth.interface';

import { PrismaService } from 'src/prisma/prisma.service';

export const PasswordSaltLength = 4;

@Injectable()
export class UserService {
  constructor(
    private _prismaService: PrismaService,
    private _jwtService: JwtService,
  ) {}

  public async createUser(createUserDto: RegisterUserDto): Promise<ITAuthResponse> {
    const findUser = await this._prismaService.user.findFirst({
      where: {
        email: createUserDto.email,
      },
    });
    if (findUser) {
      throw new HttpException(
        'This email already in use!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const userDataParsed = {
      ...createUserDto,
    };
    userDataParsed.password = await getHash(
      createUserDto.password,
      PasswordSaltLength,
    );
    const user = await this._prismaService.user.create({
      data: {
        ...userDataParsed,
      },
    });

    return await this._signToken(user);
  }

  public async getUserInfo(userId: string): Promise<User> {
    const user = await this.findUser({ id: userId });

    return user;
  }

  public async findOne(loginUserDto: LoginUserDto): Promise<ITAuthResponse> {
    const user = await this.findUser({ email: loginUserDto.email });

    if (await compareHash(loginUserDto.password, user.password as string))
      return await this._signToken(user);
    throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
  }

  public async findUser(findWhere: any): Promise<User | any> {
    const user = await this._prismaService.user.findFirst({
      where: {
        ...findWhere,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    } else {
      return user;
    }
  }

  private async _signToken(user: User): Promise<ITAuthResponse> {
    const payload = {
      id: user.id,
      username: user.firstName,
      useremail: user.email,
    };
    return {
      token: await this._jwtService.signAsync(payload),
    };
  }
}
