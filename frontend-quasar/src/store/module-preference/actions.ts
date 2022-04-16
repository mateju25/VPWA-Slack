import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { PreferenceStateInterface } from './state';
import { PreferenceData } from 'src/contracts';
import { activityService, preferenceService } from 'src/services';
import { Preference, User } from 'src/components/models';

const actions: ActionTree<PreferenceStateInterface, StateInterface> = {
  async savePreference({}, data: PreferenceData) {
    try {
      return await preferenceService.savePreference(data);
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
