export interface ITDefaultSocketResponse {
    event: string;
    data: any;
  }
  
  export interface ITClientData {
    client: WebSocket;
    userId: string | number;
    clientId:string | null
  }

  export interface ITUserSubscribePermission {
    message:string | null;
    isPermited: boolean;
  }