import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Server, WebSocket } from 'ws';

import { Cache } from 'cache-manager';

import {
  ITClientData,
  ITDefaultSocketResponse,
  ITUserSubscribePermission,
} from './sockets.interface';
import {
  avialiableWebSocketEvents,
  currentSocketsEventInfo,
} from 'src/constants/socket.events';
import { jwtConstants } from 'src/auth/constants/jwt-secret';
import {
  generateUniqueId,
  getUserPermitionToSubscribeInfo,
} from './socket.helper';

@WebSocketGateway(8080)
export class SocketsGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect
{
  private clients: Array<ITClientData> = [];

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(
    avialiableWebSocketEvents.userBookmarks,
  )
  async onUserBookmarksListSubscribeEvent(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() data: any,
  ): Promise<void> {
    data.event =
      avialiableWebSocketEvents.userBookmarks;

    await this.handleSubscribeMessageEvent(
      data,
      client,
    );
  }

  @SubscribeMessage(
    avialiableWebSocketEvents.userBookmarksUnsubscribe,
  )
  async onUserBookmarksListUnsubscribeEvent(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() data: any,
  ): Promise<void> {
    data.event =
      avialiableWebSocketEvents.userBookmarksUnsubscribe;

    await this.handleUnsubscribeMessageEvent(
      data,
      client,
    );
  }

  @SubscribeMessage(
    avialiableWebSocketEvents.userNewBookmark,
  )
  async onUserNewBookmarkSubscribeEvent(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() data: any,
  ): Promise<void> {
    data.event =
      avialiableWebSocketEvents.userNewBookmark;
    await this.handleSubscribeMessageEvent(
      data,
      client,
    );
  }

  @SubscribeMessage(
    avialiableWebSocketEvents.userNewBookmarkUnsubscribe,
  )
  async onUserNewBookmarkUnSubscribeEvent(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() data: any,
  ): Promise<void> {
    data.event =
      avialiableWebSocketEvents.userNewBookmarkUnsubscribe;

    await this.handleUnsubscribeMessageEvent(
      data,
      client,
    );
  }

  @SubscribeMessage(
    avialiableWebSocketEvents.userInfo,
  )
  async onUserInfoSubscribeEvent(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() data: any,
  ): Promise<void> {
    data.event =
      avialiableWebSocketEvents.userInfo;
    await this.handleSubscribeMessageEvent(
      data,
      client,
    );
  }

  @SubscribeMessage(
    avialiableWebSocketEvents.userInfoUnsubscribe,
  )
  async onUserInfoUnubscribeEvent(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() data: any,
  ): Promise<void> {
    data.event =
      avialiableWebSocketEvents.userInfoUnsubscribe;
    await this.handleUnsubscribeMessageEvent(
      data,
      client,
    );
  }

  public async sendMessage(
    event: string,
    data: any,
    clientId: string | null,
    exactUserId: boolean = false,
  ): Promise<void> {
    this.clients.forEach(async (item) => {
      if (
        item.client.readyState ===
          item.client.OPEN &&
        item.clientId === clientId
      ) {
        if (!exactUserId) {
          item.client.send(
            JSON.stringify({ event, data }),
          );
        } else {
          if (+item.userId === data.userId) {
            item.client.send(
              JSON.stringify({ event, data }),
            );
          }
        }
      } else {
        this.cacheManager.del(
          currentSocketsEventInfo,
        );
        return;
      }
    });
  }

  public handleDisconnect(client: WebSocket) {
    console.log('disconnected');
  }

  public async handleConnection(
    client: WebSocket,
    request: Request,
  ) {
    const token =
      request.headers['authorization'];

    if (!token || token === undefined) {
      this.clients.push({
        client: client,
        userId: null,
        clientId: null,
      });
    } else {
      try {
        const userData =
          await this.jwtService.verifyAsync(
            token.split(' ')[1],
            {
              secret: jwtConstants.secret,
            },
          );

        this.clients.push({
          client: client,
          userId: userData.id,
          clientId: null,
        });
      } catch {
        client.close(
          4000,
          'Authorization token error',
        );

        return;
      }
    }
  }

  public async handleUnsubscribeMessageEvent(
    data: any,
    client: WebSocket,
  ): Promise<void> {
    const currentSocketsEventInfoFromCache: any =
      await this.cacheManager.get(
        currentSocketsEventInfo,
      );

    if (
      !currentSocketsEventInfoFromCache ||
      currentSocketsEventInfoFromCache ===
        undefined
    )
      return;

    const subscribeEventInCacheIdx = JSON.parse(
      currentSocketsEventInfoFromCache,
    ).findIndex(
      (item) =>
        data.event.indexOf(item.event) !== -1,
    );
    if (subscribeEventInCacheIdx !== -1) {
      JSON.parse(
        currentSocketsEventInfoFromCache,
      ).splice(subscribeEventInCacheIdx, 1);
      await this.cacheManager.set(
        currentSocketsEventInfo,
        JSON.stringify(
          currentSocketsEventInfoFromCache,
        ),
        100000,
      );
      const clientForRemoveIdx =
        this.clients.findIndex(
          (item) => item.client === client,
        );
      clientForRemoveIdx !== -1
        ? this.clients.splice(
            clientForRemoveIdx,
            1,
          )
        : null;
    }
  }

  public async handleSubscribeMessageEvent(
    data: any,
    client: WebSocket,
  ): Promise<void> {
    let findUserInSubscribersArray =
      this.clients.find(
        (item) => item.client === client,
      );
    if (!findUserInSubscribersArray) {
      client.close(
        4000,
        'Client is not connected',
      );

      return;
    }

    if (
      data.event ===
      avialiableWebSocketEvents.userNewBookmark
    ) {
      const userPermissionInfo: ITUserSubscribePermission =
        getUserPermitionToSubscribeInfo(
          findUserInSubscribersArray,
          +data.userId,
        );

      if (!userPermissionInfo.isPermited) {
        client.close(
          4000,
          userPermissionInfo.message,
        );

        return;
      }
    }
    findUserInSubscribersArray.clientId =
      generateUniqueId();
    data.clientId =
      findUserInSubscribersArray.clientId;

    const socketEventInfo: ITDefaultSocketResponse =
      {
        event: data.event,
        data,
      };

    const currentSocketsEventInfoFromCache: any =
      await this.cacheManager.get(
        currentSocketsEventInfo,
      );
    let currentSocketsEventInfoArray: Array<ITDefaultSocketResponse> =
      [];

    if (
      currentSocketsEventInfoFromCache !==
      undefined
    ) {
      currentSocketsEventInfoArray = [
        ...JSON.parse(
          currentSocketsEventInfoFromCache,
        ),
      ];
      currentSocketsEventInfoArray.push(
        socketEventInfo,
      );
    } else {
      currentSocketsEventInfoArray.push(
        socketEventInfo,
      );
    }
    await this.cacheManager.set(
      currentSocketsEventInfo,
      JSON.stringify(
        currentSocketsEventInfoArray,
      ),
      100000,
    );

    return;
  }
}
