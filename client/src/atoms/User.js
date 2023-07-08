import { atom } from 'recoil';

export const admin = atom({
  key: 'Admin',
  default: false,
});

export const sessionToken = atom({
  key: 'JWTToken',
  default: null,
});

export const number = atom({
  key: 'Number',
  default: null,
});