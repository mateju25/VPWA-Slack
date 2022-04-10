// here we are declaring our MessageRepository types for Repositories/MessageRepository
// container binding. See providers/AppProvider.ts for how we are binding the implementation
import Message from 'App/Models/Message';

// @ts-ignore
declare module '@ioc:Repositories/MessageRepository' {
  export interface MessageRepositoryContract {
    getAll(channelName: string): Promise<Message[]>;
    create(channelName: string, userId: number, content: string): Promise<Message>;
  }

  const MessageRepository: MessageRepositoryContract;
  export default MessageRepository;
}
