import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';
import { authService, authManager } from 'src/services';
import { LoginCredentials, PreferenceData, RegisterData } from 'src/contracts';
import { Dark } from 'quasar';
import { User } from 'src/components/models';

const actions: ActionTree<AuthStateInterface, StateInterface> = {
  async check({ commit, dispatch }) {
    try {
      commit('AUTH_START');
      const user = await authService.me();

      //set dark mode based on preference
      if (user !== null){
        Dark.set((user as User).preference.darkMode);
        if(user.preference.stateName !== 'DND'){
          await dispatch('preferenceStore/savePreference', {
            notificationsOn: (user as User).preference.notificationsOn,
            darkMode: (user as User).preference.darkMode,
            stateName: 'Online',
          }, {root: true});
          user.preference.stateName = 'Online';
        }
        else {
          user.preference.stateName = 'DND';
        }
        dispatch('preferenceStore/loadPreferences', user.preference, { root: true });
      }
      commit('AUTH_SUCCESS', user);
      return user !== null;
    } catch (err) {
      commit('AUTH_ERROR', err);
      throw err;
    }
  },
  async register({ commit }, form: RegisterData) {
    try {
      commit('AUTH_START');
      const user = await authService.register(form);
      commit('AUTH_SUCCESS', null);
      return user;
    } catch (err) {
      commit('AUTH_ERROR', err);
      throw err;
    }
  },
  async login({ commit }, credentials: LoginCredentials) {
    try {
      commit('AUTH_START');
      const apiToken = await authService.login(credentials);
      commit('AUTH_SUCCESS', null);
      // save api token to local storage and notify listeners
      authManager.setToken(apiToken.token);
      return apiToken;
    } catch (err) {
      commit('AUTH_ERROR', err);
      throw err;
    }
  },
  async logout({ commit , dispatch}) {
    try {
      commit('AUTH_START');
      const user = await authService.me();
      
      //serialize user stateName before logout if not DND
      if (user !== null && user.preference.stateName !== 'DND'){
        await dispatch('preferenceStore/savePreference', {
          notificationsOn: (user as User).preference.notificationsOn,
          darkMode: (user as User).preference.darkMode,
          stateName: 'Offline',
        }, {root: true});
      }
      await authService.logout();
      await dispatch('channelStore/disconnect', null, { root: true })
      commit('AUTH_SUCCESS', null);
      // remove api token and notify listeners
      authManager.removeToken();
    } catch (err) {
      commit('AUTH_ERROR', err);
      throw err;
    }
  },

  async updateUserPreference({ commit }, data: PreferenceData){
    commit('UPDATE_USER_PREFERENCE', data);
  },
};

export default actions;
