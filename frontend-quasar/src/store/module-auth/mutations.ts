import { User } from 'src/components/models';
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
  UPDATE_USER_PREFERENCE_STATE(state, stateName: string){
    state.user!.preference.stateName = stateName;
  },
  SET_USER_PREFERENCE(state, {preference}) {
    if (state.user)
      state.user.preference = preference;
  }
};

export default mutation;
