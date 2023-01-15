import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }
}
