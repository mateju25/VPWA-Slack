import { User } from 'src/contracts';

export interface AuthStateInterface {
  user: User | null;
  status: 'nothing' | 'pending' | 'success' | 'error';
  errors: { message: string; field?: string }[];
}

function state(): AuthStateInterface {
  return {
    user: null,
    status: 'nothing',
    errors: [],
  };
}

export default state;
