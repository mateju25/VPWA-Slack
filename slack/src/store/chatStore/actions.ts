import { User } from 'src/components/models';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ExampleStateInterface } from './state';

const actions: ActionTree<ExampleStateInterface, StateInterface> = {
  updateLoggedUserState ( context, loggedUser ) {
    context.commit('updateLoggedUser', loggedUser);
  },
  
  updateAllUsersState( context, users: User[] ){
    context.commit('updateAllUsers', users);
  },
  pushNewUserAction( context, user ){
    context.commit('pushNewUser', user);
  },
};

export default actions;
