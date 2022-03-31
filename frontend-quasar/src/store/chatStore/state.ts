import { User } from 'components/models';

export interface ExampleStateInterface {
  loggedUser: User | null;
  users: User[] | null;
}

function state(): ExampleStateInterface {
  return {
    loggedUser: null,
    users: null,
  };
}

export default state;
