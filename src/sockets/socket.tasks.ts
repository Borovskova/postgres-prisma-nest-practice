import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { Cache } from 'cache-manager';

import { SocketsGateway } from './sockets.gateway';
import {
  avialiableWebSocketEvents,
  currentSocketsEventInfo,
} from 'src/constants/socket.events';

@Injectable()
export class SocketTasks {
  constructor(
    private _socketsGateway: SocketsGateway,
    @Inject(CACHE_MANAGER)
    private readonly _cacheManager: Cache,
  ) {}

  public async sendMessageForSubscribers(
    event: avialiableWebSocketEvents,
    dataForSend?: any,
  ): Promise<void> {
    const socketEventsInfo: string =
      await this._cacheManager.get(
        currentSocketsEventInfo,
      );

    if (
      !socketEventsInfo ||
      socketEventsInfo === undefined
    )
      return;

    let socketMessageData = null;
    let clientId: string | null = null;

    for (const socketEvent of JSON.parse(
      socketEventsInfo,
    )) {
      if (event === socketEvent.event) {
        clientId = socketEvent.data.clientId;

        switch (socketEvent.event) {
          case avialiableWebSocketEvents.userInfo: {
            socketMessageData = dataForSend
              ? dataForSend
              : null;
            break;
          }
          case avialiableWebSocketEvents.userNewBookmark: {
            socketMessageData =
              dataForSend &&
              +socketEvent.data.userId ===
                dataForSend.userId
                ? dataForSend
                : null;
            break;
          }

          default:
            return;
        }
      }
    }
    if (socketMessageData) {
      const exactUserId =
        event ===
        avialiableWebSocketEvents.userNewBookmark
          ? true
          : false;
      this._socketsGateway.sendMessage(
        event,
        socketMessageData,
        clientId,
        exactUserId,
      );
    }
  }
}
