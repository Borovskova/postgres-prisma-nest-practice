import {
  ITClientData,
  ITUserSubscribePermission,
} from './sockets.interface';

export function getUserPermitionToSubscribeInfo(
  connectedClientData: ITClientData | undefined,
  incomeSubscriberUserId: number,
): ITUserSubscribePermission {
  switch (true) {
    case !connectedClientData: {
      return {
        message: 'Client is not connected',
        isPermited: false,
      };
    }
    case connectedClientData.userId === null: {
      return {
        message: 'Unauthorized',
        isPermited: false,
      };
    }
    case connectedClientData.userId !==
      incomeSubscriberUserId: {
      return {
        message:
          'You can subscribe only for your own data',
        isPermited: false,
      };
    }
    default: {
      return {
        message: null,
        isPermited: true,
      };
    }
  }
}

export function generateUniqueId(): string {
  const randomPart = Math.floor(
    Math.random() * 100000,
  )
    .toString()
    .padStart(5, '0');
  const timestamp = new Date().getTime();
  const uniqueId = `${timestamp}${randomPart}`;

  return uniqueId;
}
