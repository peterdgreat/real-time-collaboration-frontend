declare module '@rails/actioncable' {
  export function createConsumer(url: string): Cable;

  export interface Cable {
    subscriptions: {
      create(channel: object, options: { received: (data: any) => void }): Channel;
      remove(channel: Channel): void;
    };
  }

  export interface Channel {
    received(data: any): void;
  }
}
