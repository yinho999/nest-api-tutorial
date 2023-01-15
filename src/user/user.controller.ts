import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  // Use the jwt passport auth strategy to protect this route
  @Get('/me')
  getMe(@GetUser() user: User, @GetUser('email') email: string) {
    console.log({
      email,
    });
    return user;
  }

  @Patch()
  editUser(@GetUser() user: User) {
    return user;
  }
}
