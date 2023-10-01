import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { Bookmark } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateBookmarkDto } from './dto/new-bookmark-dto';
import { UpdateBookmarkDto } from './dto/update-bookmark-dto';
import { IDefaultResponse } from 'src/interfaces/default-request-response';

@Injectable()
export class BookmarkService {
  constructor(
    private _prismaService: PrismaService
  ) {}

  public async createNewBookmark(
    userId: number,
    dto: CreateBookmarkDto,
  ): Promise<Bookmark> {
    const bookmark = await this.findBookmark({
      title: dto.title,
      userId,
    });
    if (bookmark && bookmark.userId === userId)
      throw new HttpException(
        'User already have bookmark with this title',
        HttpStatus.BAD_REQUEST,
      );

    const newBookmark =
      await this._prismaService.bookmark.create({
        data: {
          userId,
          ...dto,
        },
      });

    return newBookmark;
  }

  public async getUserBookmarksList(
    userId: number,
  ): Promise<Array<Bookmark>> {
    return await this._prismaService.bookmark.findMany(
      {
        where: {
          userId: userId,
        },
      },
    );
  }

  public async getBookmarkById(
    id: number,
  ): Promise<Bookmark> {
    const bookmark =
      await this._prismaService.bookmark.findUnique(
        {
          where: {
            id,
          },
        },
      );
    if (!bookmark)
      throw new HttpException(
        "Bookmark doesn't exist",
        HttpStatus.BAD_REQUEST,
      );
    return bookmark;
  }

  public async editBookmark(
    id: number,
    updateBookmarkDto: UpdateBookmarkDto,
    userId: number,
  ): Promise<Bookmark> {
    const updatedBookmark =
      await this._prismaService.bookmark.update({
        where: {
          id,
        },
        data: {
          ...updateBookmarkDto,
        },
      });

    if (!updatedBookmark)
      throw new HttpException(
        "Bookmark doesn't exist",
        HttpStatus.BAD_REQUEST,
      );
    if (updatedBookmark.userId !== userId)
      throw new HttpException(
        'You can update only your own bookmarks',
        HttpStatus.BAD_REQUEST,
      );

    return updatedBookmark;
  }

  public async deleteBookmark(
    bookmarkId: number,
    user: any,
  ): Promise<IDefaultResponse | {}> {
    const deleteBookmark =
      await this._prismaService.bookmark.delete({
        where: {
          id: bookmarkId,
        },
      });
    if (!deleteBookmark)
      throw new HttpException(
        "Bookmark doesn't exist",
        HttpStatus.BAD_REQUEST,
      );
    if (deleteBookmark.userId !== user.id)
      throw new HttpException(
        'You can delete only your own bookmarks',
        HttpStatus.BAD_REQUEST,
      );

    return deleteBookmark
      ? {
          status: 'Success',
          message: `Bookmark with title '${deleteBookmark.title}' of user ${user.username} successfully deleted`,
        }
      : {};
  }

  private async findBookmark(
    filterQuery: any,
  ): Promise<Bookmark> {
    const bookmark =
      this._prismaService.bookmark.findFirst({
        where: {
          ...filterQuery,
        },
      });

    return bookmark;
  }
}
