import router from '@/router';
import { defineStore } from 'pinia';

export interface UserStoreState {
  token?: string;
}

export const useUserStore = defineStore('userStore', {
  state: (): UserStoreState => ({
    token: undefined,
  }),
  getters: {
    isUserLoggedIn: (userState: UserStoreState) => !!userState.token,
    roles: (userState: UserStoreState) => {
      if (userState.token) {
        const tokenInfo: TokenInfo = JSON.parse(
          atob(userState.token.split('.')[1]),
        );
        return tokenInfo.Role;
      }
      return [];
    },

    initials: (userState: UserStoreState): string => {
      if (userState.token) {
        const tokenInfo: TokenInfo = JSON.parse(
          atob(userState.token.split('.')[1]),
        );
        return `${tokenInfo.GivenName.charAt(0)}${tokenInfo.Surname.charAt(0)}`;
      }
      return '';
    },

    getAllInfo: (userState: UserStoreState): TokenInfo => {
      if (userState.token) {
        const tokenInfo: TokenInfo = JSON.parse(
          atob(userState.token.split('.')[1]),
        );
        return tokenInfo;
      }

      return {} as TokenInfo;
    },

    isAdmin: (userState: UserStoreState): boolean => {
      if (userState.token) {
        const tokenInfo: TokenInfo = JSON.parse(
          atob(userState.token.split('.')[1]),
        );
        return tokenInfo.Role.includes('Project Administrator');
      }
      return false;
    },
  },
  actions: {
    loginUser(user: UserStoreState) {
      this.token = user.token;
    },
    logout() {
      this.$reset();
      router.push({ name: 'signIn' });
    },
  },
  persist: true,
});

interface TokenInfo {
  Email: string;
  GivenName: string;
  Role: string[];
  Surname: string;
  aud?: string;
  exp?: number;
  iat?: number;
  iss?: string;
  sub?: string;
}
