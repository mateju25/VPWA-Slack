export interface ApiToken {
  type: 'bearer';
  token: string;
  expires_at?: string;
  expires_in?: number;
}

export interface RegisterData {
  email: string;
  username: string;
  fullname: string;
  password: string;
  passwordConfirmation: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface PreferenceData {
  darkMode: boolean;
  notificationsOn: boolean;
  stateName: string;
}

export interface ChannelData {
  name: string;
  isPrivate: boolean;
}
//
// export interface ChannelDeletionData {
//   channel: Channel;
//   user: User;
// }

