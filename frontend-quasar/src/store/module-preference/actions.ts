import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { PreferenceStateInterface } from './state';
import { PreferenceData } from 'src/contracts';
import { activityService, preferenceService } from 'src/services';

const actions: ActionTree<PreferenceStateInterface, StateInterface> = {
  async savePreference({commit}, data: PreferenceData) {
    try {
      const preference = await preferenceService.savePreference(data);
      commit('authStore/SET_USER_PREFERENCE', {preference}, {root: true});
      return preference;
    } catch (err) {
      throw err;
    }
  },
  async userStateChanged({dispatch}, stateName: string) {
    await activityService.changedState(stateName);
    dispatch('authStore/updateUserPreference', stateName, {root: true})
  },
};

export default actions;
