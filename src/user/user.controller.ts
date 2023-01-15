import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import EditUserDto from './dto/edit-user.dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  // Use the jwt passport auth strategy to protect this route
  @Get('/me')
  getMe(@GetUser() user: User, @GetUser('email') email: string) {
    console.log({
      email,
    });
    return user;
  }

  @Patch()
  editUser(@GetUser('id') userId: number, @Body() userDto: EditUserDto) {
    return this.userService.editUser(userId, userDto);
  }
}
