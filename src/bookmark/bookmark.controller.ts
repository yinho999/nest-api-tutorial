import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { BookmarkService } from './bookmark.service';
import CreateBookmarkDto from './dto/create-bookmark.dto';
import EditBookmarkDto from './dto/edit-bookmark.dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}
  @Get()
  async getBookmarks(@GetUser('id') userId: number) {
    return await this.bookmarkService.getBookmarks(userId);
  }

  @Get(':id')
  async getBookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return await this.bookmarkService.getBookmark(userId, bookmarkId);
  }

  @Post()
  async createBookmark(
    @GetUser('id') userId: number,
    @Body() bookmarkDto: CreateBookmarkDto,
  ) {
    return await this.bookmarkService.createBookmark(userId, bookmarkDto);
  }

  @Patch(':id')
  async editBookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() bookmarkDto: EditBookmarkDto,
  ) {
    return await this.bookmarkService.editBookmark(
      userId,
      bookmarkId,
      bookmarkDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return await this.bookmarkService.deleteBookmark(userId, bookmarkId);
  }
}
