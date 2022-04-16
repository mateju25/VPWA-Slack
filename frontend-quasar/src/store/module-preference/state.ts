import { PreferenceData } from 'src/contracts';

export interface PreferenceStateInterface {
  init: boolean;
  userPreference: PreferenceData | null;
}

function state(): PreferenceStateInterface {
  return {
    init: false,
    userPreference: null
  };
}

export default state;
