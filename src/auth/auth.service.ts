import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signUp(authDto: AuthDto) {
    // generate the password hash
    const hash = await argon2.hash(authDto.password);

    try {
      // save the new user to the database
      const user = await this.prisma.user.create({
        data: {
          email: authDto.email,
          hash,
        },
      });
      delete user.hash;
      // return the user
      return user;
    } catch (error) {
      // if the email already exists, throw an error
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credential already in use');
        }
      }
      throw error;
    }
  }

  async signIn(authDto: AuthDto) {
    // find the user using email
    const user = await this.prisma.user.findUnique({
      where: {
        email: authDto.email,
      },
    });
    // if the user doesn't exist, throw an error
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // if the user exists, check the hash
    const isPwMatch = await argon2.verify(user.hash, authDto.password);
    // if the hash doesn't match, throw an error
    if (!isPwMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // send back user
    delete user.hash;
    return user;
  }
}