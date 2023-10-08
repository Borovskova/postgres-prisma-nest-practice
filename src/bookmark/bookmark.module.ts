import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { UserModule } from 'src/user/user.module';
import { SocketsModule } from 'src/sockets/sockets.module';

@Module({
  imports:[UserModule, SocketsModule],
  providers: [BookmarkService],
  controllers: [BookmarkController]
})
export class BookmarkModule {}
