import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateBookmarkDto from './dto/create-bookmark.dto';
import EditBookmarkDto from './dto/edit-bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(private prismaService: PrismaService) {}
  async getBookmarks(userId: number) {
    return await this.prismaService.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  async getBookmark(userId: number, bookmarkId: number) {
    return await this.prismaService.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  async createBookmark(userId: number, bookmarkDto: CreateBookmarkDto) {
    return await this.prismaService.bookmark.create({
      data: {
        ...bookmarkDto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async editBookmark(
    userId: number,
    bookmarkId: number,
    bookmarkDto: EditBookmarkDto,
  ) {
    // Get the bookmark by id
    const bookmark = await this.prismaService.bookmark.findFirst({
      where: {
        id: bookmarkId,
      },
    });
    // If the bookmark doesn't exist, throw an error
    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }
    // Check if the bookmark belongs to the user
    // If it doesn't, throw an error
    if (bookmark.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to edit this bookmark',
      );
    }
    // If it does, update the bookmark
    return await this.prismaService.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...bookmarkDto,
      },
    });
  }

  async deleteBookmark(userId: number, bookmarkId: number) {
    // Get the bookmark by id
    const bookmark = await this.prismaService.bookmark.findFirst({
      where: {
        id: bookmarkId,
      },
    });
    // If the bookmark doesn't exist, throw an error
    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }
    // Check if the bookmark belongs to the user
    // If it doesn't, throw an error
    if (bookmark.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this bookmark',
      );
    }
    // If it does, delete the bookmark
    await this.prismaService.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
