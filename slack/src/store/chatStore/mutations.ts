import { MutationTree } from 'vuex';
import { ExampleStateInterface } from './state';
import { User } from 'components/models';

const mutation: MutationTree<ExampleStateInterface> = {
  updateLoggedUser(state: ExampleStateInterface, user: User) {
    state.loggedUser = user;
  },
  updateLoggedUserState(state: ExampleStateInterface, userState: string) {
    (state.loggedUser as User).state = userState;
  },
  updateLoggedUserNotifications(state: ExampleStateInterface, notifications: boolean) {
    (state.loggedUser as User).notificationsOn = notifications;
  },

  updateAllUsers(state: ExampleStateInterface, users: User[]){
    state.users = users;
  },
  pushNewUser(state: ExampleStateInterface, user: User){
    (state.users as User[]).push(user);
  }

};

export default mutation;
