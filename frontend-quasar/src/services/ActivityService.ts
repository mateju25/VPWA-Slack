import { User } from 'components/models';
import { authManager } from '.'
import { BootParams, SocketManager } from './managers/SocketManager';

class ActivitySocketManager extends SocketManager {
  public subscribe ({ store }: BootParams): void {
    this.socket.on('user:online', (user: User) => {
      console.log('User is online', user)
      store.commit('channelStore/UPDATE_CHANNELS', {user: user, userState: 'Online'})
    })

    this.socket.on('user:offline', (user: User) => {
      console.log('User is offline', user)
      store.commit('channelStore/UPDATE_CHANNELS', {user: user, userState: 'Offline'})
    })

    this.socket.on('changedStateMe',  (stateName: string) => {
      store.commit('preferenceStore/UPDATE_PREFERENCE', stateName);
      store.dispatch('authStore/updateUserPreference', store.state.preferenceStore.userPreference);
      store.dispatch('channelStore/updateChannels', {
        user: store.state.authStore.user,
        userState: store.state.preferenceStore.userPreference!.stateName
      });
    })

    this.socket.on('changedStateOthers',  ({stateName, user}: {stateName: string, user: User}) => {
      store.dispatch('channelStore/updateChannels', {
        user: user,
        userState: stateName
      });
    })

    authManager.onChange((token) => {
      if (token) {
        this.socket.connect()
      } else {
        this.socket.disconnect()
      }
    })
  }

  public changedState ({stateName, user}: {stateName: string, user: User}): Promise<string> {
    return this.emitAsync('changedState', {stateName: stateName, user: user });
  }
}

export default new ActivitySocketManager('/')