import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import User from 'App/Models/User'

export default class ActivityController {
  private getUserRoom(user: User): string {
    return `user:${user.id}`
  }

  public async onConnected({ socket, auth, logger }: WsContextContract) {
    // all connections for the same authenticated user will be in the room
    const room = this.getUserRoom(auth.user!)
    const userSockets = await socket.in(room).allSockets()

    // this is first connection for given user
    if (userSockets.size === 0) {
      socket.nsp.emit('user:online', auth.user)
    }

    // add this socket to user room
    socket.join(room)
    // add userId to data shared between Socket.IO servers
    // https://socket.io/docs/v4/server-api/#namespacefetchsockets
    socket.data.userId = auth.user!.id

    logger.info('new websocket connection')
    console.log('new websocket connection: ', socket.id);
  }

  // see https://socket.io/get-started/private-messaging-part-2/#disconnection-handler
  public async onDisconnected({ socket, auth, logger }: WsContextContract, reason: string) {
    const room = this.getUserRoom(auth.user!)
    const userSockets = await socket.in(room).allSockets()

    // user is disconnected
    if (userSockets.size === 0) {
      // notify other users
      socket.nsp.emit('user:offline', auth.user)
    }

    logger.info('websocket disconnected', reason)
    console.log('websocket disconnecting: ', socket.id, reason);
  }

  public async changedState({ socket }: WsContextContract, {stateName, user}: {stateName: string, user: User}){
    socket.emit('changedStateMe', stateName );
    socket.broadcast.emit('changedStateOthers', {
      stateName: stateName,
      user: user 
    });
  }
}