import { localStorageKeys } from "../constants";

const trySetUserAuthInfo = (response: any) => {
  let isTokenUpdated = false;
  if (response.data && response.data.access_token) {
    localStorage.setItem(
        localStorageKeys.userAuthInfo,
      JSON.stringify({
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
      })
    );
    isTokenUpdated = true;
  }
  return isTokenUpdated;
};

const setValue = (storageKey: string, object: any) =>
  localStorage.setItem(storageKey, JSON.stringify(object));

// sets the local storage value for input key
const getValue = (key: string) => {
  return JSON.parse(window.localStorage.getItem(key)!);
};

const clearValue = (key: string) => {
  localStorage.removeItem(key);
};

// Note: Do not expose the local storage keys out side of this file until unless necessary
export const localStorageService = {
  setValue,
  getValue,
  clearValue,
  trySetUserAuthInfo,
  getUserAuthInfo: () => getValue(localStorageKeys.userAuthInfo),
};
