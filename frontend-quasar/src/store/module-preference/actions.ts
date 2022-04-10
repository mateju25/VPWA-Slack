import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { PreferenceStateInterface } from './state';
import { PreferenceData } from 'src/contracts';
import { preferenceService } from 'src/services';

const actions: ActionTree<PreferenceStateInterface, StateInterface> = {
  async savePreference({}, data: PreferenceData) {
    try {
      return await preferenceService.savePreference(data);
    } catch (err) {
      throw err;
    }
  },
};

export default actions;
