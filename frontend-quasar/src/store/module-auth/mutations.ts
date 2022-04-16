import { User } from 'src/components/models';
import { PreferenceData } from 'src/contracts';
import { MutationTree } from 'vuex';
import { AuthStateInterface } from './state';

const mutation: MutationTree<AuthStateInterface> = {
  AUTH_START(state) {
    state.status = 'pending';
    state.errors = [];
  },
  AUTH_SUCCESS(state, user: User | null) {
    state.status = 'success';
    state.user = user;
  },
  AUTH_ERROR(state, errors) {
    state.status = 'error';
    state.errors = errors;
  },
  UPDATE_USER_PREFERENCE(state, data: PreferenceData){
    state.user!.preference.darkMode = data.darkMode;
    state.user!.preference.notificationsOn = data.notificationsOn;
    state.user!.preference.stateName = data.stateName;
  },
};

export default mutation;
