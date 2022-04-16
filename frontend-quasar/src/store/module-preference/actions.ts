import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { PreferenceStateInterface } from './state';
import { PreferenceData } from 'src/contracts';
import { activityService, preferenceService } from 'src/services';
import { Preference, User } from 'src/components/models';

const actions: ActionTree<PreferenceStateInterface, StateInterface> = {
  async savePreference({commit}, data: PreferenceData) {
    try {
      const preference = await preferenceService.savePreference(data);
      commit('authStore/SET_PREFERENCE', {preference}, {root: true});
      return preference;
    } catch (err) {
      throw err;
    }
  },
  userStateChanged({}, {stateName, user}: {stateName: string, user: User}) {
    activityService.changedState({stateName: stateName, user: user });
  },
  loadPreferences({commit}, preferences: Preference){
    commit('LOAD_PREFERENCES', preferences);
  }
};

export default actions;
