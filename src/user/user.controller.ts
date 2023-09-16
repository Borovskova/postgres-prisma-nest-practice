import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { User } from '@prisma/client';

import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private _usersService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  public async getUser(@Request() req): Promise<User> {
    return this._usersService.getUserInfo(req.user.id);
  }
}
