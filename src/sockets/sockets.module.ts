import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { SocketsGateway } from './sockets.gateway';
import { SocketTasks } from './socket.tasks';

@Module({
  imports: [CacheModule.register()],
  providers: [SocketsGateway, SocketTasks],
  exports:[SocketTasks]
})
export class SocketsModule {}