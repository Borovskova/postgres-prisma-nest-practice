import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  UseGuards,
  Request,
  Body,
  Delete,
} from '@nestjs/common';

import { Bookmark } from '@prisma/client';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { BookmarkService } from './bookmark.service';

import { CreateBookmarkDto } from './dto/new-bookmark-dto';
import { UpdateBookmarkDto } from './dto/update-bookmark-dto';
import { IDefaultResponse } from 'src/interfaces/default-request-response';

@UseGuards(AuthGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(
    private _bookmarkService: BookmarkService,
  ) {}

  @Post('create')
  public async createNewBookmark(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @Request() req,
  ): Promise<Bookmark> {
    return await this._bookmarkService.createNewBookmark(
      req.user.id,
      createBookmarkDto,
    );
  }

  @Get('list')
  public async getUserBookmarksList(
    @Request() req,
  ): Promise<Array<Bookmark>> {
    return await this._bookmarkService.getUserBookmarksList(
      req.user.id,
    );
  }

  @Get(':bookmarkId')
  public async getBookmarkById(
    @Param('bookmarkId') bookmarkId: string,
  ): Promise<Bookmark> {
    return await this._bookmarkService.getBookmarkById(
      +bookmarkId,
    );
  }

  @Patch('update/:bookmarkId')
  public async editBookmark(
    @Param('bookmarkId') bookmarkId: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
    @Request() req,
  ): Promise<Bookmark> {
    return await this._bookmarkService.editBookmark(
      +bookmarkId,
      updateBookmarkDto,
      req.user.id,
    );
  }

  @Delete('delete/:bookmarkId')
  public async deleteBookmark(
    @Param('bookmarkId') bookmarkId: string,
    @Request() req,
  ): Promise<any> {
    return await this._bookmarkService.deleteBookmark(
      +bookmarkId,
      req.user,
    );
  }
}
