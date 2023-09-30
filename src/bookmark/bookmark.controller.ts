import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/new-bookmark-dto';

@UseGuards(AuthGuard)
@Controller('bookmark')
export class BookmarkController {

    constructor(private _bookmarkService:BookmarkService){}

    @Get('list')
   public async getUserBookmarksList(@Request() req):Promise<any>{
    return await this._bookmarkService.getUserBookmarksList(req.user.id)
    }

    @Post('create')
   public async createNewBookmark(@Body() createBookmarkDto: CreateBookmarkDto, @Request() req):Promise<any>{
    return await this._bookmarkService.createNewBookmark(req.user.id, createBookmarkDto)
    }
}
