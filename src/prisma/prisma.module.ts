import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global() decorator makes the PrismaService available to all modules
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
  imports: [],
})
export class PrismaModule {}
