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
};

export default mutation;
