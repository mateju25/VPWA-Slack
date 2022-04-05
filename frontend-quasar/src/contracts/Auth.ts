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

export interface User {
  id: number;
  email: string;
  username: string;
  fullname: string;
  channels: [];
  state_id: number;
  createdAt: string;
  updatedAt: string;
}
