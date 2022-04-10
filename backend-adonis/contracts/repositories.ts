// here we are declaring our MessageRepository types for Repositories/MessageRepository
// container binding. See providers/AppProvider.ts for how we are binding the implementation
import Message from 'App/Models/Message';
import Channel from 'App/Models/Channel';
import User from 'App/Models/User';

// @ts-ignore
declare module '@ioc:Repositories/MessageRepository' {
  export interface MessageRepositoryContract {
    getAll(channelName: string): Promise<Message[]>;
    create(channelName: string, userId: number, content: string): Promise<Message>;
  }

  const MessageRepository: MessageRepositoryContract;
  export default MessageRepository;
}

// @ts-ignore
declare module '@ioc:Repositories/ChannelRepository' {
  export interface ChannelRepositoryContract {
    findAll(user: User): Promise<Channel[]>;
    create(data: Object, user: User): Promise<Channel>;
    delete(channelId: number, user: User): Promise<Channel>;
  }

  const ChannelRepository: ChannelRepositoryContract;
  export default ChannelRepository;
}
