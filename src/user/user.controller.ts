import {
  Controller,
  Get,
  Patch,
  Delete,
  UseGuards,
  Request,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateUserDto } from './dto/update-user-dto';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private _usersService: UserService,
  ) {}

  @Get('me')
  public async getUser(
    @Request() req,
  ): Promise<User> {
    return this._usersService.getUserInfo(
      req.user.id,
    );
  }

  @Patch(':userId')
  public async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('userId') userId: string,
    @Request() req,
  ): Promise<User> {
    if (+userId !== req.user.id)
      throw new HttpException(
        'You can edit only your own profile',
        HttpStatus.BAD_REQUEST,
      );

    return this._usersService.updateUserInfo(
      +userId,
      updateUserDto,
    );
  }

  @Delete('delete/:userId')
  public async deleteUser(
    @Param('userId') userId: string,
    @Request() req,
  ): Promise<any> {
    if (+userId !== req.user.id)
      throw new HttpException(
        'You can remove only your own profile',
        HttpStatus.BAD_REQUEST,
      );
    return this._usersService.deleteUser(+userId);
  }
}
