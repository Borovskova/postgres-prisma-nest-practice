import { Body, Controller, Post } from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/register-user-dto';
import { LoginUserDto } from './dto/login-user-dto';
import { ITAuthResponse } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private _userService:UserService) {}

  @Post('signup')
  public async signup(@Body() createUserDto: RegisterUserDto): Promise<ITAuthResponse> {
    const token = await this._userService.createUser(createUserDto);
    return token;
  }

  @Post('signin')
  public async signin(@Body() loginUserDto: LoginUserDto): Promise<ITAuthResponse> {
    const token = await this._userService.findOne(loginUserDto);
    
    return token;
  }
}
