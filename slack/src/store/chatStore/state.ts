import { User } from 'components/models';

export interface ExampleStateInterface {
  loggedUser: User | null;
}

function state(): ExampleStateInterface {
  return {
    loggedUser: null,
  };
}

export default state;
