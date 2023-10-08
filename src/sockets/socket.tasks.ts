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

    for (const socketEvent of JSON.parse(
      socketEventsInfo,
    )) {
      let socketMessageData = null;

      switch (socketEvent.event) {
        case avialiableWebSocketEvents.userInfo: {
          socketMessageData =
            dataForSend &&
            +socketEvent.data.userId ===
              dataForSend.id
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

      if (socketMessageData) {
        const exactUserId =
          socketEvent.event ===
          avialiableWebSocketEvents.userNewBookmark
            ? true
            : false;
        this._socketsGateway.sendMessage(
          socketEvent.event,
          socketMessageData,
          socketEvent.data.clientId,
          exactUserId,
        );
      }
    }
  }
}
