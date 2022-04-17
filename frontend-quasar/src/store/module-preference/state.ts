export interface PreferenceStateInterface {
  init: boolean;
}

function state(): PreferenceStateInterface {
  return {
    init: false,
  };
}

export default state;
