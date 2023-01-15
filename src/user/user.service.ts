import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import EditUserDto from './dto/edit-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}
  async editUser(userId: number, userDto: EditUserDto) {
    const user = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        ...userDto,
      },
    });
    return await this.authService.signToken(user.id, user.email);
  }
}
