import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext';
import User from 'App/Models/User';
import Preference from 'App/Models/Preference';

export default class UserStateController {
  private getUserRoom(user: User): string {
    return `user:${user.id}`;
  }

  public async onConnected({ socket, auth }: WsContextContract) {
    // all connections for the same authenticated user will be in the room
    const room = this.getUserRoom(auth.user!);
    await socket.in(room).allSockets();

    // add this socket to user room
    socket.join(room);
    // add userId to data shared between Socket.IO servers
    // https://socket.io/docs/v4/server-api/#namespacefetchsockets
    socket.data.userId = auth.user!.id;
  }

  // see https://socket.io/get-started/private-messaging-part-2/#disconnection-handler
  public async onDisconnected({ socket, auth }: WsContextContract) {
    const room = this.getUserRoom(auth.user!);
    const userSockets = await socket.in(room).allSockets();

    // user is disconnected
    if (userSockets.size === 0) {
      // notify other users

      socket.nsp.emit('changedState', {
        stateName: 'Offline',
        user: auth.user,
      });
    }
  }

  public async changedState({ socket, auth }: WsContextContract, stateName: string) {
    const preference = await Preference.findBy('id', auth.user?.preference_id);
    preference?.$setAttribute('stateName', stateName);
    await preference?.save();

    socket.nsp.emit('changedState', {
      stateName: stateName,
      user: auth.user,
    });
  }
}
