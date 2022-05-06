import { User } from 'components/models';
import { authManager } from '.';
import { BootParams, SocketManager } from './managers/SocketManager';

class UserStateSocketManager extends SocketManager {
  public subscribe({ store }: BootParams): void {
    this.socket.on(
      'changedState',
      ({ stateName, user }: { stateName: string; user: User }) => {
        store.dispatch('channelStore/updateChannels', {
          user: user,
          userState: stateName,
        });
      }
    );

    authManager.onChange((token) => {
      if (token) {
        this.socket.connect();
      } else {
        this.socket.disconnect();
      }
    });
  }

  public changedState(stateName: string): Promise<string> {
    return this.emitAsync('changedState', stateName);
  }
}

export default new UserStateSocketManager('/');
