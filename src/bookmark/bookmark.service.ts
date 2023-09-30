import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateBookmarkDto } from './dto/new-bookmark-dto';

@Injectable()
export class BookmarkService {
    constructor( private _prismaService: PrismaService, private _userService:UserService){}

    public async getUserBookmarksList(userId:number):Promise<any>{
        return this._prismaService.bookmark.findMany({
            where: {
              userId: userId
            },
          });
    }

    public async createNewBookmark(userId: number, dto: CreateBookmarkDto):Promise<any>{
      const bookmark = await this._prismaService.bookmark.create({
        data: {
          userId,
          ...dto,
        },
      });

      return bookmark
      }
}
