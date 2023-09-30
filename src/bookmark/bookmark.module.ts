import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[UserModule],
  providers: [BookmarkService],
  controllers: [BookmarkController]
})
export class BookmarkModule {}
