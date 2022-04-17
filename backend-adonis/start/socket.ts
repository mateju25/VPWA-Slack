/*
|--------------------------------------------------------------------------
| Websocket events
|--------------------------------------------------------------------------
|
| This file is dedicated for defining websocket namespaces and event handlers.
|
*/

import Ws from '@ioc:Ruby184/Socket.IO/Ws';

Ws.namespace('/')
  .connected('UserStateController.onConnected')
  .disconnected('UserStateController.onDisconnected')
  .on('changedState', 'UserStateController.changedState');

// this is dynamic namespace, in controller methods we can use params.name
Ws.namespace('channels/:name')
  .on('loadMessages', 'MessageController.loadMessages')
  .on('addMessage', 'MessageController.addMessage')
  .on('deleteChannel', 'ChannelControllerWs.deleteChannel')
  .on('joinChannel', 'ChannelControllerWs.joinChannel')
  .on('kickFromChannel', 'ChannelControllerWs.kickFromChannel');
