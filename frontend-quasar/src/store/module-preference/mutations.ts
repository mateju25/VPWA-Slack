import { Preference } from 'src/components/models';
import { MutationTree } from 'vuex';
import { PreferenceStateInterface } from './state';

const mutation: MutationTree<PreferenceStateInterface> = {
  LOAD_PREFERENCES(state, preferences: Preference){
    state.userPreference = preferences;
  },
  UPDATE_PREFERENCE(state, stateName: string) {
    state.userPreference!.stateName = stateName;
  },
}

export default mutation;